import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// আপনার Work Tracker থেকে প্রাপ্ত আসল Firebase কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyBnLArPDFIG6Kr9OtkoCzhdFBHMbgzK8k0",
  authDomain: "cyprusstudentguidelogin.firebaseapp.com",
  projectId: "cyprusstudentguidelogin",
  storageBucket: "cyprusstudentguidelogin.firebasestorage.app",
  messagingSenderId: "215797465320",
  appId: "1:215797465320:web:afad34a9c5aa686772c95d",
  measurementId: "G-1RWQEC5L8D"
};

// Singleton App Instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 1-Click Google Sign-in Engine
export const loginWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // First time login: Create profile document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await setDoc(userDocRef, {
        profile: {
          displayName: user.displayName || "Student Member",
          email: user.email,
          photoURL: user.photoURL || "",
          city: "Limassol",
          institution: "",
          arrivalDate: ""
        },
        preferences: {
          defaultHourlyRate: 6.5,
          fleetCommission: 15,
          monthlyRentBudget: 450
        },
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return user;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};

// Logout Engine
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out Error:", error);
  }
};
