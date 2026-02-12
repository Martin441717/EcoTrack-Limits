
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPlanItem } from '../types';

// Correct initialization of GoogleGenAI using a named parameter and direct process.env reference.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyPlan = async (
  topic: string,
  examDate: string,
  currentKnowledge: string
): Promise<GeneratedPlanItem[]> => {
  if (!process.env.API_KEY) {
    return [
      { title: "Revisión General", description: "Leer apuntes básicos", daysFromNow: 0, priority: "Media", energyCost: 3 },
      { title: "Práctica Intensiva", description: "Resolver ejercicios del tema", daysFromNow: 1, priority: "Alta", energyCost: 8 }
    ];
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `
      Eres un experto en PRODUCTIVIDAD SOSTENIBLE y el método de ECO-TRACKING.
      Genera un plan de estudio para "${topic}" con fecha límite ${examDate}.
      Conocimiento actual: "${currentKnowledge}".
      
      IMPORTANTE: Para cada tarea, asigna un 'energyCost' del 1 al 10 (1=lectura ligera, 10=simulacro de examen intenso).
      Distribuye la carga de forma equilibrada para no superar los límites humanos de enfoque.
    `;

    // Using gemini-3-pro-preview for this complex planning task which requires advanced reasoning.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              daysFromNow: { type: Type.INTEGER },
              priority: { type: Type.STRING, enum: ["Alta", "Media", "Baja"] },
              energyCost: { type: Type.INTEGER, description: "Coste de energía del 1 al 10" }
            },
            required: ["title", "description", "daysFromNow", "priority", "energyCost"]
          }
        }
      }
    });

    // Accessing .text property directly as per the latest SDK guidelines.
    return JSON.parse(response.text || '[]') as GeneratedPlanItem[];
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};
