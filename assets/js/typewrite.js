// Credits to https://www.w3schools.com/howto/howto_js_typewriter.asp
var i = 0;
var txt = "missing $: ls -hog # Currently working on";
var speed = 30;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("output").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        document.getElementById("output").innerHTML += "<p><a id=\"list\" href=\"http://bh-cookbook.github.io\">drwxr-xr-x  11    374B Jan 20 15:44 &nbsp &nbsp bh-cookbook</a></p>";
        document.getElementById("output").innerHTML += "<p><a id=\"list\" href=\"https://ropemporium.com/\">drwxr-xr-x 3 102B Dec 17 14:59 &nbsp &nbsp Rop Emporium</a></p>";
        document.getElementById("output").innerHTML += "<p><a id=\"list\" href=\"https://github.com/whoismissing/krang\">drwxr-xr-x 11 374B Dec 7 15:09 &nbsp &nbsp krang</a></p>";
        document.getElementById("output").innerHTML += "<p><a id=\"list\" href=\"https://github.com/whoismissing/shellcode\">drwxr-xr-x 6 204B Dec 17 14:57 &nbsp shellcode</a></p>";
    }
}
