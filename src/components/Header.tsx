import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  Menu,
  Layers,
  Check,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { User, ActivityLog } from '../types';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  setSearchQuery?: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activities?: ActivityLog[];
  notificationsCount?: number;
  onOpenSidebarMobile?: () => void;
  onToggleMobileMenu?: () => void;
  onOpenArchitectureModal: () => void;
  onOpenNewTaskModal?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSwitchUser,
  searchQuery,
  onSearchChange,
  setSearchQuery,
  isDarkMode,
  onToggleDarkMode,
  activities = [],
  onOpenSidebarMobile,
  onToggleMobileMenu,
  onOpenArchitectureModal
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    if (setSearchQuery) setSearchQuery(val);
  };

  const handleMobileToggle = () => {
    if (onOpenSidebarMobile) onOpenSidebarMobile();
    if (onToggleMobileMenu) onToggleMobileMenu();
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Trigger + Search Bar */}
        <div className="flex items-center space-x-3 flex-1 max-w-lg">
          <button
            onClick={handleMobileToggle}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tasks, projects, or people..."
              className="w-full pl-9 pr-12 py-2 text-xs bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 pointer-events-none shadow-2xs">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Theme, Notifications & User */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Spring Boot Spec Button */}
          <button
            onClick={onOpenArchitectureModal}
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-xl transition-colors border border-sky-100/60 dark:border-sky-800/60"
            title="Inspect Spring Boot Architecture"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5 text-sky-600 dark:text-sky-400" />
            <span>Architecture</span>
          </button>

          {/* Cute Theme Pill Toggle (Sun & Moon) */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center p-1 bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700/60 rounded-full transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div
              className={`p-1 rounded-full transition-all ${
                !isDarkMode
                  ? 'bg-amber-400 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div
              className={`p-1 rounded-full transition-all ${
                isDarkMode
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Notification Bell with '3' Badge */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-[#0f172a]">
                3
              </span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.slice(0, 4).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start space-x-2.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                          {act.description}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(act.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              id="user-profile-button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold ring-2 ring-amber-100 dark:ring-slate-700 shadow-2xs shrink-0"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentUser.initials
                )}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-amber-500 dark:text-amber-400 font-medium flex items-center">
                  Get things done ✨
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>

            {/* User Switcher Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Switch Workspace User
                  </p>
                </div>
                <div className="py-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                          isSelected ? 'bg-sky-50/60 dark:bg-sky-950/40' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: u.avatarColor }}
                          >
                            {u.initials}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {u.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              @{u.username} • {u.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Member'}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
