import React from 'react';
import { X, Keyboard, Layers, Sparkles, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Help & Keyboard Shortcuts
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Quick guide to navigating TaskFlow smoothly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Shortcuts */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Keyboard className="w-4 h-4 text-sky-500" />
              <span>Productivity Shortcuts</span>
            </h4>
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Search tasks and projects</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono shadow-2xs">
                  ⌘ / Ctrl + K
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Quick create task</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono shadow-2xs">
                  N
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Toggle dark / light theme</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono shadow-2xs">
                  T
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Close open modal / dialog</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono shadow-2xs">
                  Esc
                </kbd>
              </div>
            </div>
          </div>

          {/* Architecture note */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Full-Stack Spring Boot Backend</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
              TaskFlow is backed by a production-ready Spring Boot 3 monolith with Spring Security 6, Spring Data JPA, and REST APIs. Click the <strong>"Architecture"</strong> badge in the top bar to inspect entity mappings, schema DDLs, and controller code.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
