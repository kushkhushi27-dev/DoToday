import React, { useState } from 'react';
import {
  FolderPlus,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { Project, Task, User } from '../types';

interface ProjectListProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
  currentUser?: User;
  onOpenProjectDetail: (project: Project) => void;
  onOpenNewProjectModal?: () => void;
  onNavigateToKanban: (projectId: number) => void;
  onCreateProject?: (projectData: { name: string; description: string; color: string }) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  tasks,
  users,
  currentUser,
  onOpenProjectDetail,
  onOpenNewProjectModal,
  onNavigateToKanban,
  onCreateProject
}) => {
  const [isLocalCreateOpen, setIsLocalCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0284C7');

  const getUserById = (id: number) => users.find((u) => u.id === id);

  const handleOpenCreate = () => {
    if (onOpenNewProjectModal) {
      onOpenNewProjectModal();
    } else {
      setIsLocalCreateOpen(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (onCreateProject) {
      onCreateProject({
        name: name.trim(),
        description: description.trim(),
        color
      });
    }
    setName('');
    setDescription('');
    setColor('#0284C7');
    setIsLocalCreateOpen(false);
  };

  const colorOptions = [
    '#0284C7', // Sky blue
    '#0EA5E9', // Light sky
    '#06B6D4', // Cyan
    '#10B981', // Mint / Emerald
    '#F59E0B', // Amber
    '#F97316', // Soft orange
    '#FB7185', // Coral / Rose
    '#64748B'  // Slate
  ];

  return (
    <div className="space-y-6 w-full min-w-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Workspace Projects
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Active strategic initiatives, team allocations, and milestone delivery.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-sky-200 dark:shadow-none transition-all self-start sm:self-auto cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
          New Project
        </button>
      </div>

      {/* Projects Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedTasks = projectTasks.filter((t) => t.status === 'COMPLETED').length;
          const totalTasks = projectTasks.length;
          const progressPercent =
            totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          const owner = getUserById(project.ownerId);

          return (
            <div
              key={project.id}
              className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 p-5 shadow-xs hover:shadow-md hover:border-sky-200 dark:hover:border-sky-800/60 transition-all flex flex-col justify-between space-y-4 group min-w-0"
            >
              {/* Top: Color Dot + Title + Open Details */}
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3
                      onClick={() => onOpenProjectDetail(project)}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors cursor-pointer truncate"
                      title={project.name}
                    >
                      {project.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onNavigateToKanban(project.id)}
                    className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Open in Kanban"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Middle: Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="text-slate-800 dark:text-slate-200">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: project.color || '#0284C7'
                    }}
                  />
                </div>
              </div>

              {/* Bottom: Members & Task Stats */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                
                {/* Team Avatars */}
                <div className="flex items-center -space-x-1.5">
                  {owner && (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e293b] flex items-center justify-center text-white text-[9px] font-bold shadow-2xs"
                      style={{ backgroundColor: owner.avatarColor }}
                      title={`Owner: ${owner.fullName}`}
                    >
                      {owner.initials}
                    </div>
                  )}
                  {project.members.map((m) => {
                    const memberUser = getUserById(m.userId);
                    if (!memberUser) return null;
                    return (
                      <div
                        key={m.userId}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e293b] flex items-center justify-center text-white text-[9px] font-bold shadow-2xs"
                        style={{ backgroundColor: memberUser.avatarColor }}
                        title={memberUser.fullName}
                      >
                        {memberUser.initials}
                      </div>
                    );
                  })}
                </div>

                {/* Task counts */}
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                    {completedTasks}/{totalTasks}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for creating a new project */}
      {isLocalCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Create New Project
                </h3>
              </div>
              <button
                onClick={() => setIsLocalCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cloud Architecture Migration"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the goals and key deliverables of this project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Theme Accent Color
                </label>
                <div className="flex items-center space-x-2 pt-1">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-sky-500' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLocalCreateOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-xs shadow-sky-200 dark:shadow-none transition-all cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
