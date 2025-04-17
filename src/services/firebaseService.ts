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
  RecaptchaVerifier,
  PhoneAuthProvider,
  PhoneInfoOptions
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
    
    // Send welcome email
    await sendWelcomeEmail(email, email.split('@')[0]);
    
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
      
      // Send welcome email for new users
      if (result.user.email) {
        await sendWelcomeEmail(result.user.email, result.user.displayName || 'User');
      }
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

// Phone verification functions - Completely rebuilt to work properly
export const sendVerificationCode = async (userId: string, phoneNumber: string): Promise<boolean> => {
  try {
    // Clean up any existing recaptcha verifier
    if (phoneAuthRecaptchaVerifier) {
      phoneAuthRecaptchaVerifier.clear();
      phoneAuthRecaptchaVerifier = null;
    }
    
    // Make sure we have a recaptcha container
    const recaptchaContainer = document.getElementById('phone-auth-recaptcha') || document.createElement('div');
    if (!recaptchaContainer.id) {
      recaptchaContainer.id = 'phone-auth-recaptcha';
      recaptchaContainer.style.display = 'none';
      document.body.appendChild(recaptchaContainer);
    }
    
    // Create an invisible recaptcha verifier
    phoneAuthRecaptchaVerifier = new RecaptchaVerifier(auth, 'phone-auth-recaptcha', {
      size: 'invisible',
      callback: () => {
        console.log("reCAPTCHA verified");
      },
      'expired-callback': () => {
        toast.error("reCAPTCHA expired. Please try again.");
        if (phoneAuthRecaptchaVerifier) {
          phoneAuthRecaptchaVerifier.clear();
          phoneAuthRecaptchaVerifier = null;
        }
      }
    });

    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(
      auth, 
      phoneNumber, 
      phoneAuthRecaptchaVerifier
    );
    
    // Store the confirmationResult globally (needs to be accessible for verification)
    // @ts-ignore - We're adding a custom property to the window object
    window.confirmationResult = confirmationResult;
    
    console.log(`Verification code sent to ${phoneNumber}`);
    
    // Store the phone number in local storage
    localStorage.setItem('phoneAuthNumber', phoneNumber);
    
    return true;
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    toast.error(error.message || "Failed to send verification code");
    
    // Clean up recaptcha on error
    if (phoneAuthRecaptchaVerifier) {
      phoneAuthRecaptchaVerifier.clear();
      phoneAuthRecaptchaVerifier = null;
    }
    
    return false;
  }
};

export const verifyPhoneNumber = async (userId: string, phoneNumber: string, code: string): Promise<boolean> => {
  try {
    // Get the confirmationResult from the window object
    // @ts-ignore - We're accessing a custom property from the window object
    const confirmationResult = window.confirmationResult;
    
    if (!confirmationResult) {
      throw new Error("Verification session expired. Please try again.");
    }
    
    // Confirm the verification code
    const result = await confirmationResult.confirm(code);
    
    if (result.user) {
      // Store the phone number verification result
      await setDoc(doc(db, "verifications", userId), {
        phoneNumber,
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
      
      // Clear the confirmation result
      // @ts-ignore
      window.confirmationResult = null;
      
      // Remove phone number from local storage
      localStorage.removeItem('phoneAuthNumber');
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Error verifying phone:", error);
    toast.error(error.message || "Failed to verify phone number");
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
      body: `Hello ${name || "there"}!

Welcome to Breezy Weather - your personal weather companion!

We're excited to have you join our community of weather enthusiasts. With Breezy Weather, you'll get:

• Real-time weather forecasts for any location
• Daily and hourly forecasts with beautiful visuals
• Weather alerts and notifications for your favorite locations
• Detailed weather information including UV index, air quality, and more
• Customizable settings to match your preferences

Our goal is to provide you with the most accurate and user-friendly weather experience possible. Whether you're planning your day, week, or a future trip, we've got you covered with reliable weather data.

Feel free to explore the app and add your favorite locations to stay updated with the latest weather conditions.

Stay Breezy!

The Breezy Weather Team`
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
