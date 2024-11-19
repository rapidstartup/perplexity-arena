export interface Model {
  Model: string;
  'Parameter Count': string;
  'Context Length': number;
  'Model Type': string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
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