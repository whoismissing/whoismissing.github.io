function setElement(array, elementID) {
	var randomNumber = Math.floor(Math.random() * (array.length));
	document.getElementById(elementID).innerHTML = array[randomNumber];
}

function setWebElements() {
	var adjectives = [
		'sleepy',
		'stinky',
		'dumb',
		'goofy',
		'chilly',
		'hungry'
	];
	setElement(adjectives, 'adjective');

	var identities = [
		'security researcher',
		'software engineer',
		'reenigne esrever',
		'shower singer'
	];
	setElement(identities, 'identity');

	var adverbs = [
		'casually',
		'slowly',
		'badly'
	];
	setElement(adverbs, 'adverb');

	var projects = [
		'the riordan wiki',
		'silly projects',
		'ctf\'s',
		'the wrong thing',
		'gamecube controller asmr'
	];
	setElement(projects, 'project');
}

function refreshWebPage() {
	setWebElements();
}
