// Credits to https://www.w3schools.com/howto/howto_js_typewriter.asp
var i = 0;
var txt = "Welcome to my little corner of the internet where I've curated resources that I've found to be useful and documented things I've learned on my journey on the path of InfoSec.";
var speed = 30;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("output").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}