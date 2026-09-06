import React, { useState } from 'react';
import {
  X,
  Users,
  CheckSquare,
  Plus,
  UserPlus,
  Trash2,
  Trello
} from 'lucide-react';
import { Project, Task, User } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  users: User[];
  currentUser: User;
  onAddMember: (projectId: number, userId: number) => void;
  onRemoveMember: (projectId: number, userId: number) => void;
  onOpenNewTaskModal: (projectId: number) => void;
  onOpenTaskDetail: (task: Task) => void;
  onToggleTaskStatus: (taskId: number) => void;
  onNavigateToKanban: (projectId: number) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  tasks,
  users,
  currentUser,
  onAddMember,
  onRemoveMember,
  onOpenNewTaskModal,
  onOpenTaskDetail,
  onToggleTaskStatus,
  onNavigateToKanban
}) => {
  const [selectedUserIdToAdd, setSelectedUserIdToAdd] = useState<number | ''>('');

  if (!isOpen || !project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'COMPLETED').length;
  const getUserById = (id: number) => users.find((u) => u.id === id);
  const owner = getUserById(project.ownerId);

  // Users who are not members yet and not the owner
  const currentMemberIds = new Set([project.ownerId, ...project.members.map((m) => m.userId)]);
  const availableUsersToAdd = users.filter((u) => !currentMemberIds.has(u.id));

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserIdToAdd) return;
    onAddMember(project.id, Number(selectedUserIdToAdd));
    setSelectedUserIdToAdd('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{project.name}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToKanban(project.id);
              }}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 rounded-xl transition-colors"
            >
              <Trello className="w-3.5 h-3.5 mr-1 text-sky-600 dark:text-sky-400" />
              Kanban View
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Description */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">
                Tasks
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {completedTasks}/{projectTasks.length}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">
                Collaborators
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {project.members.length + 1}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">
                Project Lead
              </span>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 truncate block mt-1">
                {owner ? owner.fullName : 'Admin'}
              </span>
            </div>
          </div>

          {/* Two Columns: Project Tasks & Members List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Project Deliverables ({projectTasks.length})</span>
                </div>
                <button
                  onClick={() => onOpenNewTaskModal(project.id)}
                  className="p-1 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg"
                  title="Add Task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {projectTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    No tasks in this project yet.
                  </div>
                ) : (
                  projectTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 transition-colors flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <button
                          onClick={() => onToggleTaskStatus(task.id)}
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {task.status === 'COMPLETED' && <span className="text-[10px]">✓</span>}
                        </button>
                        <button
                          onClick={() => onOpenTaskDetail(task)}
                          className={`truncate text-left font-medium hover:text-sky-600 dark:hover:text-sky-400 ${
                            task.status === 'COMPLETED'
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {task.title}
                        </button>
                      </div>

                      <span
                        className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase shrink-0 ${
                          task.priority === 'HIGH'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Team Members ({project.members.length + 1})</span>
                </div>
              </div>

              {/* Add Member Form */}
              {availableUsersToAdd.length > 0 && (
                <form onSubmit={handleAddMember} className="flex items-center space-x-2">
                  <select
                    value={selectedUserIdToAdd}
                    onChange={(e) => setSelectedUserIdToAdd(e.target.value ? Number(e.target.value) : '')}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="">Select collaborator to add...</option>
                    {availableUsersToAdd.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} (@{u.username})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!selectedUserIdToAdd}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center"
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </button>
                </form>
              )}

              {/* Members List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {/* Lead */}
                {owner && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: owner.avatarColor }}
                      >
                        {owner.initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{owner.fullName}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{owner.email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 rounded">
                      LEAD
                    </span>
                  </div>
                )}

                {/* Other Members */}
                {project.members.map((m) => {
                  const u = getUserById(m.userId);
                  if (!u) return null;

                  return (
                    <div
                      key={u.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: u.avatarColor }}
                        >
                          {u.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">{u.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                          MEMBER
                        </span>
                        <button
                          onClick={() => onRemoveMember(project.id, u.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove collaborator"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
