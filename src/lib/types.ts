// Types for Aura BeautyIA

export type AppScreen = 
  | 'splash'
  | 'auth'
  | 'camera'
  | 'assessment'
  | 'subscription'
  | 'editor'
  | 'library'
  | 'settings';

export type AuthMethod = 'email' | 'phone' | 'google' | 'apple';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'annual';
  subscriptionDate?: string;
}

export interface FacialAssessment {
  skinQuality: number; // 0-100
  skinTone: string;
  faceShape: string;
  suggestions: AssessmentSuggestion[];
  analyzedAt: string;
}

export interface AssessmentSuggestion {
  id: string;
  category: 'skin' | 'hair' | 'beard' | 'makeup' | 'body';
  title: string;
  description: string;
  isPremium: boolean;
}

export interface EditorTool {
  id: string;
  name: string;
  icon: string;
  category: 'free' | 'premium';
  description: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  createdAt: string;
  editedAt?: string;
}
