function setElement(array, elementID) {
	var randomNumber = Math.floor(Math.random() * (array.length));
	document.getElementById(elementID).innerHTML = array[randomNumber];
}

function setWebElements() {
	var adjectives = [
		'sleepy',
		'stinky',
		'dumb',
		'goofy'
	];
	setElement(adjectives, 'adjective');

	var identities = [
		'security researcher',
		'web developer',
		'computer scientist'
	];
	setElement(identities, 'identity');

	var adverbs = [
		'casually',
		'slowly',
		'badly'
	];
	setElement(adverbs, 'adverb');

	var projects = [
		'gizmo',
		'ctf\'s',
		'the wrong thing'
	];
	setElement(projects, 'project');
}

function refreshWebPage() {
	setWebElements();
}
