import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Target, 
  BarChart3, 
  Timer, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">EcoTrack<span className="text-emerald-600">Limits</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition">Log In</button>
            <button onClick={onGetStarted} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition transform hover:scale-105 active:scale-95">
              Únete Ahora
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            Nivel de Productividad: Sostenible
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Domina tus estudios <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Sin Agotarte.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
            La primera plataforma que rastrea tus tareas y tu energía. Usa IA para planificar sesiones eficientes y mantenerte dentro de tus límites.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button onClick={onGetStarted} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition flex items-center justify-center gap-3 transform hover:-translate-y-1">
              Empezar mi Track
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="px-10 py-5 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xl hover:bg-slate-100 transition">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      <section className="py-32 bg-slate-900 text-white rounded-[60px] mx-4 my-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { icon: Target, title: "Límites Reales", desc: "No te satures. EcoTrack calcula tu capacidad diaria para evitar el estrés excesivo." },
              { icon: Zap, title: "Planificación IA", desc: "Gemini analiza tus temas y genera cronogramas basados en dificultad y energía." },
              { icon: Timer, title: "Focus Tracker", desc: "Mide el tiempo real invertido y optimiza tus sesiones de estudio con cronómetros inteligentes." }
            ].map((f, i) => (
              <div key={i} className="group">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition duration-300 mx-auto md:mx-0">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-slate-100">
        <p className="text-slate-400 font-medium">© {new Date().getFullYear()} EcoTrack Limits. Diseñado para la excelencia académica.</p>
      </footer>
    </div>
  );
};
