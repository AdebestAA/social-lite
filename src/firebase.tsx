
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtG73GSkSd_M7n2GFBn8wdg5lsVg3gE6I",
  authDomain: "social-lite-a2fa1.firebaseapp.com",
  projectId: "social-lite-a2fa1",
  storageBucket: "social-lite-a2fa1.appspot.com",
  messagingSenderId: "323843726447",
  appId: "1:323843726447:web:6347e27bebd62e2283c19a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getFirestore(app)
const storage = getStorage(app)

export {app,auth,storage,db}