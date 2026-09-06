import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, Firestore } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Retrieve API key from Vite environment variable
const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// If VITE_FIREBASE_API_KEY is missing, export a firebaseConfigError string
export const firebaseConfigError: string | null = !envApiKey
  ? 'VITE_FIREBASE_API_KEY is missing. Please define it in your .env file or environment variables.'
  : null;

// Firebase configuration loaded from JSON file + VITE_FIREBASE_API_KEY env var
const firebaseConfig = {
  ...firebaseAppletConfig,
  apiKey: envApiKey || firebaseAppletConfig.apiKey || '',
};

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
