import React from 'react';
import { AlertTriangle, Key, ExternalLink, Terminal } from 'lucide-react';

interface ConfigurationNoticeProps {
  message?: string;
  onDismiss?: () => void;
}

export const ConfigurationNotice: React.FC<ConfigurationNoticeProps> = ({
  message = 'Firebase configuration is incomplete. Please define your Firebase credentials in your .env.local file.',
  onDismiss,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-xl w-full bg-white dark:bg-slate-800/95 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Configuration Required</h1>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">Firebase OAuth & Database Setup</p>
          </div>
        </div>

        {/* Notice Body */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          {message}
        </p>

        {/* Setup Guide Box */}
        <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 mb-6 space-y-3">
          <div className="flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400">
            <Terminal className="w-4 h-4 mr-1.5" />
            <span>Add your real credentials to <code className="text-amber-600 dark:text-amber-300 font-mono bg-amber-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">.env.local</code>:</span>
          </div>
          <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-5">
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=1:your-sender-id:web:your-app-id
          </pre>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p>1. Open <strong className="text-slate-700 dark:text-slate-200">Firebase Console</strong> ➔ Click ⚙️ <strong className="text-slate-700 dark:text-slate-200">Project Settings</strong> ➔ <strong className="text-slate-700 dark:text-slate-200">General</strong>.</p>
            <p>2. Scroll down to <strong className="text-slate-700 dark:text-slate-200">Your apps</strong> ➔ Copy your web app config values into <code className="text-sky-500 font-mono">.env.local</code>.</p>
            <p>3. Restart the dev server with <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-700 dark:text-slate-200">npm run dev</code>.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-sky-500/20"
          >
            <Key className="w-4 h-4 mr-1.5" />
            Open Firebase Console
            <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold transition-all border border-slate-300 dark:border-slate-600"
          >
            Reload App
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Dismiss
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
