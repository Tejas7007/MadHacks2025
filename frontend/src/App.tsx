import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputBar } from './components/InputBar';
import { ThinkingGlobe } from './components/ThinkingGlobe';
import { NodeDetailPanel } from './components/NodeDetailPanel';
import { ControlsPanel } from './components/ControlsPanel';
import type {
  ChatSession,
  KnowledgeNode,
  Connection,
  ViewMode,
  ClusteringMode,
  AnswerStep,
} from './types';

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('idle');
  const [clusteringMode, setClusteringMode] = useState<ClusteringMode>('none');

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Chat',
      timestamp: new Date(),
      question: '',
      answer: {
        text: '',
        isGenerating: false,
        currentStep: 0,
        totalSteps: 0,
        steps: [],
      },
      nodes: [],
      connections: [],
      status: 'idle',
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setViewMode('idle');
    setSelectedNode(null);
    setClusteringMode('none');
  };

  const handleSubmitQuestion = async (question: string) => {
    if (!activeSessionId) {
      handleNewChat();
      return;
    }

    // Update session with question
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              question,
              title: question.slice(0, 50) + (question.length > 50 ? '...' : ''),
              status: 'loading' as const,
            }
          : s
      )
    );

    // Start AI thinking animation
    setViewMode('zooming');
    setTimeout(() => setViewMode('thinking'), 500);

    await simulateAIThinking(question);
  };

  const simulateAIThinking = async (question: string) => {
    // Generate mock nodes in 3D space
    const numNodes = 8 + Math.floor(Math.random() * 5);
    const nodes: KnowledgeNode[] = [];
    const connections: Connection[] = [];
    const steps: AnswerStep[] = [];

    // Generate nodes
    for (let i = 0; i < numNodes; i++) {
      const theta = (i / numNodes) * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 2;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const tier = i < 3 ? 1 : i < 6 ? 2 : 3;
      const roles: Array<'principle' | 'fact' | 'example' | 'analogy'> = [
        'principle',
        'fact',
        'example',
        'analogy',
      ];
      const role = roles[i % roles.length];

      nodes.push({
        id: `node-${i}`,
        position: [x, y, z],
        title: `${getRandomSource()} - ${role}`,
        sourceUrl: `https://example.com/source-${i + 1}`,
        chunkText: getRandomChunkText(),
        whyUsed: getRandomWhyUsed(),
        isActive: false,
        tier,
        role,
        relevanceScore: 0.6 + Math.random() * 0.4,
      });

      // Connect to answer core (center)
      if (i < 6) {
        connections.push({
          from: `node-${i}`,
          to: 'answer-core',
          strength: Math.random() * 0.5 + 0.5,
          isActive: false,
          type: 'support',
        });
      }

      // Connect some nodes to each other
      if (i > 0 && Math.random() > 0.5) {
        connections.push({
          from: `node-${i}`,
          to: `node-${Math.floor(Math.random() * i)}`,
          strength: Math.random() * 0.3 + 0.2,
          isActive: false,
          type: 'explain',
        });
      }
    }

    // Generate answer steps
    const answerParts = getAnswerParts(question);
    answerParts.forEach((text, index) => {
      const contributingNodes = nodes
        .slice(index * 2, (index + 1) * 2)
        .map((n) => n.id);

      steps.push({
        id: `step-${index}`,
        text,
        contributingNodeIds: contributingNodes,
        order: index,
      });
    });

    // Update status to generating
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              status: 'generating' as const,
              answer: {
                ...s.answer,
                isGenerating: true,
                totalSteps: nodes.length,
                steps,
              },
            }
          : s
      )
    );

    setViewMode('generating');

    // Animate nodes appearing one by one
    for (let i = 0; i < nodes.length; i++) {
      await sleep(300);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                nodes: nodes.slice(0, i + 1),
                connections: connections.filter((c) =>
                  nodes.slice(0, i + 1).some((n) => n.id === c.from)
                ),
                answer: {
                  ...s.answer,
                  currentStep: i + 1,
                },
              }
            : s
        )
      );
    }

    // Activate nodes step by step
    for (let step = 0; step <= steps.length; step++) {
      await sleep(500);

      const fullAnswer = steps.slice(0, step).map(s => s.text).join(' ');

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                answer: {
                  ...s.answer,
                  text: fullAnswer || 'Analyzing sources...',
                  isGenerating: step < steps.length,
                  currentStep: step,
                },
                nodes: s.nodes.map((n, i) => ({
                  ...n,
                  isActive: i < step * 2,
                })),
                connections: s.connections.map((c) => ({
                  ...c,
                  isActive: step > steps.length / 2,
                })),
              }
            : s
        )
      );
    }

    // Finalize
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              status: 'complete' as const,
            }
          : s
      )
    );

    setViewMode('exploring');
  };

  // Initialize with a demo session
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-space-900 overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-glow opacity-20" />

        {/* 3D Globe */}
        <ThinkingGlobe
          nodes={activeSession?.nodes || []}
          connections={activeSession?.connections || []}
          answerCore={activeSession?.answer || null}
          viewMode={viewMode}
          clusteringMode={clusteringMode}
          onNodeClick={setSelectedNode}
          onNodeHover={() => {}}
        />

        {/* Controls Panel */}
        {viewMode !== 'idle' && (
          <ControlsPanel
            clusteringMode={clusteringMode}
            onClusteringModeChange={setClusteringMode}
          />
        )}

        {/* Input Bar */}
        <InputBar
          onSubmit={handleSubmitQuestion}
          isGenerating={activeSession?.answer.isGenerating || false}
        />

        {/* Node Detail Panel */}
        {selectedNode && (
          <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </div>
  );
}

// Helper functions
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sources = [
  'Physics Principles',
  'Orbital Mechanics',
  'Gravitational Theory',
  'Satellite Engineering',
  'Space Technology',
  'Aerospace Research',
  'Newtonian Laws',
  'Celestial Mechanics',
  'Space Science',
  'Astrophysics Fundamentals',
];

function getRandomSource() {
  return sources[Math.floor(Math.random() * sources.length)];
}

function getRandomChunkText() {
  const texts = [
    'This source provides fundamental concepts about the underlying principles and methodologies. The content discusses key aspects that are essential for understanding the broader context.',
    'Research shows that this approach has been validated through multiple studies and practical applications. The evidence suggests strong correlation with theoretical frameworks.',
    'The implementation details outlined here demonstrate practical applications of the concept. These methods have been tested and refined over multiple iterations.',
    'Historical context reveals the evolution of this idea and its impact on current practices. Understanding this background is crucial for proper application.',
    'Key principles demonstrate how fundamental forces and dynamics govern behavior in this domain. Mathematical models support these observations with quantitative precision.',
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

function getRandomWhyUsed() {
  const reasons = [
    'Provides foundational context for the main answer',
    'Offers supporting evidence and validation',
    'Presents practical examples and applications',
    'Gives historical perspective and background',
    'Explains core principles and methodologies',
    'Demonstrates real-world implementation',
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

function getAnswerParts(_question: string): string[] {
  return [
    `To answer your question, we need to understand several interconnected concepts.`,
    'The fundamental principle involves a balance of forces and energy.',
    'Key factors include velocity, altitude, and gravitational pull.',
    'These elements work together in a precisely calculated equilibrium.',
    'The result is a stable configuration that can be maintained over time.',
  ];
}

export default App;
