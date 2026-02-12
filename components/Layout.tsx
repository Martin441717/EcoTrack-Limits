import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CheckSquare, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Activity,
  Timer
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  user,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: CalendarDays },
    { id: 'tasks', label: 'Track de Tareas', icon: CheckSquare },
    { id: 'focus', label: 'Modo Enfoque', icon: Timer },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-black tracking-tighter">EcoTrack</span>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as ViewState);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-black border border-slate-700">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="hidden lg:block w-72 h-full z-20">
        <NavContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 p-4 z-30 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Activity className="text-emerald-600 w-6 h-6" />
          <span className="font-black text-slate-900 tracking-tight">EcoTrack</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 bg-slate-50 rounded-lg">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 shadow-2xl animate-fade-in">
            <NavContent />
          </div>
          <div className="flex-1 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 overflow-auto pt-20 lg:pt-0 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
