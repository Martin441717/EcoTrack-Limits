export type ViewState = 'dashboard' | 'calendar' | 'tasks' | 'focus' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  energyLimit: number; // Max points per day
}

export enum TaskPriority {
  LOW = 'Baja',
  MEDIUM = 'Media',
  HIGH = 'Alta',
}

export enum TaskStatus {
  TODO = 'Pendiente',
  IN_PROGRESS = 'En Progreso',
  DONE = 'Completado',
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  subject: string;
  isExam?: boolean;
  energyCost: number; // 1-10 points
}

export interface GeneratedPlanItem {
  title: string;
  description: string;
  daysFromNow: number;
  priority: string;
  energyCost: number;
}
