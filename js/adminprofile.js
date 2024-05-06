import { auth, auth2, db, storage } from "./firebaseconfig";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login";
  }
});

const volunteers = [];

const deleteBatchBtn = document.getElementById("deleteBatch");
const resetHoursBtn = document.getElementById("resetHours");
const markAttendanceBtn = document.getElementById("markAttendance");
const getFilesBtn = document.getElementById("getFiles");
const addVolunteerBtn = document.getElementById("addVolunteer");
const addEventBtn = document.getElementById("addEvent");
const signOutBtn = document.getElementById("signOutBtn");

// elements from the volunteer form
const volunteerName = document.getElementById("name");
const volunteerEmail = document.getElementById("email");
const volunteerPhone = document.getElementById("phone");
const volunteerUnit = document.getElementById("unit");
const volunteerBatch = document.getElementById("batch");
const volunteerBlood = document.getElementById("bloodGroup");

const batch2 = document.getElementById("batch2");
const batch3 = document.getElementById("batch3");

const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= currentYear - 2; i--) {
  const option = document.createElement("option");
  option.value = `${i}-${i + 2}`;
  option.textContent = `${i}-${i + 2}`;
  volunteerBatch.appendChild(option);
  batch2.appendChild(option.cloneNode(true));
  batch3.appendChild(option.cloneNode(true));
}

// elements for file download
const volName2 = document.getElementById("volName2");
const fileLinks = document.getElementById("fileLinks");
const bloodCertBtn = document.getElementById("bloodCertBtn");
const bloodProofBtn = document.getElementById("bloodProofBtn");
const thanalBtn = document.getElementById("thanalBtn");

volName2.addEventListener("change", () => {
  if (volName2.value === "") {
    fileLinks.classList.add("d-none");
    return;
  }
  const doc = volunteers.find((vol) => vol.id === volName2.value);
  const data = doc.data();

  fileLinks.classList.remove("d-none");
  if (data.bloodDone) {
    bloodCertBtn.classList.remove("disabled");
    bloodProofBtn.classList.remove("disabled");

    const bloodCertRef = ref(storage, `${doc.id}/blood/certificate`);
    const bloodProofRef = ref(storage, `${doc.id}/blood/proof`);

    getDownloadURL(bloodCertRef)
      .then((url) => {
        bloodCertBtn.href = url;
      })
      .catch((error) => {
        showToast("Error getting blood certificate: " + error);
      });
    getDownloadURL(bloodProofRef)
      .then((url) => {
        bloodProofBtn.href = url;
      })
      .catch((error) => {
        showToast("Error getting blood certificate: " + error);
      });
  } else {
    bloodCertBtn.classList.add("disabled");
    bloodProofBtn.classList.add("disabled");
  }
  if (data.thanalDone) {
    thanalBtn.classList.remove("disabled");

    const thanalRef = ref(storage, `${doc.id}/thanal/proof`);
    getDownloadURL(thanalRef)
      .then((url) => {
        thanalBtn.href = url;
      })
      .catch((error) => {
        showToast("Error getting thanal certificate: " + error);
      });
  } else {
    thanalBtn.classList.add("disabled");
  }
});

// elements for attendance
const volName = document.getElementById("volName");
const hrs = document.getElementById("hrs");
const hrsDiv = document.getElementById("hrsDiv");

const q = query(
  collection(db, "users"),
  orderBy("name"),
  where("isAdmin", "==", false)
);
getDocs(q).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    volunteers.push(doc);
    const data = doc.data();
    volName.innerHTML += `<option value="${doc.id}">${data.name}</option>`;
    volName2.innerHTML += `<option value="${doc.id}">${data.name}</option>`;
  });
});

volName.addEventListener("change", () => {
  if (volName.value === "") {
    hrsDiv.classList.add("d-none");
    return;
  }
  const data = volunteers.find((vol) => vol.id === volName.value).data();
  hrs.value = data.hours;
  hrsDiv.classList.remove("d-none");
});

// add event stuff
const eventName = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const eventLink = document.getElementById("eventLink");

deleteBatchBtn.addEventListener("click", () => {
  console.log("deleteBatchBtn clicked");
  if (batch2.value === "") {
    showToast("Please select a batch");
    return;
  }
  const q = query(
    collection(db, "users"),
    where("batch", "==", batch2.value),
    where("isAdmin", "==", false)
  );
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`Deleting volunteer: ${doc.data().name}`);
      if (doc.data().thanalDone || doc.data().bloodDone) {
        deleteObject(ref(storage, `${doc.id}`))
          .then(() => {
            console.log("Files deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting files: ", error);
          });
      }
      deleteDoc(doc.ref)
        .then(() => {
          volunteers.splice(volunteers.indexOf(doc), 1);
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    });
  });
});

resetHoursBtn.addEventListener("click", () => {
  console.log("resetHoursBtn clicked");
  if (batch3.value === "") {
    showToast("Please select a batch");
    return;
  }
  const q = query(
    collection(db, "users"),
    where("batch", "==", batch3.value),
    where("isAdmin", "==", false)
  );
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        hours: 0,
      })
        .then(() => {
          console.log("Hours reset successfully");
        })
        .catch((error) => {
          console.error("Error resetting hours: ", error);
        });
    });
  });
});

markAttendanceBtn.addEventListener("click", () => {
  updateDoc(doc(db, "users", volName.value), {
    hours: parseInt(hrs.value),
  })
    .then(() => {
      showToast("Attendance marked successfully");
    })
    .catch((error) => {
      showToast("Error marking attendance: " + error);
    });
});

getFilesBtn.addEventListener("click", () => {
  console.log("getFilesBtn clicked");
});

addVolunteerBtn.addEventListener("click", () => {
  const name = volunteerName.value;
  const email = volunteerEmail.value;
  const phone = volunteerPhone.value;
  const unit = volunteerUnit.value;
  const batch = volunteerBatch.value;
  const blood = volunteerBlood.value;

  // ensure all fields are filled
  if (
    name === "" ||
    email === "" ||
    phone === "" ||
    unit === "" ||
    blood === "" ||
    batch === ""
  ) {
    showToast("Please fill all fields");
    return;
  }

  showToast("Adding volunteer...");
  const password = (name + unit).toLowerCase().replace(" ", "");
  createUserWithEmailAndPassword(auth2, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        phone: parseInt(phone),
        unit: parseInt(unit),
        batch: batch,
        bloodGroup: blood,
        hours: 0,
        bloodDone: false,
        thanalDone: false,
        isAdmin: false,
      })
        .then(() => {
          console.log("User data added to firestore successfully");
        })
        .catch((error) => {
          showToast("Error adding user data to firestore: " + error);
        });
      showToast("User added successfully");
    })
    .catch((error) => {
      showToast("Error adding user: " + error);
    });
});

addEventBtn.addEventListener("click", () => {
  const name = eventName.value;
  const date = eventDate.value;
  const link = eventLink.value;

  if (name === "" || date === "" || link === "") {
    showToast("Please fill all fields");
    return;
  }

  const eventId = (name + date).replaceAll(" ", "").replaceAll("-", "");
  setDoc(doc(db, "events", eventId), {
    name: name,
    date: new Date(date),
    link: link,
  })
    .then(() => {
      showToast("Event added successfully");
    })
    .catch((error) => {
      showToast("Error adding event: " + error);
    });
});

signOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      showToast("Signed Out!");
    })
    .catch((error) => {
      showToast("Error signing out: " + error);
    });
});

function showToast(message) {
  const toastLiveExample = document.getElementById("liveToast");
  document.getElementById("toastBody").innerText = message;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}
