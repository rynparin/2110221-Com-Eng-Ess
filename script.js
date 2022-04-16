'use strict';

function openForm() {
	document.getElementById('myForm').style.visibility = 'visible';
	console.log('click');
}

function closeForm() {
	document.getElementById('myForm').style.visibility = 'hidden';
}

document.querySelector('.open-button').addEventListener('click', openForm);

document
	.querySelector('.popup__close-button')
	.addEventListener('click', closeForm);
