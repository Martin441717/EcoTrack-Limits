import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { TaskList } from './components/TaskList';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { AIPlannerModal } from './components/AIPlannerModal';
import { User, ViewState, StudyTask, TaskPriority, TaskStatus, GeneratedPlanItem } from './types';
import { Sparkles, Timer } from 'lucide-react';
import { addDays } from 'date-fns';

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTasks = localStorage.getItem('tasks');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const handleLogin = (email: string, name: string) => {
    setUser({ id: generateId(), name, email, energyLimit: 20 });
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    localStorage.clear();
    setShowAuth(false);
  };

  const handleAIPlanApply = (items: GeneratedPlanItem[]) => {
    const newTasks: StudyTask[] = items.map(item => ({
      id: generateId(),
      title: item.title,
      description: item.description,
      dueDate: addDays(new Date(), item.daysFromNow).toISOString(),
      priority: item.priority as TaskPriority,
      status: TaskStatus.TODO,
      subject: 'Ecoplan IA',
      energyCost: item.energyCost || 5,
      isExam: false
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setCurrentView('tasks');
  };

  if (!user) {
    if (showAuth) {
      return <Auth onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} onLogin={() => setShowAuth(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} userName={user.name} energyLimit={user.energyLimit} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onAddTask={() => setCurrentView('tasks')} />;
      case 'tasks':
        return (
          <TaskList 
            tasks={tasks} 
            onDelete={(id) => setTasks(t => t.filter(x => x.id !== id))} 
            onToggleStatus={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE } : t))}
            onAddTask={(t) => setTasks(prev => [...prev, { ...t, id: generateId(), energyCost: 5 }])}
          />
        );
      case 'focus':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Timer className="w-20 h-20 text-emerald-500 mb-6 animate-pulse" />
            <h2 className="text-3xl font-black text-slate-900 mb-2">Modo Enfoque</h2>
            <p className="text-slate-500 max-w-sm mb-8">Selecciona una tarea de tu lista para iniciar una sesión de estudio profundo.</p>
            <button 
              onClick={() => setCurrentView('tasks')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-200"
            >
              Ir a mis tareas
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8 bg-white rounded-3xl border border-slate-100">
             <h2 className="text-2xl font-black mb-6">Ajustes del Ecosistema</h2>
             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Límite Diario de Energía (PTS)</label>
                  <input 
                    type="range" min="10" max="50" 
                    value={user.energyLimit} 
                    onChange={(e) => setUser({...user, energyLimit: parseInt(e.target.value)})}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                    <span>Mínimo (10)</span>
                    <span>Actual: {user.energyLimit}</span>
                    <span>Máximo (50)</span>
                  </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      user={user}
      onLogout={handleLogout}
    >
      <div className="relative h-full">
        {renderView()}

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="fixed bottom-10 right-10 bg-slate-900 text-white p-5 rounded-[24px] shadow-2xl hover:scale-105 transition-all z-40 group flex items-center gap-3 border border-slate-800"
        >
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <span className="font-bold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Generar Ecoplan IA
          </span>
        </button>

        <AIPlannerModal 
          isOpen={isAIModalOpen} 
          onClose={() => setIsAIModalOpen(false)}
          onApplyPlan={handleAIPlanApply}
        />
      </div>
    </Layout>
  );
};

export default App;
