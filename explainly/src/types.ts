export interface UserProfile {
  name: string;
  standard: string;
  board: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Assessment {
  rating: number; // 1-10
  feedback: string;
  missingPoints: string[];
}

export type AppState = 'onboarding' | 'topic-selection' | 'teaching' | 'doubts' | 'assessment';
