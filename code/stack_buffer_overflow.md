## Stack buffer overflow

A stack buffer overflow is a memory corruption flaw where memory on the stack is overwritten outside of the buffer due to a lack of bounds checking. This can result in a program crash, alteration of critical values, and even code execution.

There are several functions in the C standard for obtaining user input that are unsafe due to the lack of bounds checking of values.

These are:

* gets()
* scanf()
* strcpy()

Additionally, there are C functions that operate on null terminated strings and perform no bounds checking.

These are:

* strcat()
* sprintf()
* vsprintf()

**Mitigation**

The mitigating code is to utilize the C functions for obtaining user input that specify maximum length as well as by checking the bounds of an array before writing to a buffer. 

Equivalent functions that check for length are:

* fgets()
* fscanf()
* strncpy() -> strlcpy()
* strncat()
* snprintf()

In specific cases, modifying the order of local variables declared will prevent those values from being overwritten though that does not prevent the overflowing capability. 

Other protection mechanisms against buffer overflows implemented by compilers and operating systems include:

* Stack canaries
* Address space layout randomization (ASLR)
* Executable space protection (NX)

However, in the right conditions, these protection mechanisms can be bypassed.

**Vulnerable Code**

### Example 1:

```
// compile with gcc -z execstack -fno-stack-protector -m32 stack_overflow_1.c
#include <stdio.h>
#include <string.h>

// stack buffer overflow example 1
int main() {
    int iFlag = 0;
    char szBuffer[15];
    // int iFlag = 0;  
    // changing the declaration of iFlag to here will prevent it from being overwritten in this case; however, other memory is still being overwritten

    printf("\n Enter the password : \n");

    gets(szBuffer);

    // mitigation: using a C function that checks for length
    // fgets(szBuffer, sizeof(szBuffer), stdin);

    if(strcmp(szBuffer, "password") == 0) {
        printf ("\n Correct Password \n");
        iFlag = 1;
    } else {
        printf ("\n Wrong Password \n");
    }

    if(iFlag != 0) {
        printf ("\n If password was wrong, this should not print \n");
    }

    return 0;
}
```

**Normal Program Output**

```
$ ./stack_overflow_1

 Enter the password : password

 Correct Password

 If password was wrong, this should not print 

$ ./stack_overflow_1

 Enter the password : wrongpassword

 Wrong Password
```

**Overflow Program Output**

```
$ ./stack_overflow_1

 Enter the password : AAAAAAAAAAAAAAAAAAAAAAAAAAA

 Wrong Password

 If password was wrong, this should not print 
```

### Example 2:

```
#include <stdio.h>

void printFlag() {
    printf("This function is not called by main\n");
}

int main() {
    char szBuffer[15];

    printf("\n Hi, what's your name?\n");

    gets(szBuffer);

    printf("\n It's nice to meet you %s\n", szBuffer);

    return 0;
}
```
