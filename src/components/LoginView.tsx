import React, { useState, useEffect } from 'react';
import { Check, LogOut, Loader } from 'lucide-react';
import { signInWithGoogle, signOut as firebaseSignOut } from '../services/authService';

export function LoginView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // Don't reset loading - let App.tsx handle the redirect
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-sky-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header with logo */}
      <div className="relative flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-md">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Do<span className="text-sky-600 dark:text-sky-400">Today</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Collaborative Task Management</p>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            {/* Welcome section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Sign in with your Google account to continue
              </p>
            </div>

            {/* Error message */}
            {error && !isSigningIn && (
              <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg p-4">
                <p className="text-sm text-rose-700 dark:text-rose-300 flex items-start">
                  <svg className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Sign in button */}
            {!isSigningIn ? (
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            ) : (
              /* Loading state */
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-sky-200 dark:border-sky-900/30 border-t-sky-600 dark:border-t-sky-400 rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-center text-slate-600 dark:text-slate-400 font-medium">Signing in...</p>
                  <p className="text-center text-sm text-slate-500 dark:text-slate-500">Completing authentication</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs text-slate-500 dark:text-slate-500">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Info section */}
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">New to DoToday?</span><br />
                  Your account will be created automatically on first sign-in.
                </p>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-8">
            Secure authentication powered by Firebase & Google
          </p>
        </div>
      </div>
    </div>
  );
}
