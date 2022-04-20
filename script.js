"use strict";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyo66tdyy-b-K6CWsU2ZvhbDISWVsW9gY",
  authDomain: "testfirebase-b134a.firebaseapp.com",
  projectId: "testfirebase-b134a",
  storageBucket: "testfirebase-b134a.appspot.com",
  messagingSenderId: "183798996478",
  appId: "1:183798996478:web:f994edb5885dcbc7e134af",
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
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const db = getFirestore();
const commentsRef = collection(db, "comments");
const questionsRef = collection(db, "questions");
const tagsRef = collection(db, "tags");
const usersRef = collection(db, "users");

function openForm() {
  document.getElementById("myForm").style.visibility = "visible";
  console.log("click");
}

function closeForm() {
  document.getElementById("myForm").style.visibility = "hidden";
}

// document.querySelectorAll(".number").addEventListener("click", openForm);

document.querySelectorAll(".message").forEach((item) => {
  item.addEventListener("click", (event) => {
    //handle click
	openForm()
  });
});

document
  .querySelector(".popup__close-button")
  .addEventListener("click", closeForm);
