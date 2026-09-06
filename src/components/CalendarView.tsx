import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Task, Project, User } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onOpenTaskDetail: (task: Task) => void;
  onOpenNewTaskModal: (date?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  projects,
  users,
  onOpenTaskDetail,
  onOpenNewTaskModal
}) => {
  const [currentMonth] = useState('September 2026');
  const [selectedDay, setSelectedDay] = useState<number>(5);

  const daysInMonth = 30;
  const startDayOffset = 1; // Tuesday
  const todayNum = 5;

  const getProjectById = (id: number | string | null) => projects.find((p) => p.id === id);

  // Group tasks by day in September 2026
  const tasksByDay: { [day: number]: Task[] } = {};
  tasks.forEach((t) => {
    if (t.dueDate && t.dueDate.startsWith('2026-09-')) {
      const dayNum = parseInt(t.dueDate.split('-')[2], 10);
      if (!tasksByDay[dayNum]) tasksByDay[dayNum] = [];
      tasksByDay[dayNum].push(t);
    }
  });

  const selectedDateStr = `2026-09-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;
  const selectedDayTasks = tasksByDay[selectedDay] || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {currentMonth}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Interactive team schedule and sprint delivery milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button className="p-1.5 hover:text-slate-900 dark:hover:text-white text-slate-500 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-300">
              September 2026
            </span>
            <button className="p-1.5 hover:text-slate-900 dark:hover:text-white text-slate-500 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenNewTaskModal(selectedDateStr)}
            className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-sky-200 dark:shadow-none transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Schedule Task
          </button>
        </div>
      </div>

      {/* Calendar Grid & Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Month Grid (3 columns wide) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-4 sm:p-5">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-2 border-b border-slate-100 dark:border-slate-800">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for offset */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="min-h-[85px] bg-slate-50/40 dark:bg-slate-900/20 rounded-xl" />
            ))}

            {/* Days 1 to 30 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === todayNum;
              const isSelected = dayNum === selectedDay;
              const dayTasks = tasksByDay[dayNum] || [];

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/30 ring-1 ring-sky-500'
                      : isToday
                      ? 'border-sky-200 dark:border-sky-800/80 bg-sky-50/20 dark:bg-sky-950/10'
                      : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-sky-600 text-white shadow-2xs'
                          : isSelected
                          ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task pills inside cell */}
                  <div className="space-y-1 mt-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTaskDetail(task);
                        }}
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate border ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50'
                            : task.priority === 'HIGH'
                            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50'
                            : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-medium block pl-1">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (1 column wide) */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Selected Day
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                September {selectedDay}, 2026
              </h3>
            </div>

            <button
              onClick={() => onOpenNewTaskModal(selectedDateStr)}
              className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors"
              title="Add task on this date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {selectedDayTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                <Clock className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                No tasks scheduled for this day.
              </div>
            ) : (
              selectedDayTasks.map((t) => {
                const project = getProjectById(t.projectId);
                return (
                  <div
                    key={t.id}
                    onClick={() => onOpenTaskDetail(t)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                        {t.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          t.priority === 'HIGH'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                      <span>{project ? project.name : t.category}</span>
                      <span className="capitalize font-medium">{t.status.toLowerCase()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
