import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDk77Y0ivr51cnRbbbylNp0oMCqo7IlpSg",
  authDomain: "bethel-bible-2026.firebaseapp.com",
  projectId: "bethel-bible-2026",
  storageBucket: "bethel-bible-2026.firebasestorage.app",
  messagingSenderId: "1045992534138",
  appId: "1:1045992534138:web:f0e29174bf70968637cbc3",
  databaseURL: "https://bethel-bible-2026-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
