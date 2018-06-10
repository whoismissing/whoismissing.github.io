## Format String Attack

A format string attack is when user supplied input is passed as the first argument to printf() or similar function. Because of the function's ability to take in a variable number of arguments and improper validation, this can be abused to read values of memory on the stack. In addition to this, values can also be written to memory. This can result in a program crash, alteration of critical values, and even code execution. One such technique is to overwrite the address of a function in the global offset table.

Below are examples of the format functions that when misused, can result in a format string attack:

* fprintf()
* printf()
* sprintf()
* snprintf()
* vfprintf()
* vprintf()
* vsprintf()
* vsnprintf()

The format parameters that have significant outcomes are:

* %x - Read data from the stack as hex values
* %s - Read character strings from memory
* %n - Write the number of characters to an address

### *printf()* and the stack

```

printf("a = %d     b = %d     c = %d", a, b, c);

// stack growing from high to low memory

0x00
         ^
         |          | address of string to be formatted |       printf will read
    stack growth    |             value of a            |       in this direction
      direction     |             value of b            |              |
                    |             value of c            |              V
0xFF
```

**Mitigation**

When passing user-supplied input to a printf() function, it is important to supply the format code as the first argument.

`printf("%s", user_input);`

Additionally, there are compiler flags and tools to perform static code analysis to check for format strings and produce warnings at compile time.

Address randomization is also a countermeasure that makes this attack more unreliable.

**Vulnerable Code**

```
#include <stdio.h>

int main() {
    char szBuffer[20];
    int x = 20;
    int y = 40;

    // obtain user input
    fgets(szBuffer, sizeof(szBuffer), stdin);

    // vulnerable usage of printf()
    printf(szBuffer);
    // mitigating code is to properly use printf("%s", szBuffer);

    return 0;
}
```

**Program Output**

```
$ ./format
AAAA%x%x%x%x

AAAA60201df7dd37902578257860201d
```

**Format string attack stack**
```

printf("AAAA%x%x%x%x");

// stack growing from high to low memory

0x00
         ^
         |          | address of szBuffer |            printf will read
    stack growth    |       unknown       | %x 1       in this direction
      direction     |       unknown       | %x 2             |
                    |       unknown       | %x 3             V
                    |       unknown       | %x 4
      szBuffer      |         AAAA        |
                    |         %x%x        |
                    |         %x%x        |
0xFF
```

Further Reading:

* http://www.cis.syr.edu/~wedu/Teaching/cis643/LectureNotes_New/Format_String.pdf