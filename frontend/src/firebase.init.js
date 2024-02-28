import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZp-_o_cKXjFy7qpFHfkLpXn6SJNdzUHs",
  authDomain: "twitter-clone-d8c49.firebaseapp.com",
  projectId: "twitter-clone-d8c49",
  storageBucket: "twitter-clone-d8c49.appspot.com",
  messagingSenderId: "242715466892",
  appId: "1:242715466892:web:63dcd496b51097883dafa9",
  measurementId: "G-VPQ9CTDX3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const auth= getAuth(app);
auth.languageCode = 'it';
export {auth, db};