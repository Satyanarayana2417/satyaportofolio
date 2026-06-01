import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBi0eTWs95Mz6IK-triGS7PxwwDKHsCGxQ",
  authDomain: "my-portofolio-7b696.firebaseapp.com",
  projectId: "my-portofolio-7b696",
  storageBucket: "my-portofolio-7b696.firebasestorage.app",
  messagingSenderId: "634879803218",
  appId: "1:634879803218:web:31999921abae1a7b5cc48b",
  measurementId: "G-HWPXELSHSS",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
