import { auth, db, storage } from "./firebaseconfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

const bloodForm = document.getElementById("bloodForm");
const thanalForm = document.getElementById("thanalForm");
const bloodDone = document.getElementById("bloodDone");
const thanalDone = document.getElementById("thanalDone");
var uid = "";

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;

    const contentDiv = document.getElementById("content");
    const p = document.createElement("p");
    p.innerHTML = `hey ${user.email} <br />`;
    const signOutLink = document.createElement("a");
    signOutLink.text = "Sign Out";
    signOutLink.href = "/login.html";
    signOutLink.onclick = () => {
      signOut(auth)
        .then(() => console.log("User has been signed out successfully"))
        .catch((err) => console.log(err));
    };
    p.appendChild(signOutLink);
    contentDiv.prepend(p);

    const userData = doc(collection(db, "users"), uid);

    bloodForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const bloodCertFile = document.getElementById("bloodCert").files[0];
      const bloodCertRef = ref(storage, `${uid}/blood/certificate`);
      uploadBytes(bloodCertRef, bloodCertFile).then((snapshot) => {
        console.log("Uploaded cert!");
      });

      const bloodProofFile = document.getElementById("bloodProof").files[0];
      const bloodProofRef = ref(storage, `${uid}/blood/proof`);
      uploadBytes(bloodProofRef, bloodProofFile).then((snapshot) => {
        console.log("Uploaded proof!");
        bloodForm.classList.add("hide");
        bloodDone.classList.remove("hide");
        updateDoc(userData, {
          bloodDone: true,
        });
      });
    });

    thanalForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const thanalProofFile = document.getElementById("thanalProof").files[0];
      const thanalProofRef = ref(storage, `${uid}/thanal/proof`);
      uploadBytes(thanalProofRef, thanalProofFile).then((snapshot) => {
        updateDoc(userData, {
          thanalDone: true,
        });
        thanalForm.classList.add("hide");
        thanalDone.classList.remove("hide");
        console.log("Uploaded proof!");
      });
    });

    getDoc(userData)
      .then((snapshot) => {
        document.getElementById("content").classList.remove("hide");
        document.getElementById("wait").classList.add("hide");
        const hours = snapshot.data().hours;
        document.getElementById("hourCount").textContent = hours;

        if (snapshot.data().bloodDone) {
          bloodForm.classList.add("hide");
          bloodDone.classList.remove("hide");
        }
        if (snapshot.data().thanalDone) {
          thanalForm.classList.add("hide");
          thanalDone.classList.remove("hide");
        }
      })
      .catch((e) => console.log(`Error: ${e}`));
  } else {
    window.location.href = "/login.html";
  }
});
