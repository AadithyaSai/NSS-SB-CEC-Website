import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebaseconfig";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDoc(doc(db, "users", user.uid)).then((doc) => {
      console.log(doc.data());
      if (doc.data().isAdmin) {
        window.location.href = "adminprofile.html";
      } else {
        window.location.href = "profile.html";
      }
    });
  } else {
    const msgBox = document.getElementById("msgBox");
    const msgP = document.querySelector("#msgBox p");
    const loginForm = document.getElementById("loginForm");
    const forgotForm = document.getElementById("forgotForm");
    const usernameField = document.getElementById("usernameField");
    const forgotEmailField = document.getElementById("forgotUsernameField");
    const passwordField = document.getElementById("passwordField");
    const loginContent = document.getElementById("loginContent");
    const forgotContent = document.getElementById("forgotContent");
    const loginTxt = document.getElementById("loginTxt");
    const loginSpinner = document.getElementById("loginSpinner");

    document.getElementById("forgotLink").addEventListener("click", () => {
      loginContent.classList.toggle("disabled");
      forgotContent.classList.toggle("disabled");
    });

    document.getElementById("backLink").addEventListener("click", () => {
      loginContent.classList.toggle("disabled");
      forgotContent.classList.toggle("disabled");
    });

    forgotForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = forgotEmailField.value;

      sendPasswordResetEmail(auth, email)
        .then(() => {
          showToast("Password reset email sent!");
        })
        .catch((err) => {
          showToast("Error sending password reset email: " + err);
        });
    });

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      loginTxt.classList.toggle("opacity-0");
      loginSpinner.classList.toggle("opacity-0");

      const email = usernameField.value;
      const password = passwordField.value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(`Signed up as: ${user.email}`);
        })
        .catch((err) => {
          loginTxt.classList.toggle("opacity-0");
          loginSpinner.classList.toggle("opacity-0");
          usernameField.classList.add("is-invalid");
          passwordField.classList.add("is-invalid");
          showToast("Error signing in: " + err);
        });
    });
  }
});

function showToast(message) {
  const toastLiveExample = document.getElementById("liveToast");
  document.getElementById("toastBody").innerText = message;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}
