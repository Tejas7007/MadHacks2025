import { useState, type KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputBarProps {
  onSubmit: (question: string) => void;
  isGenerating: boolean;
}

export function InputBar({ onSubmit, isGenerating }: InputBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !isGenerating) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="glass-strong rounded-2xl shadow-neon-blue/20 p-4 border-cyber-blue/20">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isGenerating}
                rows={1}
                className="w-full bg-transparent resize-none outline-none text-white placeholder-white/40 disabled:opacity-50 max-h-32 min-h-[40px] py-2"
                style={{
                  height: 'auto',
                  minHeight: '40px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
              />
              {input && !isGenerating && (
                <div className="absolute right-2 bottom-2 opacity-50">
                  <Sparkles className="w-4 h-4 text-cyber-blue animate-pulse" />
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isGenerating}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                input.trim() && !isGenerating
                  ? 'bg-cyber-blue hover:bg-cyber-blue/80 text-white shadow-neon-blue hover:scale-105'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <div className="loading-spinner" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-3">
          Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60 font-mono">Enter</kbd> to send,{' '}
          <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60 font-mono">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
