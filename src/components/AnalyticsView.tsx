import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { Task, Project, User } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  projects,
  users
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriority = tasks.filter((t) => t.priority === 'HIGH').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'MEDIUM').length;
  const lowPriority = tasks.filter((t) => t.priority === 'LOW').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Productivity & Sprint Analytics
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Real-time velocity, distribution, and completion trends.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100/60 dark:border-emerald-800/60">
          <Zap className="w-3.5 h-3.5" />
          <span>Sprint Pace: +18% vs Last Week</span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Completion Rate
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {completionRate}%
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              ↑ 6%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Active Sprint Work
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
              {inProgressTasks}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">In Progress</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Backlog Tasks
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {todoTasks}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Queued</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Strategic Projects
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {projects.length}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Workspaces</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project Delivery Performance */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Project Delivery Breakdown
          </h3>
          <div className="space-y-4">
            {projects.map((p) => {
              const pTasks = tasks.filter((t) => t.projectId === p.id);
              const pDone = pTasks.filter((t) => t.status === 'COMPLETED').length;
              const pPercent = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-400">
                      {pDone}/{pTasks.length} ({pPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pPercent}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Workload & Allocation */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Team Workload & Distribution
          </h3>
          <div className="space-y-3">
            {users.map((u) => {
              const uTasks = tasks.filter((t) => t.assigneeId === u.id);
              const uDone = uTasks.filter((t) => t.status === 'COMPLETED').length;
              const uActive = uTasks.length - uDone;

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {u.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {u.fullName}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        @{u.username} • {u.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Member'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {uActive} active
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {uDone} completed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
