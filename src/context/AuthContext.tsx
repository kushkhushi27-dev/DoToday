import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithPopup,
    signOut,
    deleteUser,
    onAuthStateChanged,
} from 'firebase/auth';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    writeBatch,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Known subcollections under users/{uid} for DoToday
const SUBCOLLECTIONS_TO_DELETE = [
    'tasks',
    'projects',
    'settings',
    'notifications',
    'activities',
    'comments',
];

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Auth restoration controls the app shell. Firestore profile sync is optional
            // and must not delay rendering when the network or rules are unavailable.
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                // Auto-sync user profile to Firestore: users/{uid} with merge: true
                void setDoc(
                    doc(db, 'users', currentUser.uid),
                    {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        lastLoginAt: new Date().toISOString(),
                    },
                    { merge: true }
                ).catch((syncError) => {
                    // Profile sync is best effort and must never block the app shell.
                    console.warn('Failed to auto-sync user profile to Firestore:', syncError);
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const clearError = (): void => {
        setError(null);
    };

    /**
     * Google Sign-In via signInWithPopup with GoogleAuthProvider
     * Forces account chooser with { prompt: 'select_account' }
     * Handles specific error codes with user-friendly messages
     */
    const signInWithGoogle = async (): Promise<void> => {
        try {
            setError(null);

            // Ensure account chooser prompt is enforced
            googleProvider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            let friendlyMessage = 'Failed to sign in with Google.';

            switch (err?.code) {
                case 'auth/unauthorized-domain':
                    friendlyMessage =
                        'This domain is not authorized for OAuth sign-in. Please add this domain to the Authorized Domains list in the Firebase Console (Authentication > Settings > Authorized domains).';
                    break;
                case 'auth/popup-closed-by-user':
                    friendlyMessage = 'Sign-in was cancelled.';
                    break;
                case 'auth/cancelled-popup-request':
                    friendlyMessage = 'Multiple sign-in attempts detected. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    friendlyMessage =
                        'Popup was blocked by your browser. Please allow popups for this site and try again.';
                    break;
                default:
                    friendlyMessage = err?.message || 'Failed to sign in with Google.';
                    break;
            }

            setError(friendlyMessage);
            const friendlyError = new Error(friendlyMessage);
            (friendlyError as any).code = err?.code;
            throw friendlyError;
        }
    };

    /**
     * Sign Out via signOut(auth)
     */
    const signOutUser = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await signOut(auth);
            setUser(null);
        } catch (err: any) {
            const message = err?.message || 'Sign out failed.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete Account:
     * 1. Batch-delete all subcollection documents (up to 500 per Firestore batch)
     * 2. Delete the user document in users/{uid}
     * 3. Call deleteUser(currentUser)
     * Handles auth/requires-recent-login gracefully
     */
    const deleteAccount = async (): Promise<void> => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            const msg = 'No authenticated user found to delete.';
            setError(msg);
            throw new Error(msg);
        }

        try {
            setLoading(true);
            setError(null);

            // 1. Batch-delete all subcollection docs (up to 500 per batch)
            for (const subColName of SUBCOLLECTIONS_TO_DELETE) {
                const subColRef = collection(db, 'users', currentUser.uid, subColName);
                const snapshot = await getDocs(subColRef);

                if (!snapshot.empty) {
                    let batch = writeBatch(db);
                    let count = 0;

                    for (const docSnapshot of snapshot.docs) {
                        batch.delete(docSnapshot.ref);
                        count++;

                        if (count === 500) {
                            await batch.commit();
                            batch = writeBatch(db);
                            count = 0;
                        }
                    }

                    if (count > 0) {
                        await batch.commit();
                    }
                }
            }

            // 2. Delete user document in Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);
            await deleteDoc(userDocRef);

            // 3. Delete Firebase Auth user
            await deleteUser(currentUser);
            setUser(null);
        } catch (err: any) {
            if (err?.code === 'auth/requires-recent-login') {
                const msg =
                    'This operation requires recent authentication. Please sign out and sign back in before deleting your account.';
                setError(msg);
                const sensitiveError = new Error(msg);
                (sensitiveError as any).code = err.code;
                throw sensitiveError;
            }

            const message = err?.message || 'Failed to delete account.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        signInWithGoogle,
        signOutUser,
        deleteAccount,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook (throws if used outside provider)
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
