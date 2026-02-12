import React, { useState } from 'react';
import { X, Sparkles, Loader2, BookOpen, Calendar, BrainCircuit } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import { GeneratedPlanItem } from '../types';

interface AIPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (items: GeneratedPlanItem[]) => void;
}

export const AIPlannerModal: React.FC<AIPlannerModalProps> = ({ isOpen, onClose, onApplyPlan }) => {
  const [topic, setTopic] = useState('');
  const [examDate, setExamDate] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const plan = await generateStudyPlan(topic, examDate, knowledge);
      onApplyPlan(plan);
      onClose();
      // Reset form
      setTopic('');
      setExamDate('');
      setKnowledge('');
    } catch (err) {
      setError('Hubo un error al generar el plan. Por favor verifica tu conexión o intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">Planificador IA</h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 text-sm">
            Dile a Gemini qué tienes que estudiar y cuándo es tu examen. La IA creará un cronograma optimizado para ti.
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Materia o Tema
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Ej: Biología Celular, Historia del Siglo XX..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Fecha del Examen/Entrega
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-500" />
                Nivel Actual / Notas
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="Ej: Entiendo los conceptos básicos pero necesito practicar problemas..."
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar Plan de Estudio
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
