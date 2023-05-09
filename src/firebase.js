import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgRCTQiMcrr_OeuZEy809Xcv3YThz5pqg",
  authDomain: "chat-42802.firebaseapp.com",
  projectId: "chat-42802",
  storageBucket: "chat-42802.appspot.com",
  messagingSenderId: "780577942590",
  appId: "1:780577942590:web:2b0f2c8ff2bcb10ab2756f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();