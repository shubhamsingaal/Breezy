
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
  signInWithPopup,
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

// Set persistence to local to ensure user stays logged in
auth.useDeviceLanguage();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      createdAt: serverTimestamp(),
      settings: {
        unitSystem: 'metric',
        theme: 'light',
        notificationEnabled: false
      }
    });
    
    return userCredential;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if this is a new user
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
    
    if (isNewUser) {
      // Create user document in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: serverTimestamp(),
        settings: {
          unitSystem: 'metric',
          theme: 'light',
          notificationEnabled: false
        }
      });
    } else {
      // Update last login time
      await updateDoc(doc(db, "users", result.user.uid), {
        lastLoginAt: serverTimestamp()
      });
    }
    
    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
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
    phoneVerified?: boolean,
    phoneNumber?: string
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
    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await setDoc(doc(db, "verifications", userId), {
      phoneNumber,
      verificationCode,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    });
    
    console.log(`Verification code ${verificationCode} generated for ${phoneNumber}`);
    
    // In a production app, we would send an SMS here
    // For now, we'll log it to the console
    console.log(`SMS would be sent to ${phoneNumber} with code: ${verificationCode}`);
    
    return true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    return false;
  }
};

export const verifyPhoneNumber = async (userId: string, phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const verificationDoc = await getDoc(doc(db, "verifications", userId));
    
    if (!verificationDoc.exists()) {
      console.error("No verification request found");
      return false;
    }
    
    const verificationData = verificationDoc.data();
    const isCorrectPhone = verificationData.phoneNumber === phoneNumber;
    const isCorrectCode = verificationData.verificationCode === code;
    const isExpired = new Date() > new Date(verificationData.expiresAt.toDate());
    
    if (isExpired) {
      console.error("Verification code expired");
      return false;
    }
    
    if (isCorrectPhone && isCorrectCode) {
      // Update user data with verified phone
      await updateDoc(doc(db, "users", userId), {
        phoneNumber,
        phoneVerified: true
      });
      
      // Update settings
      await setDoc(doc(db, "users", userId), {
        settings: {
          phoneNumber,
          phoneVerified: true
        }
      }, { merge: true });
      
      // Clean up verification document
      // await deleteDoc(doc(db, "verifications", userId));
      
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
    console.log(`Welcome email would be sent to ${email} for ${name}`);
    
    await addDoc(collection(db, "emailsSent"), {
      type: "welcome",
      email,
      name,
      sentAt: serverTimestamp(),
      subject: "Welcome to Breezy Weather!",
      body: `Hello ${name || "there"}! Welcome to Breezy Weather - your personal weather companion. Stay updated with real-time weather forecasts and alerts for your favorite locations.`
    });
    
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
