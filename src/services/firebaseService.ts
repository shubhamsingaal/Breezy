
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBicG2t5TkqHzZEOKXG-gQ8hJapC7OatbU",
  authDomain: "breezy-f86cf.firebaseapp.com",
  projectId: "breezy-f86cf",
  storageBucket: "breezy-f86cf.firebasestorage.app",
  messagingSenderId: "309680730290",
  appId: "1:309680730290:web:c71b3419303ca548b0d9ab",
  measurementId: "G-FZDZ7WZQGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User data functions
export const saveUserFavorites = async (userId: string, favorites: string[]) => {
  try {
    await setDoc(doc(db, "users", userId), {
      favoriteLocations: favorites
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving favorites:", error);
    return false;
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().favoriteLocations || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const addToFavorites = async (userId: string, location: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      favoriteLocations: arrayUnion(location)
    });
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
};

export const removeFromFavorites = async (userId: string, location: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      favoriteLocations: arrayRemove(location)
    });
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
};

export const saveUserSettings = async (
  userId: string, 
  settings: {
    unitSystem?: 'metric' | 'imperial',
    theme?: 'light' | 'dark',
    notificationEnabled?: boolean,
    email?: string,
    phoneVerified?: boolean
  }
) => {
  try {
    await setDoc(doc(db, "users", userId), {
      settings
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

export const getUserSettings = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().settings || {};
    }
    return {};
  } catch (error) {
    console.error("Error getting settings:", error);
    return {};
  }
};

// Phone verification functions
export const sendVerificationCode = async (userId: string, phoneNumber: string): Promise<boolean> => {
  try {
    // In a real implementation, you would call a Firebase Cloud Function to send SMS
    // For now, we'll simulate it by storing the verification attempt in Firestore
    // with a mock verification code (e.g. 123456)
    
    // Store the verification code in Firestore (in a real app, this would be done securely by a Cloud Function)
    const verificationCode = "123456"; // In production, generate this randomly
    
    await setDoc(doc(db, "verifications", userId), {
      phoneNumber,
      verificationCode,
      createdAt: serverTimestamp()
    });
    
    console.log("Verification code sent:", verificationCode);
    
    return true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    return false;
  }
};

export const verifyPhoneNumber = async (userId: string, phoneNumber: string, code: string): Promise<boolean> => {
  try {
    // In a real implementation, you would verify this with a Firebase Cloud Function
    // For now, we'll check against our stored mock code
    const verificationDoc = await getDoc(doc(db, "verifications", userId));
    
    if (!verificationDoc.exists()) {
      return false;
    }
    
    const verificationData = verificationDoc.data();
    const isCorrectCode = verificationData.verificationCode === code && 
                         verificationData.phoneNumber === phoneNumber;
    
    if (isCorrectCode) {
      // Update user profile with verified phone
      await updateDoc(doc(db, "users", userId), {
        phoneNumber,
        phoneVerified: true
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error verifying phone:", error);
    return false;
  }
};

// Email notification functions
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    // In a real implementation, you would call a Firebase Cloud Function to send the email
    // For now, we'll simulate it by logging the email content
    console.log(`Welcome email would be sent to ${email} for ${name}`);
    
    // In a real implementation, you would use Firebase Cloud Functions:
    // const sendWelcomeEmailFn = httpsCallable(functions, 'sendWelcomeEmail');
    // await sendWelcomeEmailFn({ email, name });
    
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

// Weather alert functions
export const subscribeToWeatherAlerts = async (userId: string, locations: string[]): Promise<boolean> => {
  try {
    await setDoc(doc(db, "weatherAlerts", userId), {
      locations,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error subscribing to weather alerts:", error);
    return false;
  }
};

export const sendWeatherAlert = async (userId: string, location: string, alertText: string): Promise<boolean> => {
  try {
    // In a real implementation, you would call a Firebase Cloud Function to send the email
    // For demonstration purposes, we'll just store the alert in Firestore
    await addDoc(collection(db, "sentAlerts"), {
      userId,
      location,
      alertText,
      sentAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error sending weather alert:", error);
    return false;
  }
};
