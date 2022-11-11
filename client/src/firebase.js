import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
const firebaseConfig = {
  apiKey: process.env.APP_KEY,
  authDomain: "revflix-af00d.firebaseapp.com",
  projectId: "revflix-af00d",
  storageBucket: "revflix-af00d.appspot.com",
  messagingSenderId: "457035746458",
  appId: "1:457035746458:web:0afeece2e3e2bfba712323",
  measurementId: "G-9PCHJSQK0V"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;