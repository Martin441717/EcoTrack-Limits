import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { StudyTask, TaskPriority } from '../types';

interface CalendarViewProps {
  tasks: StudyTask[];
  onAddTask: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return 'bg-red-500';
      case TaskPriority.MEDIUM: return 'bg-yellow-500';
      case TaskPriority.LOW: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
            Hoy
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map((day, dayIdx) => {
          const dayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              onClick={() => onAddTask(day)}
              className={`
                min-h-[100px] p-2 border-b border-r border-gray-100 relative group cursor-pointer transition-colors hover:bg-gray-50
                ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700'}
                `}>
                  {format(day, 'd')}
                </span>
                <button className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`
                      text-xs p-1.5 rounded-md truncate border-l-2 shadow-sm
                      ${task.isExam ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-indigo-500 text-gray-700'}
                    `}
                    title={task.title}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${getPriorityColor(task.priority)}`}></span>
                    {task.isExam && <span className="font-bold mr-1">EXAM:</span>}
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
