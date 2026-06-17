export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'premium';
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  summary?: string;
  content?: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

export interface FlashcardSet {
  id: string;
  documentId: string;
  userId: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  documentId: string;
  userId: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  completedAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}
