import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { TaskList } from './components/TaskList';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectList } from './components/ProjectList';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { ActivityView } from './components/ActivityView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { onAuthChange, getCurrentUser, getUserProfile } from './services/authService';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_COMMENTS,
  INITIAL_ACTIVITIES
} from './data/mockData';
import { User, Project, Task, TaskComment, ActivityLog, TaskStatus, NavTab } from './types';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [users] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [comments, setComments] = useState<TaskComment[]>(INITIAL_COMMENTS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Theme State - STRICTLY DEFAULT TO LIGHT MODE
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dotoday_theme');
      if (saved === 'dark') return true;
      return false; // Default to Light Mode
    }
    return false;
  });

  // Modals State
  const [defaultTaskProjectId, setDefaultTaskProjectId] = useState<number | undefined>(undefined);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [activeDetailTask, setActiveDetailTask] = useState<Task | null>(null);
  const [isProjectDetailModalOpen, setIsProjectDetailModalOpen] = useState(false);
  const [activeDetailProject, setActiveDetailProject] = useState<Project | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('dotoday_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('dotoday_theme', 'light');
    }
  }, [isDarkMode]);

  // Firebase Authentication Effect
  useEffect(() => {
    console.log('[Auth] Setting up auth listener');
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('[Auth] Auth state changed:', firebaseUser?.email);
      try {
        if (firebaseUser) {
          try {
            console.log('[Auth] Fetching user profile for:', firebaseUser.uid);
            const userProfile = await getUserProfile(firebaseUser.uid);
            console.log('[Auth] User profile fetched:', userProfile?.id);
            if (userProfile) {
              console.log('[Auth] Setting user and authenticated');
              setCurrentUser(userProfile);
              setIsAuthenticated(true);
            } else {
              console.warn('[Auth] User profile is null');
              setIsAuthenticated(false);
              setCurrentUser(null);
            }
          } catch (error) {
            console.error('[Auth] Failed to load user profile:', error);
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } else {
          console.log('[Auth] No Firebase user, clearing auth state');
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } finally {
        console.log('[Auth] Setting authLoading to false');
        setAuthLoading(false);
      }
    });

    return () => {
      console.log('[Auth] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      if (e.key === 'Escape') {
        setIsTaskModalOpen(false);
        setIsTaskDetailModalOpen(false);
        setIsProjectDetailModalOpen(false);
        setIsArchitectureModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsHelpModalOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleOpenNewTaskModal();
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleDarkMode();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsHelpModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDarkMode]);

  // Helper to log activities
  const logActivity = (
    action: string,
    description: string,
    entityType: 'TASK' | 'PROJECT' | 'COMMENT',
    entityId: number
  ) => {
    const newLog: ActivityLog = {
      id: Date.now(),
      action,
      description,
      entityType,
      entityId,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  // Task actions
  const handleOpenNewTaskModal = (projectId?: number) => {
    setTaskToEdit(null);
    setDefaultTaskProjectId(projectId);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskData.id) {
            const isNowCompleted = taskData.status === 'COMPLETED';
            return {
              ...t,
              ...taskData,
              completedAt: isNowCompleted ? t.completedAt || new Date().toISOString() : null
            } as Task;
          }
          return t;
        })
      );
      logActivity('TASK_UPDATED', `updated task "${taskData.title}"`, 'TASK', taskData.id);
    } else {
      // Create new task
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      const newTask: Task = {
        id: newId,
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        priority: taskData.priority || 'MEDIUM',
        status: taskData.status || 'TODO',
        dueDate: taskData.dueDate || null,
        category: taskData.category || 'General',
        projectId: taskData.projectId || null,
        assigneeId: taskData.assigneeId || null,
        creatorId: currentUser.id,
        createdAt: new Date().toISOString(),
        completedAt: taskData.status === 'COMPLETED' ? new Date().toISOString() : null
      };
      setTasks((prev) => [newTask, ...prev]);
      logActivity('TASK_CREATED', `created new task "${newTask.title}"`, 'TASK', newId);
    }
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const completedAt = newStatus === 'COMPLETED' ? new Date().toISOString() : null;
          logActivity(
            newStatus === 'COMPLETED' ? 'TASK_COMPLETED' : 'STATUS_CHANGED',
            `moved task "${t.title}" to ${newStatus.replace('_', ' ')}`,
            'TASK',
            taskId
          );
          return { ...t, status: newStatus, completedAt };
        }
        return t;
      })
    );

    // If modal is currently viewing this task, update it
    if (activeDetailTask && activeDetailTask.id === taskId) {
      setActiveDetailTask((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : null
            }
          : null
      );
    }
  };

  const handleToggleTaskStatus = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    handleUpdateTaskStatus(taskId, nextStatus);
  };

  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setComments((prev) => prev.filter((c) => c.taskId !== taskId));
    if (task) {
      logActivity('TASK_DELETED', `deleted task "${task.title}"`, 'TASK', taskId);
    }
    if (activeDetailTask && activeDetailTask.id === taskId) {
      setIsTaskDetailModalOpen(false);
      setActiveDetailTask(null);
    }
  };

  const handleAddComment = (taskId: number, content: string) => {
    const newCommentId = comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1;
    const newComment: TaskComment = {
      id: newCommentId,
      taskId,
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString()
    };
    setComments((prev) => [...prev, newComment]);

    const task = tasks.find((t) => t.id === taskId);
    logActivity(
      'COMMENT_ADDED',
      `commented on task "${task ? task.title : '#' + taskId}"`,
      'COMMENT',
      taskId
    );
  };

  // Project actions
  const handleCreateProject = (projectData: { name: string; description: string; color: string }) => {
    const newProjId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const newProject: Project = {
      id: newProjId,
      name: projectData.name,
      description: projectData.description,
      color: projectData.color,
      ownerId: currentUser.id,
      members: [],
      createdAt: new Date().toISOString()
    };
    setProjects((prev) => [newProject, ...prev]);
    logActivity('PROJECT_CREATED', `created new project "${newProject.name}"`, 'PROJECT', newProjId);
  };

  const handleAddMember = (projectId: number, userId: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const exists = p.members.some((m) => m.userId === userId);
          if (exists) return p;
          return {
            ...p,
            members: [...p.members, { userId, role: 'MEMBER' }]
          };
        }
        return p;
      })
    );

    const targetUser = users.find((u) => u.id === userId);
    const targetProj = projects.find((p) => p.id === projectId);
    logActivity(
      'MEMBER_ADDED',
      `added ${targetUser ? targetUser.fullName : 'collaborator'} to project "${targetProj ? targetProj.name : ''}"`,
      'PROJECT',
      projectId
    );

    if (activeDetailProject && activeDetailProject.id === projectId) {
      setActiveDetailProject((prev) =>
        prev
          ? {
              ...prev,
              members: [...prev.members, { userId, role: 'MEMBER' }]
            }
          : null
      );
    }
  };

  const handleRemoveMember = (projectId: number, userId: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            members: p.members.filter((m) => m.userId !== userId)
          };
        }
        return p;
      })
    );

    if (activeDetailProject && activeDetailProject.id === projectId) {
      setActiveDetailProject((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.filter((m) => m.userId !== userId)
            }
          : null
      );
    }
  };

  const handleOpenTaskDetail = (task: Task) => {
    setActiveDetailTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleOpenProjectDetail = (project: Project) => {
    setActiveDetailProject(project);
    setIsProjectDetailModalOpen(true);
  };

  const handleNavigateToKanbanWithProject = (projId?: number) => {
    setSelectedProjectId(projId || null);
    setActiveTab('kanban');
  };

  // Filter tasks based on global search query if entered
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  });

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-sky-200 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300">Loading DoToday...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      
      {/* 1. Left Sidebar Navigation (260px fixed width on desktop, overlay drawer on mobile/tablet) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        tasks={tasks}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          setActiveTab('kanban');
        }}
        onOpenNewTaskModal={() => handleOpenNewTaskModal()}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* 2. Main Workstation Area (Occupies all remaining width beside sidebar, never underneath) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          users={users}
          onSwitchUser={setCurrentUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenNewTaskModal={() => handleOpenNewTaskModal()}
          onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          activities={activities}
          notificationsCount={activities.length > 0 ? 3 : 0}
          onOpenSidebarMobile={() => setIsMobileMenuOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Dynamic Center & Right Panel Split */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          
          {/* Active View Container - smoothly scrollable and expands to full available width */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 min-w-0">
            <div className="w-full space-y-6">
              
              {activeTab === 'dashboard' && (
                <DashboardView
                  tasks={filteredTasks}
                  projects={projects}
                  users={users}
                  activities={activities}
                  currentUser={currentUser}
                  onNavigateToTasks={() => setActiveTab('my-tasks')}
                  onNavigateToKanban={handleNavigateToKanbanWithProject}
                  onNavigateToProjects={() => setActiveTab('projects')}
                  onOpenTaskDetail={handleOpenTaskDetail}
                  onOpenEditModal={handleOpenEditTaskModal}
                  onOpenNewTaskModal={() => handleOpenNewTaskModal()}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  onDeleteTask={handleDeleteTask}
                  onOpenNewProjectModal={() => setActiveTab('projects')}
                  onAddMember={() => {
                    if (projects.length > 0) {
                      handleOpenProjectDetail(projects[0]);
                    }
                  }}
                  onGenerateReport={() => {
                    setToastNotification('Productivity report generated and ready for export! 📊');
                    setTimeout(() => setToastNotification(null), 4000);
                  }}
                />
              )}

              {(activeTab === 'my-tasks' || (activeTab as string) === 'tasks') && (
                <TaskList
                  tasks={filteredTasks}
                  projects={projects}
                  users={users}
                  currentUser={currentUser}
                  onOpenTaskDetail={handleOpenTaskDetail}
                  onOpenEditModal={handleOpenEditTaskModal}
                  onOpenNewTaskModal={() => handleOpenNewTaskModal()}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {activeTab === 'kanban' && (
                <KanbanBoard
                  tasks={filteredTasks}
                  projects={projects}
                  users={users}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onOpenTaskDetail={handleOpenTaskDetail}
                  onOpenNewTaskModal={handleOpenNewTaskModal}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectList
                  projects={projects}
                  tasks={tasks}
                  users={users}
                  currentUser={currentUser}
                  onNavigateToKanban={handleNavigateToKanbanWithProject}
                  onOpenProjectDetail={handleOpenProjectDetail}
                  onCreateProject={handleCreateProject}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarView
                  tasks={filteredTasks}
                  projects={projects}
                  users={users}
                  onOpenTaskDetail={handleOpenTaskDetail}
                  onOpenNewTaskModal={handleOpenNewTaskModal}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  tasks={tasks}
                  projects={projects}
                  users={users}
                />
              )}

              {activeTab === 'activity' && (
                <ActivityView
                  activities={activities}
                  users={users}
                />
              )}

            </div>
          </main>

        </div>

      </div>

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
        projects={projects}
        users={users}
        defaultProjectId={defaultTaskProjectId}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => {
          setIsTaskDetailModalOpen(false);
          setActiveDetailTask(null);
        }}
        task={activeDetailTask}
        projects={projects}
        users={users}
        comments={comments}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateTaskStatus}
        onAddComment={handleAddComment}
        onEditTask={handleOpenEditTaskModal}
        onDeleteTask={handleDeleteTask}
      />

      <ProjectDetailModal
        isOpen={isProjectDetailModalOpen}
        onClose={() => {
          setIsProjectDetailModalOpen(false);
          setActiveDetailProject(null);
        }}
        project={activeDetailProject}
        tasks={tasks}
        users={users}
        currentUser={currentUser}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onOpenNewTaskModal={handleOpenNewTaskModal}
        onOpenTaskDetail={handleOpenTaskDetail}
        onToggleTaskStatus={handleToggleTaskStatus}
        onNavigateToKanban={handleNavigateToKanbanWithProject}
      />

      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

    </div>
  );
}
