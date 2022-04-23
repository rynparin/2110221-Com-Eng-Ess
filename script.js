// 'use strict';

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
const usersRef = collection(db, 'users');

//! Nutt

let isLogin = false; // login status
let userId;

let numberOfQuestion = {
	FOREIGN_LANGUAGES: 1,
	MATH: 1,
	'P.E.': 1,
	ART: 1,
	HISTORY: 1,
	SCIENCE: 1,
	SOCIAL_STUDIES: 1,
	GEOGRAPHY: 1,
	OTHERS: 1,
	TECHNOLOGY: 1,
};
let addButton;
let questionID;
function addCommentHandler(e){
	e.preventDefault();

	if (document.getElementById('userAdd').value === '') {
		alert('Enter your comment');
	} else {
		console.log('call add comment')
		addComment();
	}
}
function openForm() {
	var tmp = document.getElementById('myForm');
	tmp.style.visibility = 'visible';
	console.log('click');

	// Add event listener to add comment and like

	//add addcomment handler
	addButton = document.querySelector('.add__submit__btn');

	addButton.addEventListener('click', addCommentHandler);

	document.querySelectorAll('.like__btn').forEach(async (button) => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();

			console.log(button.childNodes);
			const docId = button.childNodes[1].id;
			console.log(docId);

			const commentRef = await doc(db, `comments/${docId}`);
			let commentInstance = await getDoc(commentRef);
			commentInstance = commentInstance.data();
			console.log(commentInstance);

			if (!commentInstance.ID_Likes.includes(userId)) {
				console.log(commentInstance.ID_Likes);
				commentInstance.ID_Likes.push(userId);
				updateDoc(commentRef, commentInstance);
				button.childNodes[1].innerHTML =
					commentInstance.ID_Likes.length;
			} else {
				// remove user id from ID_Likes
				commentInstance.ID_Likes.splice(
					commentInstance.ID_Likes.indexOf(userId),
					1
				);
				updateDoc(commentRef, commentInstance);
				button.childNodes[1].innerHTML =
					commentInstance.ID_Likes.length;
			}
		});
	});
}

function closeForm() {
	addButton.removeEventListener('click', addCommentHandler);
	document.getElementById('myForm').style.visibility = 'hidden';
}

// when the POST button is clicked, it calls this function to generate the question to the question box
async function generateQuestion() {
	var question = document.getElementById('input_queston_text').value;
	var category = document.getElementById('question_types').value;
	var element = document.getElementById(category);
	if (question != '' && category != 'CHOOSE CATEGORY') {
		element.innerHTML +=
			'<div class="parent"><div class="child"><div class="number">' +
			numberOfQuestion[category] +
			'</div></div><div class="child"><div class="message">' +
			question +
			'<div class="comments"><button type="button" class="num_comment">comments</button></div></div></div></div>';
		numberOfQuestion[category] += 1;
		var ID_comments = [];
		addDoc(questionsRef, {
			ID_comments,
			category,
			question,
		});
		// After the question is posted, set each field to default value.
		document.getElementById('input_queston_text').value = '';
		document.getElementById('question_types').value = 'CHOOSE CATEGORY';
		await updateUI();
		return false;
	}
	alert(
		'Please make sure that you have already typed the question and selected the category of the question.'
	);
	return false;
}
window.generateQuestion = generateQuestion;

// when user is logging in, opacity = 100. Opacity = 0 otherwise.
function changeStyle() {
	var element = document.getElementById('mainElement');
	if (isLogin) {
		element.style.opacity = '100';
		return false;
	} else {
		element.style.opacity = '0';
		return false;
	}
}
window.changeStyle = changeStyle;

// onclick function for login button (checking username, lastname and the number of digit of student ID)
async function validate() {
	const firstname = document.getElementById('firstname').value;
	const lastname = document.getElementById('lastname').value;
	const studentId = document.getElementById('studentId').value;
	if (
		!isLogin &&
		firstname != '' &&
		lastname != '' &&
		studentId.length == 10
	) {
		document.getElementById('welcome-msg').innerHTML =
			'Welcome To STUDYTOGETHER';
		isLogin = true;
		changeStyle();
		addDoc(usersRef, {
			studentId,
			firstname,
			lastname,
		});
		userId = studentId;
		await generateOldQuestion();
		await updateUI();
		return false;
	} else if (
		!isLogin &&
		firstname != '' &&
		lastname != '' &&
		studentId.length != 10
	) {
		alert('Please make sure that your student ID is 10-digit number.');
		return false;
	} else {
		isLogin = false;
		document.getElementById('welcome-msg').innerHTML =
			'Please login before asking question !!!';
		document.getElementById('firstname').value = '';
		document.getElementById('lastname').value = '';
		document.getElementById('studentId').value = '';
		changeStyle();
		return false;
	}
	return false;
}
window.validate = validate;

async function updateUI() {
	document.querySelectorAll('.message').forEach((item) => {
		item.addEventListener('click', async (event) => {
			const questions = await getDocs(questionsRef);

			const comments = await getDocs(commentsRef);
			const allComments = comments.docs.map((comment) => ({
				docId: comment.id,
				...comment.data(),
			}));

			console.log(item);
			var question__on__btn = item.childNodes[0].nodeValue;
			console.log(question__on__btn);

			const allQuestions = questions.docs.map((question) => ({
				docId: question.id,
				...question.data(),
			}));

			//clear all comments before add new ones
			const myNode = document.getElementById('com_ans');
			myNode.innerHTML = '';

			var check = false;
			for (let i = 0; i < allQuestions.length; i++) {
				// find the question that user click
				console.log(allQuestions[i].question);
				if (question__on__btn == allQuestions[i].question) {
					console.log('YES');
					check = true;
					questionID = allQuestions[i].docId;

					// //TODO question ID for add comment
					// const questionID = allQuestions[i].docId;

					// //add addcomment handler
					// const addButton =
					// 	document.querySelector('.add__submit__btn');

					// addButton.addEventListener('click', function handler(e) {
					// 	e.preventDefault();
					// 	this.removeEventListener('click', handler);

					// 	if (document.getElementById('userAdd').value === '') {
					// 		alert('Enter your comment');
					// 	} else {
					// 		addComment(questionID);
					// 	}
					// });

					const text = document.getElementById('question_text');
					text.textContent = 'QUESTION: ' + question__on__btn;

					// gets all comments in this question
					for (
						let j = 0;
						j < allQuestions[i].ID_comments.length;
						++j
					) {
						var commentID = allQuestions[i].ID_comments[j];
						commentID = commentID.trim();

						// find all comment of this question
						console.log('find all comment of this question')
						for (let i = 0; i < allComments.length; i++) {
							if (
								commentID.toString() ==
								allComments[i].docId.toString()
							) {
								console.log(allComments[i].comment);

								// add all comments to the popup box
								console.log('add all comments to the popup box')
								document.getElementById('com_ans').innerHTML +=
									'<div class="ans" id = "ans_text"><h3>' +
									allComments[i].comment +
									`</h3><button class="like__btn"><img src="like.png" alt="like" class="like__img"/><p id="${commentID}">${allComments[i].ID_Likes.length}</p></button></div>`;
							}
						}
					}

				}
			}
			// if database does not have this question **impossible to has this case
			if (check == false) {
				console.log(2);
				const text = document.getElementById('question_text');
				text.textContent = 'QUESTION: ' + question__on__btn;

				const myNode = document.getElementById('com_ans');
				myNode.innerHTML = '';
			}

			openForm();
		});
	});

	document
		.querySelector('.popup__close-button')
		.addEventListener('click', closeForm);
}

// generate old question which is posted before.
async function generateOldQuestion() {
	const items = await getDocs(questionsRef);
	if (items) {
		const oldquestion = items.docs.map((item) => ({
			...item.data(),
		}));
		console.log(oldquestion);

		for (let i = 0; i < oldquestion.length; i++) {
			var element = document.getElementById(oldquestion[i].category);
			element.innerHTML +=
				'<div class="parent"><div class="child"><div class="number">' +
				numberOfQuestion[oldquestion[i].category]++ +
				'</div></div><div class="child"><div class="message">' +
				oldquestion[i].question +
				'<div class="comments"><button type="button" class="num_comment">comments</button></div></div></div></div>';
			// console.log(oldquestion[i].type);
			// console.log(oldquestion[i].question_text);
		}
	}
}
window.generateOldQuestion = generateOldQuestion;

// scroll
window.smoothScroll = function (target) {
	var scrollContainer = target;
	do {
		//find scroll container
		scrollContainer = scrollContainer.parentNode;
		if (!scrollContainer) return;
		scrollContainer.scrollTop += 1;
	} while (scrollContainer.scrollTop == 0);

	var targetY = 0;
	do {
		//find the top of target relatively to the container
		if (target == scrollContainer) break;
		targetY += target.offsetTop;
	} while ((target = target.offsetParent));

	scroll = function (c, a, b, i) {
		i++;
		if (i > 30) return;
		c.scrollTop = a + ((b - a) / 30) * i;
		setTimeout(function () {
			scroll(c, a, b, i);
		}, 20);
	};
	// start scrolling
	scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
};

//! add comment and like
//const addButton = document.querySelector('.add__submit__btn');

async function addCommentToDB(comment) {
	console.log('addItem');

	const ID_Likes = [];
	let commentID;
	await addDoc(commentsRef, {
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
			commentID = docRef.id;
		})
		.catch(function (error) {
			console.log(error);
		});
	return commentID;
}

async function addComment() {
	var tag = document.createElement('div');
	tag.className = 'ans';
	const h3 = document.createElement('H3');
	const commentText = document.getElementById('userAdd').value;
	h3.innerHTML = commentText;
	const button = document.createElement('button');
	button.className = 'like__btn';
	console.log('addComment()')
	const commentId = await addCommentToDB(commentText);
	button.innerHTML = `<img src="like.png" alt="like" class="like__img"/><p id="${commentId}">0</p>`;
	tag.appendChild(h3);
	tag.appendChild(button);

	// add eventlistener to new like button
	button.addEventListener('click', async (e) => {
		e.preventDefault();

		const docId = button.childNodes[1].id;
		console.log(docId);

		const commentRef = await doc(db, `comments/${docId}`);
		let commentInstance = await getDoc(commentRef);
		commentInstance = commentInstance.data();
		console.log(commentInstance);

		if (!commentInstance.ID_Likes.includes(userId)) {
			console.log(commentInstance.ID_Likes);
			commentInstance.ID_Likes.push(userId);
			updateDoc(commentRef, commentInstance);
			button.childNodes[1].innerHTML = commentInstance.ID_Likes.length;
		} else {
			// remove user id from ID_Likes
			commentInstance.ID_Likes.splice(
				commentInstance.ID_Likes.indexOf(userId),
				1
			);
			updateDoc(commentRef, commentInstance);
			button.childNodes[1].innerHTML = commentInstance.ID_Likes.length;
		}
	});

	document.getElementById('com_ans').appendChild(tag);
	console.log('add');
	document.getElementById('userAdd').value = "";
}
