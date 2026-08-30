import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Work Tracker এ ব্যবহৃত আপনার Firebase কনফিগারেশন এখানে বসান
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Singleton instance initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 1-Click Google Sign-in Handler
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check & create initial user profile document in Firestore if not exists
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
          arrivalDate: "",
          avatarChoice: "default"
        },
        preferences: {
          defaultHourlyRate: 6.5,
          fleetCommission: 15,
          monthlyRentBudget: 450
        },
        createdAt: new Date().toISOString()
      });
    }
    return user;
  } catch (error) {
    console.error("Authentication Error:", error);
    throw error;
  }
};

// Logout Handler
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out Error:", error);
  }
};
