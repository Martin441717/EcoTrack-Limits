import React, { useState } from 'react';
import { StudyTask, TaskPriority, TaskStatus } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, CheckCircle, Circle, AlertTriangle, Filter } from 'lucide-react';

interface TaskListProps {
  tasks: StudyTask[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onDelete, onAddTask }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // New Task Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [isExam, setIsExam] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status !== TaskStatus.DONE;
    if (filter === 'completed') return t.status === TaskStatus.DONE;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title,
      subject,
      dueDate: dueDate || new Date().toISOString(),
      priority,
      status: TaskStatus.TODO,
      isExam,
      description: ''
    });
    setIsFormOpen(false);
    // Reset
    setTitle('');
    setSubject('');
    setDueDate('');
    setPriority(TaskPriority.MEDIUM);
    setIsExam(false);
  };

  const getPriorityBadge = (p: TaskPriority) => {
    const colors = {
      [TaskPriority.HIGH]: 'bg-red-100 text-red-700',
      [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-700',
      [TaskPriority.LOW]: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[p]}`}>
        {p}
      </span>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Tareas y Exámenes</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          {isFormOpen ? 'Cancelar' : '+ Nueva Tarea'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 animate-slide-in-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Ej: Estudiar Cap 3 de Historia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
              <input 
                required 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Ej: Matemáticas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
              <input 
                type="date" 
                required 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div className="flex items-center gap-4">
               <div className="flex-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                 <select 
                   value={priority} 
                   onChange={e => setPriority(e.target.value as TaskPriority)}
                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                 >
                   {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
               </div>
               <div className="flex items-center gap-2 mt-6">
                 <input 
                   type="checkbox" 
                   id="isExam" 
                   checked={isExam} 
                   onChange={e => setIsExam(e.target.checked)}
                   className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                 />
                 <label htmlFor="isExam" className="text-sm font-medium text-gray-700">Es Examen</label>
               </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                Guardar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              filter === f 
                ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto space-y-3 pb-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No hay tareas en esta vista.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`
                group flex items-center gap-4 p-4 rounded-xl border transition-all
                ${task.status === TaskStatus.DONE ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'}
              `}
            >
              <button 
                onClick={() => onToggleStatus(task.id)}
                className={`shrink-0 transition-colors ${task.status === TaskStatus.DONE ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
              >
                {task.status === TaskStatus.DONE ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold truncate ${task.status === TaskStatus.DONE ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.isExam && (
                    <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      <AlertTriangle className="w-3 h-3" /> Examen
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span>{task.subject}</span>
                  <span>•</span>
                  <span>{format(new Date(task.dueDate), "d 'de' MMM", { locale: es })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getPriorityBadge(task.priority)}
                <button 
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
