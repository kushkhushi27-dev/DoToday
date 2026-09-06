import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

export interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}

const googleProvider = new GoogleAuthProvider();

/**
 * Register a new user
 */
export async function registerUser(credentials: AuthCredentials): Promise<User> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const firebaseUser = userCredential.user;

    // Create user document in Firestore
    const userData: Partial<User> = {
      id: firebaseUser.uid,
      username: credentials.username || credentials.email.split('@')[0],
      email: credentials.email,
      role: 'USER',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username || credentials.email}`,
      createdAt: new Date(),
      isActive: true,
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    return userData as User;
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    // Set session persistence
    await setPersistence(auth, browserSessionPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    return userDoc.data() as User;
  } catch (error: any) {
    throw new Error(error.message || 'Sign in failed');
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Sign out failed');
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user profile');
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    // Set session persistence
    await setPersistence(auth, browserSessionPersistence);

    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check if user already exists in Firestore
    let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      // Create new user profile in Firestore
      const newUserData: Partial<User> = {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role: 'USER',
        avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
        createdAt: new Date(),
        isActive: true,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
      console.log('New user profile created:', firebaseUser.uid);
      return newUserData as User;
    }

    console.log('User profile found:', firebaseUser.uid);
    return userDoc.data() as User;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(error.message || 'Google sign-in failed');
  }
}
