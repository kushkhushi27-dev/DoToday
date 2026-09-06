import React, { useState } from 'react';
import {
  Check,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Users,
  BarChart2,
  ListTodo,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Task, Project, User, ActivityLog } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  activities: ActivityLog[];
  currentUser: User;
  onNavigateToTasks: () => void;
  onNavigateToKanban: (projectId?: number) => void;
  onNavigateToProjects: () => void;
  onOpenTaskDetail: (task: Task) => void;
  onOpenEditModal: (task: Task) => void;
  onOpenNewTaskModal: (projectId?: number) => void;
  onToggleTaskStatus: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenNewProjectModal: () => void;
  onAddMember: () => void;
  onGenerateReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  currentUser,
  onNavigateToTasks,
  onOpenTaskDetail,
  onOpenEditModal,
  onOpenNewTaskModal,
  onToggleTaskStatus,
  onDeleteTask,
  onOpenNewProjectModal,
  onAddMember,
  onGenerateReport
}) => {
  const [taskFilterTab, setTaskFilterTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'OVERDUE'>('ALL');
  const [activeTaskMenu, setActiveTaskMenu] = useState<number | null>(null);

  // Calendar State for September 2026
  const [calendarMonth, setCalendarMonth] = useState<'AUG' | 'SEP' | 'OCT'>('SEP');
  const [selectedDay, setSelectedDay] = useState<number | null>(5); // Default to Today (Sept 5)

  const todayStr = '2026-09-05';
  const firstName = currentUser.fullName.split(' ')[0] || 'Alex';

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.dueDate && t.dueDate < todayStr
  ).length;

  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority counts
  const highPriority = tasks.filter((t) => t.priority === 'HIGH').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'MEDIUM').length;
  const lowPriority = tasks.filter((t) => t.priority === 'LOW').length;
  const noPriority = Math.max(0, totalTasks - (highPriority + mediumPriority + lowPriority));

  const getProjectById = (id: number | null) => projects.find((p) => p.id === id);

  // Filter tasks based on selected tab for Recent Tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilterTab === 'ACTIVE') return t.status !== 'COMPLETED';
    if (taskFilterTab === 'COMPLETED') return t.status === 'COMPLETED';
    if (taskFilterTab === 'OVERDUE') return t.status !== 'COMPLETED' && t.dueDate && t.dueDate < todayStr;
    return true;
  });

  // Calendar setup for September 2026:
  // Starts on Tuesday (1 offset if Mon=0), 30 days
  const monthData = {
    AUG: { name: 'August 2026', days: 31, offset: 5 },
    SEP: { name: 'September 2026', days: 30, offset: 1 },
    OCT: { name: 'October 2026', days: 31, offset: 3 }
  };

  const currentMonthInfo = monthData[calendarMonth];

  // Map tasks to days in September 2026
  const tasksByDay: { [day: number]: Task[] } = {};
  if (calendarMonth === 'SEP') {
    tasks.forEach((t) => {
      if (t.dueDate && t.dueDate.startsWith('2026-09-')) {
        const dayNum = parseInt(t.dueDate.split('-')[2], 10);
        if (!tasksByDay[dayNum]) tasksByDay[dayNum] = [];
        tasksByDay[dayNum].push(t);
      }
    });
  }

  // Pre-configured colored dots matching the reference image calendar
  const referenceCalendarDots: { [day: number]: string } = {
    1: 'bg-emerald-400',
    2: 'bg-emerald-400',
    4: 'bg-rose-400',
    8: 'bg-amber-400',
    10: 'bg-sky-400',
    11: 'bg-emerald-400',
    19: 'bg-sky-400',
    22: 'bg-amber-400',
    23: 'bg-emerald-400',
    26: 'bg-rose-400',
    27: 'bg-amber-400',
    28: 'bg-emerald-400'
  };

  // Upcoming deadlines (uncompleted tasks, sorted by due date)
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'COMPLETED' && t.dueDate)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 4);

  // Format relative date display
  const formatDeadlineDate = (dueDate: string) => {
    if (dueDate === '2026-09-05') return 'Today';
    if (dueDate === '2026-09-06') return 'Tomorrow';
    if (dueDate === '2026-09-08') return '8 Sep';
    if (dueDate === '2026-09-10') return '10 Sep';
    if (dueDate === '2026-09-12') return '12 Sep';
    if (dueDate < todayStr) return 'Overdue';
    const parts = dueDate.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[parseInt(parts[1], 10) - 1];
      return `${day} ${month}`;
    }
    return dueDate;
  };

  // Helper for dot color
  const getTaskDotColor = (priority: string, isOverdue: boolean) => {
    if (isOverdue || priority === 'HIGH') return 'bg-rose-400';
    if (priority === 'MEDIUM') return 'bg-amber-400';
    return 'bg-sky-400';
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT / MAIN COLUMN (8 cols on XL screens)
          Hero Section, 4 Stats Cards, Analytics, Recent Tasks
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="xl:col-span-8 space-y-6 min-w-0">
        
        {/* 1. HERO SECTION WITH NATURE ILLUSTRATION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e0f2fe] via-[#ecfdf5] to-[#fef3c7] dark:from-[#13233c] dark:via-[#112a3d] dark:to-[#1f2937] border border-sky-100/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
          
          {/* Nature Illustration Background (Sun, Clouds, Soft Blue Mountains, Green Leaves) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-end">
            <svg
              viewBox="0 0 800 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover object-right-bottom opacity-70 dark:opacity-25"
            >
              {/* Soft Sunshine Rays */}
              <circle cx="560" cy="85" r="55" fill="#fef08a" fillOpacity="0.5" />
              <circle cx="560" cy="85" r="40" fill="#fde047" fillOpacity="0.7" />
              <circle cx="560" cy="85" r="26" fill="#fbbf24" fillOpacity="0.8" />

              {/* Fluffy Clouds */}
              <path
                d="M360 90C360 82 366 75 374 75C377 75 380 76 382 78C386 71 393 66 401 66C412 66 421 74 422 84C424 83 427 83 429 83C437 83 444 89 444 98C444 106 437 113 429 113H374C366 113 360 106 360 98V90Z"
                fill="#ffffff"
                fillOpacity="0.85"
              />
              <path
                d="M510 60C510 54 515 49 521 49C523 49 525 50 527 51C530 46 535 42 541 42C550 42 557 48 558 56C559 55 561 55 563 55C569 55 574 60 574 66C574 72 569 77 563 77H521C515 77 510 72 510 66V60Z"
                fill="#ffffff"
                fillOpacity="0.75"
              />

              {/* Layered Mountains */}
              {/* Distant soft sky-blue mountain */}
              <path
                d="M240 240L380 130C388 123 400 123 408 130L550 240H240Z"
                fill="#bae6fd"
                fillOpacity="0.5"
              />
              {/* Middle mint green mountain */}
              <path
                d="M350 240L490 145C497 139 507 139 514 145L650 240H350Z"
                fill="#a7f3d0"
                fillOpacity="0.5"
              />
              {/* Foreground rolling green hill */}
              <path
                d="M480 240C540 200 620 180 720 195L820 240H480Z"
                fill="#6ee7b7"
                fillOpacity="0.4"
              />

              {/* Decorative Green Leaves & Plants on the left */}
              <path
                d="M0 240C20 180 60 140 120 120C100 160 80 200 0 240Z"
                fill="#34d399"
                fillOpacity="0.45"
              />
              <path
                d="M10 240C40 200 80 170 140 160C120 190 90 220 10 240Z"
                fill="#10b981"
                fillOpacity="0.35"
              />
              <path
                d="M-20 200C10 170 40 150 90 140C70 170 40 190 -20 200Z"
                fill="#6ee7b7"
                fillOpacity="0.5"
              />

              {/* Leaves on the far right */}
              <path
                d="M750 240C730 200 700 170 650 150C680 180 710 210 750 240Z"
                fill="#34d399"
                fillOpacity="0.4"
              />
              <path
                d="M780 220C750 180 720 160 670 140C700 170 730 200 780 220Z"
                fill="#10b981"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-lg">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Good morning, {firstName}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Here's what's happening with your tasks today.
              </p>
              
              {/* Cute Create Task Button */}
              <div className="pt-2">
                <button
                  id="hero-create-task-btn"
                  onClick={() => onOpenNewTaskModal()}
                  className="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-bold rounded-2xl shadow-xs shadow-sky-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                  + Create Task
                </button>
              </div>
            </div>

            {/* Motivational Speech Bubble / Banner Card */}
            <div className="shrink-0 max-w-xs">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-xs text-right">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 italic leading-snug">
                  “A little progress each day adds up to big results.”
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1 text-sky-600 dark:text-sky-400 font-bold text-xs">
                  <span>♡</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FOUR STATISTICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* TOTAL TASKS (Baby Blue) */}
          <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Total Tasks
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block leading-tight">
                {totalTasks}
              </span>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                ↑ 2 from last week
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center shrink-0">
              <ListTodo className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          {/* COMPLETED (Mint Green) */}
          <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Completed
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block leading-tight">
                {completedTasks}
              </span>
              <span className="text-[11px] text-emerald-500 font-semibold block mt-1">
                {completionPercent}% completion
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-400 text-white flex items-center justify-center shrink-0 shadow-xs shadow-emerald-200 dark:shadow-none">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
          </div>

          {/* IN PROGRESS (Soft Orange) */}
          <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                In Progress
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block leading-tight">
                {inProgressTasks}
              </span>
              <span className="text-[11px] text-amber-500 font-semibold block mt-1">
                Actively working
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          {/* OVERDUE (Soft Coral) */}
          <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Overdue
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block leading-tight">
                {overdueTasks}
              </span>
              <span className="text-[11px] text-rose-500 font-semibold block mt-1">
                {overdueTasks > 0 ? 'Needs attention' : 'All caught up'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-400 text-white flex items-center justify-center shrink-0 shadow-xs shadow-rose-200 dark:shadow-none">
              <span className="text-xl font-black">!</span>
            </div>
          </div>

        </div>

        {/* 3. ANALYTICS (Task Completion & Tasks by Priority) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Task Completion */}
          <div className="bg-white dark:bg-[#1e293b] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Task Completion
                </h3>
              </div>
              
              {/* Cute Dropdown */}
              <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-1 cursor-pointer">
                <span>This Week</span>
                <ChevronRight className="w-3 h-3 rotate-90 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
              {/* Weekly Bar Chart in Blue / Cyan */}
              <div className="sm:col-span-8 flex flex-col justify-between">
                {/* Y-axis and bars */}
                <div className="flex items-end h-36 gap-2">
                  <div className="flex flex-col justify-between h-28 text-[10px] text-slate-400 font-semibold pb-1 pr-1">
                    <span>6</span>
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                  </div>

                  {/* Bars for Mon, Tue, Wed, Thu, Fri, Sat, Sun */}
                  <div className="flex-1 flex items-end justify-between gap-1.5 h-28 border-b border-slate-100 dark:border-slate-800 pb-1">
                    {[
                      { day: 'Mon', count: 2, height: '35%' },
                      { day: 'Tue', count: 3, height: '50%' },
                      { day: 'Wed', count: 5, height: '85%' },
                      { day: 'Thu', count: 3, height: '50%' },
                      { day: 'Fri', count: 1.5, height: '25%' },
                      { day: 'Sat', count: 2, height: '35%' },
                      { day: 'Sun', count: 4, height: '65%' }
                    ].map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <div
                          className="w-full max-w-[20px] bg-sky-400 rounded-t-lg transition-all group-hover:bg-sky-500"
                          style={{ height: item.height }}
                          title={`${item.day}: ${item.count} tasks completed`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day labels */}
                <div className="flex justify-between pl-5 pt-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-4 pt-3 text-[11px] font-medium text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Completed</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span>Remaining</span>
                  </span>
                </div>
              </div>

              {/* Circular Progress Gauge */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-400"
                      strokeDasharray={`${completionPercent}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 block leading-none">
                      {completionPercent}%
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 block mt-0.5">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tasks by Priority */}
          <div className="bg-white dark:bg-[#1e293b] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tasks by Priority
                </h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-3">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                  {/* Background Track */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="5"
                    className="dark:stroke-slate-800"
                  />
                  {/* High (Coral) - 2 of 7 (~28.5%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#fb7185"
                    strokeWidth="5"
                    strokeDasharray="28.5 71.5"
                    strokeDashoffset="0"
                  />
                  {/* Medium (Orange) - 3 of 7 (~42.8%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#fb923c"
                    strokeWidth="5"
                    strokeDasharray="42.8 57.2"
                    strokeDashoffset="-28.5"
                  />
                  {/* Low (Blue) - 1 of 7 (~14.3%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="5"
                    strokeDasharray="14.3 85.7"
                    strokeDashoffset="-71.3"
                  />
                  {/* No Priority (Gray) - 1 of 7 (~14.4%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#cbd5e1"
                    strokeWidth="5"
                    strokeDasharray="14.4 85.6"
                    strokeDashoffset="-85.6"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100 block leading-none">
                    7
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    Tasks
                  </span>
                </div>
              </div>

              {/* Priority Legend */}
              <div className="space-y-2.5 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:space-x-8 text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="text-slate-600 dark:text-slate-300">High</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{highPriority || 2}</span>
                </div>

                <div className="flex items-center justify-between sm:space-x-8 text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-slate-600 dark:text-slate-300">Medium</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{mediumPriority || 3}</span>
                </div>

                <div className="flex items-center justify-between sm:space-x-8 text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="text-slate-600 dark:text-slate-300">Low</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{lowPriority || 1}</span>
                </div>

                <div className="flex items-center justify-between sm:space-x-8 text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="text-slate-600 dark:text-slate-300">No Priority</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{noPriority || 1}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4. RECENT TASKS CARD */}
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden p-5 sm:p-6 space-y-4">
          
          {/* Header with Title & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="text-sky-500">
                <ListTodo className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Tasks
              </h3>
            </div>

            <button
              onClick={onNavigateToTasks}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center space-x-1 cursor-pointer"
            >
              <span>View all</span>
              <span>→</span>
            </button>
          </div>

          {/* Filter Tabs: All, Active, Completed, Overdue */}
          <div className="flex items-center space-x-2">
            {(['ALL', 'ACTIVE', 'COMPLETED', 'OVERDUE'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTaskFilterTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  taskFilterTab === tab
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Task Rows List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No tasks found in this category.
              </div>
            ) : (
              filteredTasks.slice(0, 5).map((task) => {
                const isCompleted = task.status === 'COMPLETED';
                const project = getProjectById(task.projectId);
                const isOverdue = !isCompleted && task.dueDate && task.dueDate < todayStr;
                const isMenuOpen = activeTaskMenu === task.id;
                const dotColor = getTaskDotColor(task.priority, !!isOverdue);

                return (
                  <div
                    key={task.id}
                    className={`py-3 flex items-center justify-between gap-3 group transition-colors ${
                      isCompleted ? 'opacity-50' : ''
                    }`}
                  >
                    {/* Left: Dot, Checkbox, Task Title */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Priority Dot */}
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />

                      {/* Checkbox */}
                      <button
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-400 border-emerald-400 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
                        }`}
                      >
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      {/* Title */}
                      <button
                        onClick={() => onOpenTaskDetail(task)}
                        className={`text-xs font-semibold text-left truncate cursor-pointer ${
                          isCompleted
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 dark:text-slate-200 hover:text-sky-600'
                        }`}
                      >
                        {task.title}
                      </button>
                    </div>

                    {/* Middle: Project & Category Pills */}
                    <div className="hidden md:flex items-center space-x-2 shrink-0">
                      {project && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                          {project.name}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {task.category.toLowerCase()}
                      </span>
                    </div>

                    {/* Right: Due Date, Priority Pill, Menu */}
                    <div className="flex items-center space-x-3 shrink-0">
                      {/* Due date text */}
                      {task.dueDate && (
                        <span
                          className={`text-xs font-semibold ${
                            formatDeadlineDate(task.dueDate) === 'Today' || isOverdue
                              ? 'text-rose-500'
                              : formatDeadlineDate(task.dueDate) === 'Tomorrow'
                              ? 'text-amber-500'
                              : 'text-slate-500'
                          }`}
                        >
                          {formatDeadlineDate(task.dueDate)}
                        </span>
                      )}

                      {/* Priority pill */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'HIGH'
                            ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/50'
                            : task.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/50'
                            : 'bg-sky-50 text-sky-500 dark:bg-sky-950/50'
                        }`}
                      >
                        {task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}
                      </span>

                      {/* Action Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveTaskMenu(isMenuOpen ? null : task.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-20">
                            <button
                              onClick={() => {
                                setActiveTaskMenu(null);
                                onOpenTaskDetail(task);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setActiveTaskMenu(null);
                                onOpenEditModal(task);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                            >
                              Edit Task
                            </button>
                            <button
                              onClick={() => {
                                setActiveTaskMenu(null);
                                onDeleteTask(task.id);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RIGHT-SIDE COLUMN (4 cols on XL screens)
          1. CALENDAR (September 2026)
          2. UPCOMING DEADLINES
          3. QUICK ACTIONS
          4. CUTE ILLUSTRATION CARD (Good things take time + cat)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="xl:col-span-4 space-y-6 min-w-0">
        
        {/* 1. CALENDAR CARD */}
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          
          {/* Header with Title & Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {currentMonthInfo.name}
            </h3>
            
            {/* Controls: < Previous, > Next, Today */}
            <div className="flex items-center space-x-1.5 text-slate-500">
              <button
                onClick={() => {
                  if (calendarMonth === 'OCT') setCalendarMonth('SEP');
                  else if (calendarMonth === 'SEP') setCalendarMonth('AUG');
                }}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (calendarMonth === 'AUG') setCalendarMonth('SEP');
                  else if (calendarMonth === 'SEP') setCalendarMonth('OCT');
                }}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCalendarMonth('SEP');
                  setSelectedDay(5);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-sky-600 bg-sky-50 dark:bg-sky-950/60 rounded-xl hover:bg-sky-100 transition-colors cursor-pointer"
              >
                Today
              </button>
            </div>
          </div>

          {/* Days of week header: Mon Tue Wed Thu Fri Sat Sun */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
            {/* Previous month trailing day: Aug 31 */}
            {calendarMonth === 'SEP' && (
              <div className="h-8 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                <span>31</span>
              </div>
            )}

            {/* Days in Month */}
            {Array.from({ length: currentMonthInfo.days }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = calendarMonth === 'SEP' && dayNum === 5; // Sept 5, 2026 is Today!
              const isSelected = selectedDay === dayNum;
              const dotClass = referenceCalendarDots[dayNum];

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(selectedDay === dayNum ? null : dayNum)}
                  className={`h-8 rounded-full flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                    isToday
                      ? 'bg-sky-500 text-white font-black shadow-xs shadow-sky-200'
                      : isSelected
                      ? 'bg-sky-50 text-sky-700 font-bold border border-sky-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-xs leading-none">{dayNum}</span>
                  
                  {/* Tiny colored dot indicator */}
                  {dotClass && !isToday && (
                    <span
                      className={`w-1 h-1 rounded-full absolute bottom-1 ${dotClass}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Date Task Preview when date is selected */}
          {selectedDay && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Sept {selectedDay} Schedule:
                </span>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {tasksByDay[selectedDay] && tasksByDay[selectedDay].length > 0 ? (
                <div className="space-y-1.5">
                  {tasksByDay[selectedDay].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onOpenTaskDetail(t)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 transition-colors cursor-pointer"
                    >
                      <span className="truncate font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                        {t.title}
                      </span>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 py-1">
                  No deadlines scheduled for this day.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 2. UPCOMING DEADLINES CARD */}
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs">
                ⤓
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Upcoming Deadlines
              </h3>
            </div>
            <button
              onClick={onNavigateToTasks}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View all</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 1,
                title: 'Submit DSA Assignment',
                project: 'DSA Practice',
                due: 'Today',
                isRed: true,
                priority: 'High',
                dotColor: 'bg-rose-400',
                priorityClass: 'bg-rose-50 text-rose-500'
              },
              {
                id: 2,
                title: 'Design Project UI',
                project: 'Web Dev',
                due: 'Tomorrow',
                isOrange: true,
                priority: 'Medium',
                dotColor: 'bg-amber-400',
                priorityClass: 'bg-amber-50 text-amber-500'
              },
              {
                id: 3,
                title: 'Prepare Presentation',
                project: 'College',
                due: '8 Sep',
                priority: 'Medium',
                dotColor: 'bg-amber-400',
                priorityClass: 'bg-amber-50 text-amber-500'
              },
              {
                id: 4,
                title: 'Read Research Paper',
                project: 'ML Project',
                due: '10 Sep',
                priority: 'Low',
                dotColor: 'bg-sky-400',
                priorityClass: 'bg-sky-50 text-sky-500'
              }
            ].map((item) => {
              const matchedTask = tasks.find((t) => t.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (matchedTask) onOpenTaskDetail(matchedTask);
                  }}
                  className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${item.dotColor}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-500">{item.project}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-xs font-semibold ${
                        item.isRed ? 'text-rose-500' : item.isOrange ? 'text-amber-500' : 'text-slate-500'
                      }`}
                    >
                      {item.due}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.priorityClass}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. QUICK ACTIONS (4 pastel square buttons in a row!) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2.5">
            
            {/* Action 1: New Task (Soft Baby Blue) */}
            <button
              onClick={() => onOpenNewTaskModal()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50/80 hover:bg-sky-100 text-sky-600 transition-all text-center border border-sky-100/60 cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 whitespace-nowrap">
                New Task
              </span>
            </button>

            {/* Action 2: New Project (Soft Mint) */}
            <button
              onClick={onOpenNewProjectModal}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 text-emerald-600 transition-all text-center border border-emerald-100/60 cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <FolderPlus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 whitespace-nowrap">
                New Project
              </span>
            </button>

            {/* Action 3: Add Member (Soft Warm Peach) */}
            <button
              onClick={onAddMember}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100 text-amber-600 transition-all text-center border border-amber-100/60 cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 whitespace-nowrap">
                Add Member
              </span>
            </button>

            {/* Action 4: Generate Report (Soft Coral / Rose) */}
            <button
              onClick={onGenerateReport}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50/80 hover:bg-rose-100 text-rose-500 transition-all text-center border border-rose-100/60 cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 whitespace-nowrap">
                Generate Report
              </span>
            </button>

          </div>
        </div>

        {/* 4. CUTE ILLUSTRATION CARD (Good things take time + Sleeping Cat) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e0f7fa] via-[#e8f5e9] to-[#fff3e0] dark:from-[#11232e] dark:via-[#132c25] dark:to-[#2e2617] border border-emerald-100/60 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1 z-10 max-w-[170px]">
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
              Good things take time. <span className="text-rose-400 font-normal">♡</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Rest and celebrate small wins.
            </p>
          </div>

          {/* Adorable Sleeping Peach Tabby Cat + Potted Plant SVG Illustration */}
          <div className="w-32 h-20 relative shrink-0">
            <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Cute Potted Plant */}
              <path d="M120 48L122 70H132L134 48H120Z" fill="#E29578" />
              <ellipse cx="127" cy="48" rx="7" ry="2" fill="#D37E60" />
              {/* Plant leaves */}
              <path d="M127 48C127 35 120 28 116 28C116 35 122 44 127 48Z" fill="#52B788" />
              <path d="M127 48C127 30 134 22 138 24C138 32 132 42 127 48Z" fill="#74C69D" />
              <path d="M127 45C124 38 126 32 130 30C132 35 130 42 127 45Z" fill="#95D5B2" />

              {/* Sleeping Cat Body (Curled up peach/orange tabby) */}
              {/* Tail */}
              <path
                d="M38 64C28 64 20 58 20 48C20 42 26 40 30 44C30 50 34 56 42 56C48 56 50 58 48 62C46 64 42 64 38 64Z"
                fill="#FDBA74"
              />
              <path d="M22 46C24 45 28 47 27 50C26 53 23 51 22 46Z" fill="#FB923C" />

              {/* Main Body */}
              <ellipse cx="64" cy="54" rx="26" ry="18" fill="#FED7AA" />
              <ellipse cx="64" cy="52" rx="24" ry="16" fill="#FDBA74" />
              
              {/* Tabby Stripes on Back */}
              <path d="M58 38C60 42 60 46 58 48" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M66 38C68 42 68 46 66 48" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M74 40C76 43 76 46 74 49" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />

              {/* Cat Head */}
              <circle cx="90" cy="52" r="14" fill="#FED7AA" />
              <circle cx="89" cy="51" r="13" fill="#FDBA74" />

              {/* Cat Ears */}
              <path d="M82 40L86 30L92 38Z" fill="#FDBA74" />
              <path d="M84 38L86 33L89 37Z" fill="#FCA5A5" />
              <path d="M94 38L100 32L102 42Z" fill="#FDBA74" />
              <path d="M96 38L99 34L100 40Z" fill="#FCA5A5" />

              {/* Sleeping Eyes (Curved Lines) */}
              <path d="M85 53C87 55 89 55 91 53" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M94 53C96 55 98 55 100 53" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" fill="none" />

              {/* Pink Nose & Cheeks */}
              <ellipse cx="83" cy="56" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.7" />
              <ellipse cx="102" cy="56" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.7" />
              <path d="M92 56L93.5 58H90.5Z" fill="#F43F5E" />

              {/* Sleeping z z */}
              <text x="104" y="32" fill="#64748B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">z</text>
              <text x="110" y="24" fill="#94A3B8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">z</text>
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
};
