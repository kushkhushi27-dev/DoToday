import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderPlus,
  UserPlus,
  FileText,
  Clock,
  Sparkles,
  Leaf
} from 'lucide-react';
import { Task, Project, User } from '../types';

interface RightPanelProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onOpenTaskDetail: (task: Task) => void;
  onGenerateReport: () => void;
  onQuickAddMember: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  tasks,
  projects,
  users,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenTaskDetail,
  onGenerateReport,
  onQuickAddMember
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(5); // Default to Sept 5, 2026

  const todayStr = '2026-09-05';
  const getProjectById = (id: number | null) => projects.find((p) => p.id === id);

  // Upcoming deadlines (tasks not completed, sorted by due date)
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'COMPLETED' && t.dueDate)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 4);

  // Calendar logic for September 2026
  // September 1, 2026 is a Tuesday (index 1 if Mon=0)
  // 30 days in September 2026
  const daysInMonth = 30;
  const startDayOffset = 1; // Tuesday

  // Map tasks to days in September 2026
  const tasksByDay: { [day: number]: Task[] } = {};
  tasks.forEach((t) => {
    if (t.dueDate && t.dueDate.startsWith('2026-09-')) {
      const dayNum = parseInt(t.dueDate.split('-')[2], 10);
      if (!tasksByDay[dayNum]) tasksByDay[dayNum] = [];
      tasksByDay[dayNum].push(t);
    }
  });

  return (
    <aside className="w-full lg:w-80 space-y-5 shrink-0">
      
      {/* 1. Quick Actions Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* Action 1: New Task */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                New Task
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                Add to queue
              </span>
            </div>
          </button>

          {/* Action 2: New Project */}
          <button
            onClick={onOpenNewProjectModal}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                New Project
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                Create space
              </span>
            </div>
          </button>

          {/* Action 3: Add Member */}
          <button
            onClick={onQuickAddMember}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                Add Member
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                Invite team
              </span>
            </div>
          </button>

          {/* Action 4: Generate Report */}
          <button
            onClick={onGenerateReport}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                Report
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                Summary PDF
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* 2. Compact Monthly Calendar */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-1.5">
            <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              September 2026
            </h3>
          </div>
          <div className="flex items-center space-x-0.5 text-slate-400 dark:text-slate-500">
            <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Empty offset days */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="h-7" />
          ))}

          {/* Days 1 to 30 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === 5; // Sept 5, 2026
            const isSelected = selectedDay === dayNum;
            const dayTasks = tasksByDay[dayNum] || [];
            const hasTasks = dayTasks.length > 0;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-7 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                  isToday
                    ? 'bg-sky-600 text-white font-bold shadow-xs shadow-sky-200 dark:shadow-none'
                    : isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium'
                }`}
              >
                <span className="text-[11px] leading-none">{dayNum}</span>
                {/* Tiny task indicator dot */}
                {hasTasks && !isToday && (
                  <span
                    className={`w-1 h-1 rounded-full absolute bottom-1 ${
                      dayTasks.some((t) => t.priority === 'HIGH')
                        ? 'bg-rose-500'
                        : dayTasks.some((t) => t.priority === 'MEDIUM')
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected date preview if tasks exist */}
        {selectedDay && tasksByDay[selectedDay] && tasksByDay[selectedDay].length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-1">
              Sept {selectedDay}, 2026 Tasks:
            </span>
            <div className="space-y-1">
              {tasksByDay[selectedDay].map((t) => (
                <div
                  key={t.id}
                  onClick={() => onOpenTaskDetail(t)}
                  className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer truncate"
                >
                  <span className="truncate">{t.title}</span>
                  <span
                    className={`text-[9px] font-bold px-1 rounded ${
                      t.priority === 'HIGH'
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                        : 'text-sky-600 bg-sky-50 dark:bg-sky-950/50'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Upcoming Deadlines Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Upcoming Deadlines
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
            {upcomingTasks.length} queued
          </span>
        </div>

        <div className="space-y-2.5">
          {upcomingTasks.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No upcoming deadlines.</p>
          ) : (
            upcomingTasks.map((t) => {
              const project = getProjectById(t.projectId);
              const isOverdue = t.dueDate && t.dueDate < todayStr;
              const isDueToday = t.dueDate === todayStr;

              // Colored dot based on urgency
              const dotColor = isOverdue
                ? 'bg-rose-500'
                : isDueToday
                ? 'bg-amber-500'
                : t.priority === 'HIGH'
                ? 'bg-rose-500'
                : t.priority === 'MEDIUM'
                ? 'bg-amber-500'
                : 'bg-sky-500';

              return (
                <div
                  key={t.id}
                  onClick={() => onOpenTaskDetail(t)}
                  className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-100/80 dark:border-slate-700/50 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {t.title}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        t.priority === 'HIGH'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
                          : t.priority === 'MEDIUM'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60'
                          : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pl-4">
                    <span className="truncate">{project ? project.name : t.category}</span>
                    <span
                      className={`font-medium ${
                        isOverdue
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : isDueToday
                          ? 'text-amber-600 dark:text-amber-400 font-bold'
                          : ''
                      }`}
                    >
                      {isOverdue ? 'Overdue • ' : isDueToday ? 'Today • ' : ''}
                      {t.dueDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Motivational Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/30 border border-sky-100/80 dark:border-slate-700/60 shadow-xs relative overflow-hidden">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-emerald-500 flex items-center justify-center shrink-0 shadow-2xs">
            <Leaf className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Consistency builds progress.
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              "Small steps every day add up to big results."
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
};
