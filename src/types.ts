export interface Model {
  Model: string;
  'Parameter Count': string;
  'Context Length': number;
  'Model Type': string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  responseTime?: number; // Add this line to allow responseTime
}

export interface ChatResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}