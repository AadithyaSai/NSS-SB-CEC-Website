import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmBGYZE4UUUrTdxLbb6eyb55I-FjERtNk",
  authDomain: "nss-sb-cec-website.firebaseapp.com",
  projectId: "nss-sb-cec-website",
  storageBucket: "nss-sb-cec-website.appspot.com",
  messagingSenderId: "367762379528",
  appId: "1:367762379528:web:9782d368e8ace090c512bd",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
