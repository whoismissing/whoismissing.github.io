## Use after free

Use-after-free is a memory corruption flaw where memory can be accessed after being freed as a result of a dangling pointer. This can result in a program crash, use of unexpected values, and even code execution.

As seen in the code below, *malloc()* is called and will return an address that is stored in the pointer "pFree". Though the pointer is freed, it is used again in the second *strcpy()* as the pointer still contains the value of the address that *malloc()* returned. 

**Mitigation** 

The mitigating code is to set the value of the pointer to NULL after freeing as well as to create a new pointer when in need of performing another memory allocation.

**Vulnerable Code**

```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// use after free example
int main() {
    char * pFree;

    pFree = (char *) malloc(sizeof(char) * 100);
    strcpy(pFree, "Hello");

    printf("pFree = %p\n", pFree);
    printf("%s\n", pFree);

    free(pFree);

    // mitigation: NULL the pointer after freeing
    // pfree = NULL;

    strcpy(pFree + 5, " world");

    printf("pFree = %p\n", pFree);
    printf("%s\n", pFree);

    return 0;
}
```

**Program Output**

```
pFree = 0x7f93274027f0
Hello
pFree = 0x7f93274027f0
Hello world
```
