import { X, ExternalLink, Copy, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';
import type { KnowledgeNode } from '../types';

interface NodeDetailPanelProps {
  node: KnowledgeNode | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    if (node?.sourceUrl) {
      navigator.clipboard.writeText(node.sourceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!node) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[32rem] glass-strong border-l border-cyber-blue/20 flex flex-col z-50 slide-up">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-white mb-2">{node.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTierColor(node.tier)}`}>
              Tier {node.tier}
            </span>
            {node.role && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(node.role)}`}>
                {node.role}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Why Used */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-cyber-blue" />
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Why This Source?</h4>
          </div>
          <p className="text-sm text-white/90 leading-relaxed bg-cyber-blue/5 p-4 rounded-lg border border-cyber-blue/10">
            {node.whyUsed}
          </p>
        </div>

        {/* Chunk Text */}
        <div>
          <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">Source Content</h4>
          <div className="bg-space-950/80 rounded-lg p-5 border border-white/5">
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-mono">
              {node.chunkText}
            </p>
          </div>
        </div>

        {/* Source URL */}
        {node.sourceUrl && (
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">Source Link</h4>
            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
              <a
                href={node.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm text-cyber-blue hover:text-cyber-blue/80 truncate flex items-center gap-2 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{node.sourceUrl}</span>
              </a>
              <button
                onClick={handleCopyUrl}
                className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:scale-110"
                title="Copy URL"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Relevance Score */}
        {node.relevanceScore !== undefined && (
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">Relevance Score</h4>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Similarity</span>
                <span className="text-sm font-mono text-cyber-blue">{(node.relevanceScore * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full transition-all duration-500"
                  style={{ width: `${node.relevanceScore * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTierColor(tier: number): string {
  switch (tier) {
    case 1:
      return 'bg-tier-1/20 text-tier-1 border border-tier-1/30';
    case 2:
      return 'bg-tier-2/20 text-tier-2 border border-tier-2/30';
    default:
      return 'bg-tier-3/20 text-tier-3 border border-tier-3/30';
  }
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'principle':
      return 'bg-role-principle/20 text-role-principle border border-role-principle/30';
    case 'fact':
      return 'bg-role-fact/20 text-role-fact border border-role-fact/30';
    case 'example':
      return 'bg-role-example/20 text-role-example border border-role-example/30';
    case 'analogy':
      return 'bg-role-analogy/20 text-role-analogy border border-role-analogy/30';
    default:
      return 'bg-white/10 text-white/70 border border-white/20';
  }
}
