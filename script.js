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
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const db = getFirestore();
const commentsRef = collection(db, "comments");
const questionsRef = collection(db, "questions");
const tagsRef = collection(db, "tags");
const usersRef = collection(db, "users");


// popup part---------------------------------------------------------------------------------------------------
function openForm() {
  var tmp = document.getElementById("myForm");
  tmp.style.visibility = "visible";
  console.log("click");
}

function closeForm() {
  document.getElementById("myForm").style.visibility = "hidden";
}

const questions = await getDocs(questionsRef);

const comments = await getDocs(commentsRef);
const allComments = comments.docs.map((comment) => ({
  docId: comment.id,
  ...comment.data(),
}));

document.querySelectorAll(".message").forEach((item) => {
  item.addEventListener("click", (event) => {
    var question__on__btn = item.innerText;
    console.log(question__on__btn);

    const allQuestions = questions.docs.map((question) => ({
      docId: question.id,
      ...question.data(),
    }));

    //clear all comments before add new ones
    const myNode = document.getElementById("com_ans");
    myNode.innerHTML = "";

    var check = false;
    for (let i = 0; i < allQuestions.length; i++) {
      // find the question that user click
      if (question__on__btn == allQuestions[i].question) {
        console.log("YES");
        check = true;

        const text = document.getElementById("question_text");
        text.textContent = "QUESTION: " + question__on__btn;

        // gets all comments in this question
        for (let j = 0; j < allQuestions[i].ID_comments.length; ++j) {
          var commentID = allQuestions[i].ID_comments[j];
          commentID = commentID.trim();
          
          // find all comment of this question
          for (let i = 0; i < allComments.length; i++) {
            if (commentID.toString() == allComments[i].docId.toString()) {
              console.log(allComments[i].comment);
              
              // add all comment to the popup box
              document.getElementById("com_ans").innerHTML +=
                '<div class="ans" id = "ans_text"><h3>' +
                allComments[i].comment +
                '</h3><button class="like__btn"><img src="like.png" alt="like" class="like__img"/>100</button></div>';
            }
          }
        }
      }
    }
    // if database does not have this question **impossible to has this case
    if (check == false) {
      console.log(2);
      const text = document.getElementById("question_text");
      text.textContent = "QUESTION: " + question__on__btn;

      const myNode = document.getElementById("com_ans");
      myNode.innerHTML = "";
    }

    openForm();
  });
});

document
  .querySelector(".popup__close-button")
  .addEventListener("click", closeForm);
//----------------------------------------------------------------------------------------------------------------