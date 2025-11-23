// Core data structures for the AI reasoning visualization

export interface KnowledgeNode {
  id: string;
  position: [number, number, number];
  title: string;
  sourceUrl?: string;
  chunkText: string;
  whyUsed: string;
  isActive: boolean;
  tier: number; // 1 = directly connected to answer, 2 = secondary, 3+ = tertiary
  role: 'principle' | 'fact' | 'example' | 'analogy';
  relevanceScore?: number; // 0-1, how relevant this node is
}

export interface Connection {
  from: string;
  to: string;
  strength: number; // 0-1, strength of the relationship
  isActive: boolean;
  type?: 'support' | 'contrast' | 'explain' | 'example';
}

export interface AnswerStep {
  id: string;
  text: string;
  contributingNodeIds: string[]; // Which nodes contributed to this step
  order: number;
}

export interface AnswerCore {
  text: string;
  isGenerating: boolean;
  currentStep: number;
  totalSteps: number;
  steps: AnswerStep[];
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  question: string;
  answer: AnswerCore;
  nodes: KnowledgeNode[];
  connections: Connection[];
  status: 'idle' | 'loading' | 'generating' | 'complete' | 'error';
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export type ViewMode = 'idle' | 'zooming' | 'thinking' | 'generating' | 'exploring';
export type ClusteringMode = 'none' | 'tiers' | 'roles';

// API Response types (for when backend is ready)
export interface RAGResponse {
  nodes: Omit<KnowledgeNode, 'position' | 'isActive'>[];
  connections: Omit<Connection, 'isActive'>[];
  answer: {
    text: string;
    steps: Omit<AnswerStep, 'id'>[];
  };
}
