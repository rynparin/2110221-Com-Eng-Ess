'use strict';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDyo66tdyy-b-K6CWsU2ZvhbDISWVsW9gY',
	authDomain: 'testfirebase-b134a.firebaseapp.com',
	projectId: 'testfirebase-b134a',
	storageBucket: 'testfirebase-b134a.appspot.com',
	messagingSenderId: '183798996478',
	appId: '1:183798996478:web:f994edb5885dcbc7e134af',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// =======================================================
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

const db = getFirestore();
const commentsRef = collection(db, 'comments');
const questionsRef = collection(db, 'questions');
const tagsRef = collection(db, 'tags');
const usersRef = collection(db, 'users');

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

// =======================================================
const likeButton = document.querySelector('.like__btn');

const addButton = document.querySelector('.add__submit__btn');

async function getComments(question, comRefs) {
	console.log('getComments');

	const comments = [];

	for (let i = 0; i < comRefs.length; i++) {
		const comment = await doc(db, `comments/${comRefs[i]}`);
		let commentInstance = await getDoc(comment);
		commentInstance = commentInstance.data();
		comments.push(commentInstance);
	}

	console.log(comments);
}

// test get comment
const questions = await getDocs(questionsRef);
const newQuestions = questions.docs.map((question) => ({
	docId: question.id,
	...question.data(),
}));
console.log(newQuestions);
getComments('testttt', newQuestions[0].ID_comments);

// =======================================================

async function addCommentToDB(comment, questionID) {
	console.log('addItem');

	const ID_Likes = [];

	addDoc(commentsRef, {
		comment,
		ID_Likes,
	})
		.then(async function (docRef) {
			const questionRef = await doc(db, `questions/${questionID}`);
			let questionInstance = await getDoc(questionRef);
			questionInstance = questionInstance.data();
			console.log(questionInstance);
			questionInstance.ID_comments.push(docRef.id);
			console.log(questionInstance);
			updateDoc(questionRef, questionInstance);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function addComment() {
	var tag = document.createElement('div');
	tag.className = 'ans';
	const h3 = document.createElement('H3');
	const commentText = document.getElementById('userAdd').value;
	h3.innerHTML = commentText;
	const button = document.createElement('button');
	button.className = 'like__btn';
	button.innerHTML =
		'<img src="like.png" alt="like" class="like__img"/><p class="like__value">0</p>';
	tag.appendChild(h3);
	tag.appendChild(button);
	document.getElementById('comment01').appendChild(tag);
	console.log('add');

	addCommentToDB(commentText, newQuestions[0].docId);
}

addButton.addEventListener('click', (e) => {
	e.preventDefault();
	if (document.getElementById('userAdd').value === '') {
		alert('Enter your comment');
	} else {
		addComment();
	}
});

likeButton.addEventListener('click', (e) => {
	e.preventDefault();
	console.log('click');
	const like = document.querySelector('.like__value');
	const likeCount = parseInt(like.textContent);
	like.textContent = likeCount + 1;
	console.log(likeCount);
});
