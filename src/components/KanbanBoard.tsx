import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  CheckSquare
} from 'lucide-react';
import { Task, Project, User, TaskStatus } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
  onOpenTaskDetail: (task: Task) => void;
  onOpenNewTaskModal: (status?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects,
  users,
  onUpdateTaskStatus,
  onOpenTaskDetail,
  onOpenNewTaskModal
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  const todayStr = '2026-09-05';

  const getUserById = (id: number | null) => users.find((u) => u.id === id);
  const getProjectById = (id: number | null) => projects.find((p) => p.id === id);

  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'ALL' && t.projectId !== Number(selectedProjectId)) {
      return false;
    }
    return true;
  });

  const columns: { id: TaskStatus; title: string; countColor: string; bgBadge: string; icon: React.ReactNode }[] = [
    {
      id: 'TODO',
      title: 'To Do',
      countColor: 'text-slate-600 dark:text-slate-400',
      bgBadge: 'bg-slate-100 dark:bg-slate-800',
      icon: <CheckSquare className="w-4 h-4 text-slate-500" />
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      countColor: 'text-sky-700 dark:text-sky-300',
      bgBadge: 'bg-sky-100 dark:bg-sky-950/60',
      icon: <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      countColor: 'text-emerald-700 dark:text-emerald-300',
      bgBadge: 'bg-emerald-100 dark:bg-emerald-950/60',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
    }
  ];

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    const taskId = Number(taskIdStr);
    if (taskId) {
      onUpdateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'TODO') return 'IN_PROGRESS';
    if (current === 'IN_PROGRESS') return 'COMPLETED';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'COMPLETED') return 'IN_PROGRESS';
    if (current === 'IN_PROGRESS') return 'TODO';
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Project Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Kanban Board
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Interactive drag & drop board with instantaneous status updates.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
          >
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onOpenNewTaskModal()}
            className="inline-flex items-center px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-sky-200 dark:shadow-none transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800/60 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 py-1.5 mb-3">
                <div className="flex items-center space-x-2">
                  {col.icon}
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {col.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.bgBadge} ${col.countColor}`}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onOpenNewTaskModal(col.id)}
                  className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                    Drop tasks here
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = getUserById(task.assigneeId);
                    const project = getProjectById(task.projectId);
                    const isOverdue =
                      task.status !== 'COMPLETED' && task.dueDate && task.dueDate < todayStr;
                    const prevStatus = getPrevStatus(task.status);
                    const nextStatus = getNextStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`bg-white dark:bg-[#1e293b] p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/90 shadow-2xs hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-900 transition-all cursor-grab active:cursor-grabbing group space-y-2.5 ${
                          draggedTaskId === task.id ? 'opacity-40 border-dashed border-sky-400' : ''
                        }`}
                      >
                        {/* Top: Project pill & Priority */}
                        <div className="flex items-center justify-between gap-1">
                          {project ? (
                            <span className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: project.color }}
                              />
                              <span className="truncate">{project.name}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Personal</span>
                          )}

                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                              task.priority === 'HIGH'
                                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50'
                                : task.priority === 'MEDIUM'
                                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50'
                                : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-900/50'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div
                          onClick={() => onOpenTaskDetail(task)}
                          className="cursor-pointer"
                        >
                          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Bottom: Due date, Assignee, Status quick shift */}
                        <div className="pt-2 border-t border-slate-100/80 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                          {/* Due date */}
                          <div className="flex items-center text-slate-400 dark:text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>
                              {task.dueDate || 'No date'}
                            </span>
                          </div>

                          {/* Right: Quick shift + Assignee */}
                          <div className="flex items-center space-x-1.5">
                            {/* Shift Left */}
                            {prevStatus && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, prevStatus)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Move left"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}

                            {/* Shift Right */}
                            {nextStatus && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Move right"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}

                            {/* Assignee Avatar */}
                            {assignee && (
                              <div
                                className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                                style={{ backgroundColor: assignee.avatarColor }}
                                title={assignee.fullName}
                              >
                                {assignee.initials}
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
          );
        })}
      </div>

    </div>
  );
};
