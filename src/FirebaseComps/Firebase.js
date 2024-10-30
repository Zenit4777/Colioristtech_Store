import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

const FirebaseConfig = {
  // Your Firebase configuration object
  apiKey: "AIzaSyBBUGvUY_DkYelzsdqqH9XjCKUftav7AV4",
  authDomain: "camarascctv-9ffaf.firebaseapp.com",
  projectId: "camarascctv-9ffaf",
  storageBucket: "camarascctv-9ffaf.appspot.com",
  messagingSenderId: "118396330963",
  appId: "1:118396330963:web:08751c8d312948420f4526",
  measurementId: "G-L4580F8F7V"
};

// Initialize Firebase
const AppFirebase = initializeApp(FirebaseConfig);
export const analytics = getAnalytics(AppFirebase);

export default AppFirebase