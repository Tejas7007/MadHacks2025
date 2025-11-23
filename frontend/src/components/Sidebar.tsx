import { Plus, MessageSquare, Clock, Sparkles } from 'lucide-react';
import type { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
}: SidebarProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-80 h-full bg-space-900 border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center shadow-neon-blue">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Reasoning</h1>
            <p className="text-xs text-white/50">Transparent thinking</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full px-4 py-3 bg-cyber-blue/10 hover:bg-cyber-blue/20 border border-cyber-blue/30 hover:border-cyber-blue/50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 text-cyber-blue group-hover:rotate-90 transition-transform duration-200" />
          <span className="text-sm font-medium text-cyber-blue">New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-2 px-3 py-2 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Recent</span>
        </div>

        <div className="space-y-1">
          {sessions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/40">No conversations yet</p>
              <p className="text-xs text-white/30 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`
                  w-full px-3 py-3 rounded-lg transition-all duration-200 text-left group
                  ${
                    session.id === activeSessionId
                      ? 'bg-cyber-blue/15 border border-cyber-blue/30'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-200 ${
                      session.id === activeSessionId
                        ? 'text-cyber-blue'
                        : 'text-white/40 group-hover:text-white/60'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate transition-colors duration-200 ${
                        session.id === activeSessionId
                          ? 'text-cyber-blue'
                          : 'text-white/80 group-hover:text-white'
                      }`}
                    >
                      {session.title || 'New Chat'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">
                        {formatTimestamp(session.timestamp)}
                      </span>
                      {session.status === 'generating' && (
                        <span className="flex items-center gap-1 text-xs text-cyber-blue">
                          <span className="w-1 h-1 bg-cyber-blue rounded-full animate-pulse" />
                          Thinking...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/40 text-center">
          Powered by <span className="text-cyber-blue font-semibold">RAG</span> + <span className="text-cyber-purple font-semibold">LLM</span>
        </div>
      </div>
    </div>
  );
}
