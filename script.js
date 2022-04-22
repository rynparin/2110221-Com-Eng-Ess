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
  // document.getElementById("myForm").style.visibility = "visible";
  console.log("click");
  // var tmp = document.querySelector(".message").innerText();
  // console.log(tmp.innerText);
}

function closeForm() {
  document.getElementById("myForm").style.visibility = "hidden";
}

// document.querySelectorAll(".number").addEventListener("click", openForm);

const questions0 = await getDocs(questionsRef);

const comments = await getDocs(commentsRef);
const allComments = comments.docs.map((comment) => ({
  docId: comment.id,
  ...comment.data(),
}));



document.querySelectorAll(".message").forEach((item) => {
  item.addEventListener("click", (event) => {

    //handle click
    var question__on__btn = item.innerText;
    console.log(question__on__btn);
    // const q = query(questionsRef, where("question", "==", question));
    // console.log(questions);
    const allQuestions = questions0.docs.map((question) => ({
      docId: question.id,
      ...question.data(),
    }));

    //async function getQuestion(allquestion) {
      for (let i = 0; i < allQuestions.length; i++) {
        // console.log(allQuestions[i]);
        if (question__on__btn == allQuestions[i].question){
          console.log("YES");
          
          const text = document.getElementById("question_text");
          text.textContent = "QUESTION: " + question__on__btn;
          
          for (let j = 0;j < allQuestions[i].ID_comments.length;++j){
            var commentID = allQuestions[i].ID_comments[j];
            commentID = commentID.trim();
            // console.log(commentID);
            
            for (let i = 0; i < allComments.length; i++) {
              // console.log(allComments[i].docId);
              // console.log(allComments[i].docId.toString());
              // console.log(commentID.toString());
              if (commentID.toString() == allComments[i].docId.toString()){
                console.log(allComments[i].comment);
                
                var element = document.getElementsByClassName("comment__answers");
                // element.innerHTML += '<div class="ans">' + allComments[i].comment+ '<button class="like__btn"><img src="like.png" alt="like" class="like__img"/>100</button></div>';
                // element.innerHTML += "<h3>This is the text which has been inserted by JS</h3>";
                // element.insertAdjacentHTML("afterend",
                // "<h3>This is the text which has been inserted by JS</h3>");
                // document.getElementById("ans__text").insertAdjacentHTML("afterend",
                // "<h3>This is the text which has been inserted by JS</h3>");
                document.getElementById("ans_text").insertAdjacentHTML("afterend",'<div class="ans" id = "ans_text"><h3>' + allComments[i].comment+ '</h3><button class="like__btn"><img src="like.png" alt="like" class="like__img"/>100</button></div>');
              }
            }
          }

        }

      }
    //}
    openForm();
  });
});



async function getComments(question, comRefs) {
  console.log("getComments");
  // console.log(comRefs);

  const comments = [];

  for (let i = 0; i < comRefs.length; i++) {
    const comment = await doc(db, `comments/${comRefs[i]}`);
    // console.log(comment);
    
    let commentInstance = await getDoc(comment);
    // console.log(commentInstance);

    commentInstance = commentInstance.data();
    // console.log(commentInstance);

    comments.push(commentInstance);
  }

  console.log(comments);
}

// test get comment
const questions = await getDocs(questionsRef);
// console.log(questions);
const newQuestions = questions.docs.map((question) => ({
  docId: question.id,
  ...question.data(),
}));
// console.log(newQuestions);
getComments("asd", newQuestions[0].ID_comments);

// if(document.getElementsByClassName('message').clicked == true)
// {
//   //  alert("button was clicked");
//   console.log("clickkkk");
// }

document
  .querySelector(".popup__close-button")
  .addEventListener("click", closeForm);
