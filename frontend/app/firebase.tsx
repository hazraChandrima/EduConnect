import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjPlyT6DOW1q-P_xy5YOGKRgV44lASNls",
  authDomain: "educonnect-d671c.firebaseapp.com",
  projectId: "educonnect-d671c",
  storageBucket: "educonnect-d671c.firebasestorage.app",
  messagingSenderId: "564455177528",
  appId: "1:564455177528:web:b2d2468fd6b62afa8215cd",
  measurementId: "G-8CXSCSXRM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
