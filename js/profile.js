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

    const signOutLink = document.getElementById("signOutLink");
    signOutLink.onclick = () => {
      signOut(auth)
        .then(() => console.log("User has been signed out successfully"))
        .catch((err) => console.log(err));
    };

    const contentDiv = document.getElementById("content");
    const p = document.createElement("p");
    p.id = "greeting";
    // contentDiv.prepend(signOutLink);
    // contentDiv.prepend(p);

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
        bloodForm.classList.toggle("d-none");
        bloodDone.classList.toggle("d-none");
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
        thanalForm.classList.toggle("d-none");
        thanalDone.classList.toggle("d-none");
        console.log("Uploaded proof!");
      });
    });

    getDoc(userData)
      .then((snapshot) => {
        document.getElementById("content").classList.toggle("d-none");
        document.getElementById("wait").classList.toggle("d-none");
        const hours = snapshot.data().hours;
        const name = snapshot.data().name;
        const unit = snapshot.data().unit;
        document.getElementById("hourCount").textContent = hours;
        document.getElementById("name").textContent = name;
        document.getElementById("unit").textContent = unit;

        if (snapshot.data().bloodDone) {
          bloodForm.classList.toggle("d-none");
          bloodDone.classList.toggle("d-none");
        }
        if (snapshot.data().thanalDone) {
          thanalForm.classList.toggle("d-none");
          thanalDone.classList.toggle("d-none");
        }
      })
      .catch((e) => console.log(`Error: ${e}`));
  } else {
    window.location.href = "/login.html";
  }
});
