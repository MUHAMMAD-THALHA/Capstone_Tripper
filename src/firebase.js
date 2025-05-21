import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBeRCsHSVT4CMhlFcvNKImRsEFGBMBxwU",
  authDomain: "tripy-plan.firebaseapp.com",
  projectId: "tripy-plan",
  storageBucket: "tripy-plan.firebasestorage.app",
  messagingSenderId: "786553462068",
  appId: "1:786553462068:web:28e16bbafa2e1325991961",
  measurementId: "G-SFY8TMBPQ1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 