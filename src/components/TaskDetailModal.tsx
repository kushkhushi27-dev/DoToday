import React, { useState } from 'react';
import {
  X,
  Calendar,
  AlertCircle,
  MessageSquare,
  Send,
  Edit3,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Task, Project, User, TaskComment, TaskStatus } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  users: User[];
  comments: TaskComment[];
  currentUser: User;
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => void;
  onAddComment: (taskId: number, content: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  projects,
  users,
  comments,
  currentUser,
  onUpdateStatus,
  onAddComment,
  onEditTask,
  onDeleteTask
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !task) return null;

  const todayStr = '2026-09-05';
  const isOverdue = task.status !== 'COMPLETED' && task.dueDate && task.dueDate < todayStr;

  const getUserById = (id: number | null) => users.find((u) => u.id === id);
  const getProjectById = (id: number | null) => projects.find((p) => p.id === id);

  const assignee = getUserById(task.assigneeId);
  const creator = getUserById(task.creatorId);
  const project = getProjectById(task.projectId);
  const taskComments = comments.filter((c) => c.taskId === task.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                task.priority === 'HIGH'
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                  : task.priority === 'MEDIUM'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                  : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900'
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                onClose();
                onEditTask(task);
              }}
              className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this task?')) {
                  onDeleteTask(task.id);
                  onClose();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Title & Project & Category */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
              {project && (
                <span className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {task.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Description
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {task.description || (
                <span className="text-slate-400 italic">No description provided for this task.</span>
              )}
            </div>
          </div>

          {/* Workflow Transition Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Status Transition:
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateStatus(task.id, 'TODO')}
                disabled={task.status === 'TODO'}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  task.status === 'TODO'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                disabled={task.status === 'IN_PROGRESS'}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  task.status === 'IN_PROGRESS'
                    ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                disabled={task.status === 'COMPLETED'}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Complete
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[11px]">Due Date</span>
              {task.dueDate ? (
                <div
                  className={`font-semibold flex items-center ${
                    isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {task.dueDate} {isOverdue && '(Overdue)'}
                </div>
              ) : (
                <span className="text-slate-400 italic">No deadline</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[11px]">Assignee</span>
              {assignee ? (
                <div className="flex items-center space-x-1.5">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ backgroundColor: assignee.avatarColor }}
                  >
                    {assignee.initials}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {assignee.fullName}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">Unassigned</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[11px]">Creator</span>
              {creator ? (
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold bg-slate-500">
                    {creator.initials}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {creator.fullName}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">System</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[11px]">Created At</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Team Discussion ({taskComments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Leave a comment as ${currentUser.fullName}...`}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {taskComments.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                  No comments on this task yet.
                </div>
              ) : (
                taskComments.map((c) => {
                  const author = getUserById(c.authorId);
                  return (
                    <div key={c.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                            style={{ backgroundColor: author ? author.avatarColor : '#64748B' }}
                          >
                            {author ? author.initials : 'TF'}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {author ? author.fullName : 'Collaborator'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 pl-7 leading-relaxed whitespace-pre-line">
                        {c.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
