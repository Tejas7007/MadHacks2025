export interface KnowledgeNode {
  id: string;
  position: [number, number, number];
  title: string;
  sourceUrl: string;
  chunkText: string;
  whyUsed: string;
  isActive: boolean;
  tier: number;
  role: 'principle' | 'fact' | 'example' | 'analogy';
}

export interface Connection {
  from: string;
  to: string;
  strength: number;
  isActive: boolean;
}

export interface AnswerCore {
  text: string;
  isGenerating: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  question: string;
  answer: AnswerCore;
  nodes: KnowledgeNode[];
  connections: Connection[];
}

export type ViewMode = 'idle' | 'thinking' | 'exploring';

export type ClusteringMode = 'none' | 'tiers' | 'roles';
