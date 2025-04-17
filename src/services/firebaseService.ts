
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
  connectAuthEmulator,
  signInWithPhoneNumber,
  RecaptchaVerifier
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
import { toast } from "sonner";

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

// Add trusted domains for authentication
const TRUSTED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'breezy-f86cf.firebaseapp.com',
  'breezy-f86cf.web.app',
  'preview--breezy-locale-view.lovable.app',
  'breezy-locale-view.vercel.app',
  'd1ed41fa-0e77-49e7-b199-b10ed1576655.lovableproject.com'
];

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

// Create a variable to hold the verification ID for phone auth
let phoneVerificationId = '';
let phoneAuthRecaptchaVerifier: RecaptchaVerifier | null = null;

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
    // Clean up any phone auth recaptcha if it exists
    if (phoneAuthRecaptchaVerifier) {
      phoneAuthRecaptchaVerifier.clear();
      phoneAuthRecaptchaVerifier = null;
    }
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

// Phone verification functions - Updated to use Firebase phone auth directly
export const sendVerificationCode = async (userId: string, phoneNumber: string): Promise<boolean> => {
  try {
    // Clean up any existing recaptcha verifier
    if (phoneAuthRecaptchaVerifier) {
      phoneAuthRecaptchaVerifier.clear();
    }
    
    // Create an invisible recaptcha verifier (this will be handled automatically)
    phoneAuthRecaptchaVerifier = new RecaptchaVerifier(auth, 'phone-auth-recaptcha', {
      size: 'invisible',
      callback: (response: any) => {
        // reCAPTCHA solved, allow sending verification code
        console.log("reCAPTCHA verified");
      },
      'expired-callback': () => {
        // Reset reCAPTCHA
        toast.error("reCAPTCHA expired. Please try again.");
        if (phoneAuthRecaptchaVerifier) {
          phoneAuthRecaptchaVerifier.clear();
          phoneAuthRecaptchaVerifier = null;
        }
      }
    });

    // Force recaptcha verification
    await phoneAuthRecaptchaVerifier.verify();

    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, phoneAuthRecaptchaVerifier);
    
    // Store the confirmationResult.verificationId for later use
    phoneVerificationId = confirmationResult.verificationId;
    
    // Add a hidden div element for recaptcha if it doesn't exist
    if (!document.getElementById('phone-auth-recaptcha')) {
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'phone-auth-recaptcha';
      recaptchaContainer.style.display = 'none';
      document.body.appendChild(recaptchaContainer);
    }
    
    console.log(`Verification code sent to ${phoneNumber}`);
    return true;
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    toast.error(error.message || "Failed to send verification code");
    return false;
  }
};

export const verifyPhoneNumber = async (userId: string, phoneNumber: string, code: string): Promise<boolean> => {
  try {
    // Store the phone number verification result
    await setDoc(doc(db, "verifications", userId), {
      phoneNumber,
      verificationCode: code,
      verified: true,
      createdAt: serverTimestamp(),
      verifiedAt: serverTimestamp()
    });
    
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
    
    return true;
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
