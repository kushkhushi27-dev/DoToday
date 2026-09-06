import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Calendar,
  AlertCircle,
  Edit3,
  Trash2,
  RotateCcw,
  Check,
  CheckSquare
} from 'lucide-react';
import { Task, Project, User, FilterState } from '../types';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  currentUser: User;
  onOpenTaskDetail: (task: Task) => void;
  onOpenEditModal: (task: Task) => void;
  onOpenNewTaskModal: () => void;
  onToggleTaskStatus: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projects,
  users,
  currentUser,
  onOpenTaskDetail,
  onOpenEditModal,
  onOpenNewTaskModal,
  onToggleTaskStatus,
  onDeleteTask
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    priority: '',
    category: '',
    projectId: '',
    assignedToMeOnly: false,
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  const todayStr = '2026-09-05';

  const getUserById = (id: number | null) => users.find((u) => u.id === id);
  const getProjectById = (id: number | null) => projects.find((p) => p.id === id);

  // Filter & Sort Logic
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDesc = t.description.toLowerCase().includes(q);
          const matchCategory = t.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory) return false;
        }

        if (filters.status && t.status !== filters.status) return false;
        if (filters.priority && t.priority !== filters.priority) return false;
        if (filters.projectId && t.projectId !== Number(filters.projectId)) return false;
        if (filters.assignedToMeOnly && t.assigneeId !== currentUser.id) return false;

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          comparison = a.dueDate.localeCompare(b.dueDate);
        } else if (filters.sortBy === 'priority') {
          const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          comparison = weight[b.priority] - weight[a.priority];
        } else if (filters.sortBy === 'createdAt') {
          comparison = a.createdAt.localeCompare(b.createdAt);
        } else if (filters.sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [tasks, filters, currentUser.id]);

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
      projectId: '',
      assignedToMeOnly: false,
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            My Tasks & Deliverables
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Search, filter, categorize, and prioritize work items across all workspaces.
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-sky-200 dark:shadow-none transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
          Create Task
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
        
        {/* Row 1: Search + Status + Priority + Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search tasks, descriptions, tags..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            value={filters.projectId}
            onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

        </div>

        {/* Row 2: Assigned to me + Sorting + Reset */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filters.assignedToMeOnly}
                onChange={(e) => setFilters({ ...filters, assignedToMeOnly: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500"
              />
              <span>Assigned to me only</span>
            </label>

            {(filters.search || filters.status || filters.priority || filters.projectId || filters.assignedToMeOnly) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="py-1 px-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Creation Date</option>
              <option value="title">Title</option>
            </select>

            <button
              onClick={() =>
                setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
              }
              className="p-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              title={`Sorting: ${filters.sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Task List Items */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">
            <Filter className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            No tasks found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredAndSortedTasks.map((task) => {
              const assignee = getUserById(task.assigneeId);
              const project = getProjectById(task.projectId);
              const isOverdue =
                task.status !== 'COMPLETED' && task.dueDate && task.dueDate < todayStr;
              const isCompleted = task.status === 'COMPLETED';

              return (
                <div
                  key={task.id}
                  className={`p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4 ${
                    isCompleted ? 'bg-slate-50/40 dark:bg-slate-900/20 opacity-60' : ''
                  }`}
                >
                  {/* Left: Checkbox + Title + Metadata */}
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent hover:text-emerald-500'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => onOpenTaskDetail(task)}
                        className={`text-xs font-semibold text-left truncate block hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </button>

                      <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        {project && (
                          <span className="flex items-center space-x-1 font-medium text-slate-600 dark:text-slate-400">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <span>{project.name}</span>
                          </span>
                        )}

                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {task.category}
                        </span>

                        {task.dueDate && (
                          <span
                            className={`flex items-center ${
                              isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
                            }`}
                          >
                            {isOverdue && <AlertCircle className="w-3 h-3 mr-0.5" />}
                            <Calendar className="w-3 h-3 mr-1" />
                            {task.dueDate} {isOverdue && '(Overdue)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge, Priority badge, Assignee, Actions */}
                  <div className="flex items-center space-x-3 shrink-0">
                    
                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/50'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/50'
                          : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200/60 dark:border-sky-900/50'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Assignee Avatar */}
                    {assignee ? (
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-2xs"
                        style={{ backgroundColor: assignee.avatarColor }}
                        title={`Assigned to: ${assignee.fullName}`}
                      >
                        {assignee.initials}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">Unassigned</span>
                    )}

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center space-x-1 pl-2 border-l border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onOpenEditModal(task)}
                        className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this task?')) {
                            onDeleteTask(task.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
