import React from 'react';
import {
  CheckSquare,
  LayoutDashboard,
  Trello,
  FolderKanban,
  Plus,
  Layers,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'tasks' | 'kanban' | 'projects';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'kanban' | 'projects') => void;
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  onOpenNewTaskModal: () => void;
  onOpenArchitectureModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  users,
  onSwitchUser,
  onOpenNewTaskModal,
  onOpenArchitectureModal
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-200 transition-transform group-hover:scale-105">
                <CheckSquare className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight flex items-center">
                  Task<span className="text-sky-600">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-0.5">
                  Enterprise
                </span>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-dashboard-tab"
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
              </button>

              <button
                id="nav-tasks-tab"
                onClick={() => setActiveTab('tasks')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-4 h-4 mr-1.5" />
                Tasks
              </button>

              <button
                id="nav-kanban-tab"
                onClick={() => setActiveTab('kanban')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'kanban'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Trello className="w-4 h-4 mr-1.5" />
                Kanban
              </button>

              <button
                id="nav-projects-tab"
                onClick={() => setActiveTab('projects')}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderKanban className="w-4 h-4 mr-1.5" />
                Projects
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Architecture Overview Button */}
            <button
              id="view-backend-architecture-btn"
              onClick={onOpenArchitectureModal}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Inspect Spring Boot Architecture"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
              <span className="hidden sm:inline">Spring Boot Spec</span>
            </button>

            {/* Quick Add Task */}
            <button
              id="quick-add-task-btn"
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-sky-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>New Task</span>
            </button>

            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                id="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.initials}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {currentUser.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Member'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Switch User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Active User (RBAC Demo)
                    </p>
                  </div>
                  <div className="py-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-50 transition-colors ${
                          u.id === currentUser.id ? 'bg-sky-50/50' : ''
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: u.avatarColor }}
                        >
                          {u.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {u.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            @{u.username} • {u.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Sub Navigation */}
        <div className="md:hidden flex items-center space-x-1 py-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'tasks' ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'kanban' ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
            }`}
          >
            Projects
          </button>
        </div>

      </div>
    </header>
  );
};
