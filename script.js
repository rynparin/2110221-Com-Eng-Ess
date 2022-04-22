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

function openForm() {
  var tmp = document.getElementById("myForm");
  tmp.style.visibility = "visible";
  console.log("click");

}

function closeForm() {
  document.getElementById("myForm").style.visibility = "hidden";
}


const questions0 = await getDocs(questionsRef);

const comments = await getDocs(commentsRef);
const allComments = comments.docs.map((comment) => ({
  docId: comment.id,
  ...comment.data(),
}));

document.querySelectorAll(".message").forEach((item) => {
  item.addEventListener("click", (event) => {
    var question__on__btn = item.innerText;
    console.log(question__on__btn);
    const allQuestions = questions0.docs.map((question) => ({
      docId: question.id,
      ...question.data(),
    }));

    for (let i = 0; i < allQuestions.length; i++) {
      if (question__on__btn == allQuestions[i].question) {
        console.log("YES");

        const text = document.getElementById("question_text");
        text.textContent = "QUESTION: " + question__on__btn;

        for (let j = 0; j < allQuestions[i].ID_comments.length; ++j) {
          var commentID = allQuestions[i].ID_comments[j];
          commentID = commentID.trim();
          // console.log(commentID);

          for (let i = 0; i < allComments.length; i++) {
            if (commentID.toString() == allComments[i].docId.toString()) {
              console.log(allComments[i].comment);

              document
                .getElementById("com_ans")
                .insertAdjacentHTML(
                  "afterend",
                  '<div class="ans" id = "ans_text"><h3>' +
                    allComments[i].comment +
                    '</h3><button class="like__btn"><img src="like.png" alt="like" class="like__img"/>100</button></div>'
                );
            }
          }


          document.getElementsByClassName("comment").innerHTML = "";
          document.getElementsByClassName("comment__answers").innerHTML = "";
          document.getElementsByClassName("ans").innerText = "";

          // var element = document.getElementById("com_ans");
          // element.parentNode.removeChild(element);

        }
      } else {
        const text = document.getElementById("question_text");
        text.textContent = "QUESTION: " + question__on__btn;
      }
    }
    openForm();
  });
});

document
  .querySelector(".popup__close-button")
  .addEventListener("click", closeForm);
