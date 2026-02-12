
import React from 'react';
import { StudyTask, TaskPriority, TaskStatus } from '../types';
import { format, isToday, compareAsc } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Zap, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';

interface DashboardProps {
  tasks: StudyTask[];
  userName: string;
  energyLimit: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, userName, energyLimit }) => {
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE);
  const todaysTasks = pendingTasks.filter(t => isToday(new Date(t.dueDate)));
  
  const currentEnergyUsage = todaysTasks.reduce((acc, t) => acc + (t.energyCost || 5), 0);
  const energyPercentage = Math.min((currentEnergyUsage / energyLimit) * 100, 100);

  const upcomingTasks = [...pendingTasks].sort((a, b) => 
    compareAsc(new Date(a.dueDate), new Date(b.dueDate))
  ).slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Panel de Control</span>
          <h1 className="text-4xl font-black text-slate-900 mt-1">Hola, {userName}</h1>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-slate-700">{format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Limit Meter */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden lg:col-span-2">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="text-emerald-400" />
                Presupuesto de Energía
              </h2>
              <span className="text-slate-400 font-medium">{currentEnergyUsage} / {energyLimit} pts</span>
            </div>
            
            <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full transition-all duration-1000 ${energyPercentage > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${energyPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <p className="text-slate-400">
                {energyPercentage > 90 
                  ? "⚠️ Estás cerca de tu límite. Considera delegar o posponer."
                  : "✓ Tienes capacidad suficiente para tus objetivos de hoy."}
              </p>
              <button className="text-emerald-400 font-bold hover:underline">Configurar Límites</button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        </div>

        {/* Focus Score */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Focus Score</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-slate-900">8.4</span>
              <span className="text-emerald-600 font-bold mb-1">/ 10</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-600">
            {/* Added TrendingUp icon below to fix "Cannot find name 'TrendingUp'" error */}
            <TrendingUp className="text-emerald-500 w-4 h-4" />
            <span>+1.2 mejor que la semana pasada</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Tareas Pendientes', value: pendingTasks.length, icon: Activity, color: 'emerald' },
           { label: 'Exámenes Próximos', value: tasks.filter(t => t.isExam).length, icon: AlertCircle, color: 'amber' },
           { label: 'Carga de Hoy', value: `${todaysTasks.length} tareas`, icon: BarChart3, color: 'blue' },
           { label: 'Modo Enfoque', value: 'Listo', icon: BrainCircuit, color: 'purple' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition">
             <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl w-fit mb-4`}>
               <stat.icon className="w-5 h-5" />
             </div>
             <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
             <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">Track de Actividades</h2>
          <button className="text-emerald-600 font-bold hover:text-emerald-700">Ver Calendario Completo</button>
        </div>
        
        <div className="space-y-4">
          {upcomingTasks.length === 0 ? (
            <p className="text-center py-10 text-slate-400 font-medium">Sin actividades registradas.</p>
          ) : (
            upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${task.priority === TaskPriority.HIGH ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{task.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{task.subject} • {format(new Date(task.dueDate), "d 'de' MMM", { locale: es })}</p>
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">
                  {task.energyCost || 5} PTS
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
