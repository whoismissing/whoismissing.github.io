## Automating RE - minimizing the noise

I'm lazy. 

When reverse engineering, I have found myself repeating various actions. For big binary files, there can be a fair amount of code that isn't related much to functionality or interesting at all. For those functions, I have made some attempts to automate the labelling process and will discuss my strategies below. When doing this, we have to understand that we are making assumptions and as a result of our automation, we may have false positives and miss what we are interested in looking for.

Imagine you are a paleontologist digging for bones. You could dig with a shovel and scratch at the surface bit-by-bit, but you could also speed up the process with some construction equipment to dig more quickly. With the construction equipment, what you gain in speed, you might also do some damage to those sweet, sweet dinosaur bones.

![Dinosaur Digging](./Dinosaur_Digging.png)

So it's a trade-off between speed and accuracy. To help in this area, we can limit our automation to only apply to very simple scenarios.

These automation strategies can be implemented in your disassembler framework API of choice, so the code examples will be presented in a generic pseudo-code.

#### Labelling functions that immediately return

Imagine the following decompiled code, when a function simply returns or returns a scalar value.

```c
void FUN_1() {
    return;
}
```

```c
int FUN_2() {
    return 1;
}
```

I typically would label `FUN_1` to `ret_FUN_1` and `FUN_2` to `ret_1_fun_2` to make the behavior obvious in my disassembler's function listing.

However, in order to automate this, we can apply the following limits:

1. Only apply to small functions
2. Only apply to a function that has not been labelled already
3. Only apply to leaf functions; functions that don't call another function

With these limits, we can perform the following algorithm:

```python
for func in functions:
    # check limit 1, skip over big functions
	if not small_func(func):
		continue
    # check limit 2, skip over already labelled functions
	if labelled_already(func):
		continue
     # check limit 3, skip over non-leaf functions
	if has_callees(func):
		continue
    # get the return value
    # if it exists, prepend to the new name
	ret_val = get_ret_val(func)
    if ret_val:
    	new_name = 'ret_' + str(ret_val) + '_' + func.name
    else:
        new_name = 'ret_' + func.name
	func.name = new_name
```

#### Labelling functions that just call a function pointer

Once again, let's take a look at the pseudo-source code of an example function

```c
void FUN_3(some_object * obj) {
    (code *) obj->virtual_method();
}
```

For this scenario, typically it is for C++ binaries riddled with small functions that call a virtual function pointer for an object. When viewing statically, often, it's not entirely clear what object the function is supposed to apply to since there is so much indirection and the values are best found at run-time. 

If there are a lot of functions that look like this, I choose to ignore them. I would label `FUN_3` to `code_ptr_FUN_3` and move on.

Note that there could still be interesting code in the function body such as setting up parameter values in a constructor. 

Similar to the previous [strategy](#labelling-functions-that-immediately-return), I apply the following limits: 

1. Only apply to small functions
2. Only apply to a function that has not been labelled already
3. Only apply to functions where there is only a single call performed

```python
for fun in functions:
    # check limit 1, skip over big functions
    if not small_func(func):
        continue
    # check limit 2, skip over already labelled functions
    if labelled_already(func):
        continue
    # check limit 3, skip over functions with more than one call
    if num_callees(func) > 1:
        continue
    # look for the indicator of a function pointer being called
    # such as a call [register] instruction
    # and rename the function if there is a match
    if call_code_ptr_found(func):
        new_name = 'code_ptr_' + func.name
        func.name = new_name		
```

### Labelling functions based on callees

For this strategy, I make the assumption that we can tell a lot about the functionality of a routine of code simply based on the subroutines it uses. The function itself could have code that does its own stuff but in this scenario I am going to pretend it doesn't exist by only targeting small functions.

Imagine we have the following callgraph where `FUN_4` calls the library functions `fopen` and `fread`. Purely based on the relationship of caller to callees, I am going to assume that some file opening and file reading is happening in `FUN_4` and I would label it `fopen_fread_FUN_4`. Sure it might do some stuff in between but I am choosing to ignore that for now.

```
                +-------------------------+
          +-----+       FUN_4             +-----+
          |     +-------------------------+     |
          v                                     v
+---------+----------+             +------------+----------+
|    fopen           |             |      fread            |
+--------------------+             +-----------------------+
```

Let's apply some limits to the strategy:

1. Only apply to medium and small-sized functions
2. Only apply to a function that has not been labelled already
3. Only apply to functions with a limited number of callees and the callees have to be external library calls

```python
for fun in functions:
    # check limit 1, skip over large functions
    if not medium_func(func):
        continue
    # check limit 2, skip over already labelled functions
    if labelled_already(func):
        continue
    # check limit 3, skip over functions with too many callees
    if num_callees(func) > 3:
        continue
    # get the callees that are library calls and prepend to the
    # function name
    callees = get_callees(func)
    new_name = ''
    for callee in callees:
        if from_library(callee):
            new_name += callee + '_'
    new_name += func.name
    func.name = new_name
```

### Labelling functions based on syscalls used

This strategy is similar to the previous one except it is more likely to be useful in the case of a static binary. Static binaries also happen to be larger than dynamically-linked binaries and I have found this automation strategy to be useful since static binaries have so much code.

```
                +-------------------------+
          +-----+       FUN_5             +-----+
          |     +-------------------------+     |
          v                                     v
+---------+----------+             +------------+----------+
|    mkdir           |             |      mount            |
+--------------------+             +-----------------------+
```

Looking at the callgraph above and being a lazy reverse engineer, I would rename `FUN_5` to `mkdir_mount_FUN_5`

I am lenient in my limits here:

1. Only apply to unlabelled functions
2. Only apply to functions with a limited number of syscalls

```python
for func in functions:
    # check limit 1, skip over already labelled functions
    if labelled_already(func):
        continue
    # check limit 2, skip over functions with too many syscalls
    num_syscalls = get_num_syscalls(func)
    if num_syscalls < 4:
        # get the syscalls used and prepend to the function name
        syscalls = get_syscalls(func)
        new_name = ''
        for syscall in syscalls:
            new_name += str(syscall) + '_'
        new_name += func.name
        func.name = new_name
```

### Labelling functions based on string references

Given the following decompiled code, the output strings may contain information related to the functionality of the routine.

```C
void FUN_6(int x, int y) {
    int z = x + y;
    printf("add = %d", z);
}
```

This technique is really prone to false-positives because it is dependent on the quality of strings left in the binary. Strings can be misleading but they can also be good on a case-by-case basis if they are intentionally provided such as debug strings or assert strings.

The limit here is to decide whether to use this strategy or not since it is basically a guess.

On that note, I would take the string reference, replace the spaces and label `FUN_6` to `GUESS_add_=_%d_FUN_6`

```python
for string in strings:
    # loop over the cross-references of the string
    xrefs = get_xrefs(string)
    for xref in xrefs:
        # if the cross-reference is from a function
        # relabel the function by prepending with the string
        func = getFunctionContaining(xref.address)
        if not labelled_already(func):
            new_name = string.replace(" ", "_")
            new_name += func.name
            func.name = new_name
```



There are definitely more scenarios in reverse engineering where automation can be applied helpfully and I look forward to experimenting more and figuring out what those are.

Happy hacking