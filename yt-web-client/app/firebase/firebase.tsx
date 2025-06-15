// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, 
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTNJ4avNbk0DV5qkmL8Vi9Dzu2AcR9SmU",
  authDomain: "clone-2d9c6.firebaseapp.com",
  projectId: "clone-2d9c6",
  appId: "1:296066166592:web:77bfb1cf6c5ba6d9c414a5",
  measurementId: "G-ZMRKHF8H1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
  return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {   
  return onAuthStateChanged(auth, callback);
}