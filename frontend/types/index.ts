export interface User {
  _id: string;
  name: string;
  email: string;
  role: "standard" | "professional";
  avatar?: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note: string;
  timestamp: Date;
}

export interface Meditation {
  id: string;
  title: string;
  duration: number;
  category: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetDays: number;
  completedDays: number;
  startDate: Date;
  category: string;
}

export interface GratitudeEntry {
  id: string;
  userId: string;
  content: string;
  sentiment: string;
  date: Date;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: Date;
  duration: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isActive: boolean;
}
