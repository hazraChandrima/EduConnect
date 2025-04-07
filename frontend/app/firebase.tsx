import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from '../firebase-config';

const app = initializeApp(FIREBASE_CONFIG);
const storage = getStorage(app);

export { storage };