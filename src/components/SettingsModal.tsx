import React from 'react';
import { X, Moon, Sun, Bell, Shield, User as UserIcon, Check } from 'lucide-react';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isDarkMode,
  onToggleDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workspace Settings
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Personal preferences and workspace appearance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* User profile card */}
          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-2xs"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                {currentUser.fullName}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {currentUser.email}
              </p>
              <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                {currentUser.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Workspace Member'}
              </span>
            </div>
          </div>

          {/* Appearance (Light / Dark) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Appearance Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => isDarkMode && onToggleDarkMode()}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  !isDarkMode
                    ? 'border-sky-500 bg-sky-50/50 text-sky-800 font-bold ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </div>
                {!isDarkMode && <Check className="w-3.5 h-3.5 text-sky-600" />}
              </button>

              <button
                type="button"
                onClick={() => !isDarkMode && onToggleDarkMode()}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isDarkMode
                    ? 'border-sky-500 bg-sky-950/50 text-sky-300 font-bold ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Dark Mode</span>
                </div>
                {isDarkMode && <Check className="w-3.5 h-3.5 text-sky-400" />}
              </button>
            </div>
          </div>

          {/* Notification toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Email & In-App Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Task assigned to me</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Daily deadline digest</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
