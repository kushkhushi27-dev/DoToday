import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  MessageSquare,
  PlusCircle,
  FolderPlus,
  Filter
} from 'lucide-react';
import { ActivityLog, User } from '../types';

interface ActivityViewProps {
  activities: ActivityLog[];
  users: User[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  activities,
  users
}) => {
  const getUserById = (id: number) => users.find((u) => u.id === id);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TASK_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'STATUS_CHANGED':
        return <Clock className="w-4 h-4 text-sky-500" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'PROJECT_CREATED':
        return <FolderPlus className="w-4 h-4 text-emerald-500" />;
      default:
        return <PlusCircle className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Activity & Audit Stream
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Complete historical trail of updates, status changes, assignments, and discussions.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {activities.length} Events Logged
        </span>
      </div>

      {/* Activity Timeline Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
          {activities.map((act) => {
            const user = getUserById(act.userId);

            return (
              <div key={act.id} className="relative flex items-start space-x-4">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                  {getActionIcon(act.action)}
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100/80 dark:border-slate-700/50">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center space-x-2">
                      {user && (
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: user.avatarColor }}
                        >
                          {user.initials}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {user ? user.fullName : 'Team Member'}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(act.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
