import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, Firestore } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Retrieve Firebase credentials from Vite environment variables (with fallback to firebase-applet-config.json)
const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const envStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const envMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;
const envMeasurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

// Combined Firebase configuration
export const firebaseConfig = {
  apiKey: envApiKey || firebaseAppletConfig.apiKey || '',
  authDomain: envAuthDomain || firebaseAppletConfig.authDomain || '',
  projectId: envProjectId || firebaseAppletConfig.projectId || '',
  storageBucket: envStorageBucket || firebaseAppletConfig.storageBucket || '',
  messagingSenderId: envMessagingSenderId || firebaseAppletConfig.messagingSenderId || '',
  appId: envAppId || firebaseAppletConfig.appId || '',
  measurementId: envMeasurementId || firebaseAppletConfig.measurementId || '',
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || '(default)',
};

// Check whether configuration has placeholder values
export const isPlaceholderConfig =
  firebaseConfig.authDomain === 'dotoday-app.firebaseapp.com' ||
  firebaseConfig.projectId === 'dotoday-app';

// If VITE_FIREBASE_API_KEY is missing, export a firebaseConfigError string
export const firebaseConfigError: string | null = !firebaseConfig.apiKey
  ? 'VITE_FIREBASE_API_KEY is missing. Please define your Firebase credentials in your .env.local file.'
  : isPlaceholderConfig
  ? 'Firebase AuthDomain is using the placeholder "dotoday-app.firebaseapp.com". To fix Google OAuth redirect_uri_mismatch, please add your real Firebase credentials in .env.local.'
  : null;

// Singleton pattern: getApps().length ? getApp() : initializeApp(config)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore using firestoreDatabaseId from the config JSON
const customDatabaseId = firebaseAppletConfig.firestoreDatabaseId;
export const db: Firestore = customDatabaseId
  ? getFirestore(app, customDatabaseId)
  : getFirestore(app);

// Initialize Google Auth Provider with select_account prompt
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// OperationType enum
export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST',
  GET = 'GET',
  WRITE = 'WRITE',
}

/**
 * Logs structured JSON error with user auth info and re-throws the error.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string
): never {
  const err = error as { code?: string; message?: string; stack?: string } | null;
  const currentUser = auth.currentUser;

  const errorDetails = {
    error: {
      message: err?.message || String(error),
      code: err?.code || 'unknown',
      stack: err?.stack,
    },
    operationType,
    path,
    timestamp: new Date().toISOString(),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      displayName: currentUser?.displayName || null,
      isAnonymous: currentUser?.isAnonymous ?? null,
      emailVerified: currentUser?.emailVerified ?? null,
    },
  };

  console.error('[Firestore Error]', JSON.stringify(errorDetails, null, 2));
  throw error;
}

/**
 * Pings doc(db, 'test', 'connection') and returns true.
 * Treats 'permission-denied' as healthy since it confirms reachable connection to Firestore.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      return true;
    }
    console.error('Firestore connection test failed:', error);
    return false;
  }
}
