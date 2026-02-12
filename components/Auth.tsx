import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth delay
    setTimeout(() => {
      onLogin(email, name || email.split('@')[0]);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-20 p-2 bg-white/20 backdrop-blur-sm md:bg-gray-100 rounded-full text-white md:text-gray-600 hover:bg-white/40 md:hover:bg-gray-200 transition-colors"
          title="Volver al inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Left Side: Illustration/Brand */}
        <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
          
          <div className="relative z-10 mt-8 md:mt-0">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">EstudioGenius AI</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Organiza tus estudios, supera tus exámenes y alcanza tus metas académicas con nuestra plataforma inteligente.
            </p>
          </div>

          <div className="relative z-10 space-y-4 hidden md:block">
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✓</div>
              <span>Planificación con IA</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✓</div>
              <span>Recordatorios inteligentes</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✓</div>
              <span>Seguimiento de progreso</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8 mt-4 md:mt-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta'}
            </h2>
            <p className="text-gray-500">
              {isLogin 
                ? 'Ingresa tus datos para acceder a tu panel.' 
                : 'Comienza a organizar tu vida académica hoy.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  placeholder="estudiante@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 font-semibold hover:underline"
              >
                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
