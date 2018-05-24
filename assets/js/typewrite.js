// Credits to https://www.w3schools.com/howto/howto_js_typewriter.asp
var i = 0;
var txt = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia cum minus sit beatae unde quod quo id repudiandae maiores, aperiam saepe inventore, cupiditate dolore soluta perspiciatis, numquam facilis. Alias, rerum.";
var speed = 30;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("output").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}