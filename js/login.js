import { auth } from "./firebaseconfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "profile";
  } else {
    const form = document.getElementById("loginForm");
    const usernameField = document.getElementById("usernameField");
    const passwordField = document.getElementById("passwordField");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = usernameField.value;
      const password = passwordField.value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(`Signed up as: ${user.email}`);
          window.location.href = "profile.html";
        })
        .catch((err) => {
          console.log(`Error: ${err.code} ${err.message}`);
        });
    });
  }
});
