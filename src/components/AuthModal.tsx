import React, { useState } from 'react';
import { CheckSquare, Loader2, AlertCircle, Sparkles, X, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isPlaceholderConfig } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  reason
}) => {
  const { signInWithGoogle, error, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      clearError();
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error('[AuthModal] Google sign in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-900/20 text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close and continue viewing as guest"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/25 mx-auto mb-3">
            <CheckSquare className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Authentication</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Sign In to DoToday
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {reason || 'Sign in with your Google account to create, edit, and organize your tasks and projects.'}
          </p>
        </div>

        {/* Auth Required Notice */}
        <div className="mb-5 flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
          <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>You can view everything as a guest, but sign in is required to modify or save changes.</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-3.5">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                  Sign-in Issue
                </p>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder Domain Setup Alert */}
        {isPlaceholderConfig && !error && (
          <div className="mb-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Setup Notice
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                  If Google sign-in reports <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">redirect_uri_mismatch</code>, add your project's <code className="font-mono font-semibold">VITE_FIREBASE_AUTH_DOMAIN</code> to <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">.env.local</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          id="modal-google-signin-btn"
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full h-11 sm:h-12 flex items-center justify-center space-x-3 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSigningIn ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-sky-600 dark:text-sky-400" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Continue Viewing as Guest link */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors underline cursor-pointer"
          >
            Continue viewing as Guest (Read-Only)
          </button>
        </div>
      </div>
    </div>
  );
};
