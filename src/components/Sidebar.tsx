import React from 'react';
import {
    Check,
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    Trello,
    Calendar as CalendarIcon,
    BarChart3,
    Activity,
    Settings,
    HelpCircle,
    Leaf,
    X
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
    activeTab: NavTab;
    setActiveTab: (tab: NavTab) => void;
    isOpenMobile?: boolean;
    isMobileMenuOpen?: boolean;
    onCloseMobile?: () => void;
    setIsMobileMenuOpen?: (open: boolean) => void;
    onOpenSettings?: () => void;
    onOpenHelp?: () => void;
    projects?: any[];
    tasks?: any[];
    selectedProjectId?: number | null;
    onSelectProject?: (id: number | null) => void;
    onOpenNewTaskModal?: () => void;
    isAuthenticated?: boolean;
    onOpenSignIn?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isOpenMobile,
    isMobileMenuOpen,
    onCloseMobile,
    setIsMobileMenuOpen,
    onOpenSettings,
    onOpenHelp,
    isAuthenticated = false,
    onOpenSignIn
}) => {
    const isMobileOpen = isOpenMobile ?? isMobileMenuOpen ?? false;
    const handleClose = () => {
        if (onCloseMobile) onCloseMobile();
        if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    const handleOpenSettings = () => {
        if (onOpenSettings) onOpenSettings();
        handleClose();
    };
    const handleOpenHelp = () => {
        if (onOpenHelp) onOpenHelp();
        handleClose();
    };

    const navItems: { id: NavTab; label: string; icon: React.ReactNode; colorClass: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, colorClass: 'text-sky-500' },
        { id: 'my-tasks', label: 'My Tasks', icon: <CheckSquare className="w-4 h-4" />, colorClass: 'text-emerald-500' },
        { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" />, colorClass: 'text-amber-500' },
        { id: 'kanban', label: 'Kanban', icon: <Trello className="w-4 h-4" />, colorClass: 'text-cyan-500' },
        { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" />, colorClass: 'text-rose-400' },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, colorClass: 'text-sky-500' },
        { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" />, colorClass: 'text-emerald-500' }
    ];

    const handleNavClick = (id: NavTab) => {
        setActiveTab(id);
        if (isMobileOpen) handleClose();
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    onClick={handleClose}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-[260px] bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800/80 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out
          lg:static lg:inset-auto lg:z-auto lg:shrink-0 lg:h-full lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Top Branding */}
                <div>
                    <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100/80 dark:border-slate-800/80">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs shadow-sky-200 dark:shadow-none">
                                <Check className="w-5 h-5 stroke-[2.8]" />
                            </div>
                            <div>
                                <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
                                    Do<span className="text-sky-600 dark:text-sky-400">Today</span>
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block -mt-0.5 font-medium">
                                    Your work, organized.
                                </span>
                            </div>
                        </div>

                        {/* Close button for mobile */}
                        <button
                            onClick={handleClose}
                            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-3.5 space-y-1">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    id={`sidebar-nav-${item.id}`}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${isActive
                                            ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold shadow-2xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <span
                                        className={`${isActive ? 'text-sky-600 dark:text-sky-400' : item.colorClass
                                            }`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-3.5 space-y-3">
                    {/* Divider */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

                    {/* Settings & Help */}
                    <div className="space-y-0.5">
                        <button
                            onClick={handleOpenSettings}
                            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span>Settings</span>
                        </button>
                        <button
                            onClick={handleOpenHelp}
                            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span>Help</span>
                        </button>
                    </div>

                    {/* Guest Sign-In Card if not logged in */}
                    {!isAuthenticated && onOpenSignIn && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border border-sky-100/80 dark:border-slate-700/60 text-center">
                            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                Guest Preview Mode
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                Sign in to create, edit, and sync tasks
                            </p>
                            <button
                                onClick={() => {
                                    handleClose();
                                    onOpenSignIn();
                                }}
                                className="mt-2 w-full py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-2xs"
                            >
                                Sign In with Google
                            </button>
                        </div>
                    )}

                    {/* Motivational Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-sky-100/60 dark:border-slate-700/60 relative overflow-hidden">
                        <div className="flex items-start space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-700/80 text-emerald-500 flex items-center justify-center shrink-0 shadow-2xs">
                                <Leaf className="w-3.5 h-3.5 stroke-[2.2]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                    Consistency builds progress.
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Small steps every day. ✨
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
