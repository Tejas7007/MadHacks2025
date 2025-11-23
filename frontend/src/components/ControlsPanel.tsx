import { Layers, Target, Info, Circle } from 'lucide-react';
import type { ClusteringMode } from '../types';

interface ControlsPanelProps {
  clusteringMode: ClusteringMode;
  onClusteringModeChange: (mode: ClusteringMode) => void;
}

export function ControlsPanel({
  clusteringMode,
  onClusteringModeChange,
}: ControlsPanelProps) {
  return (
    <div className="absolute top-6 right-6 glass-strong rounded-xl p-4 min-w-[280px] z-10 fade-in shadow-neon-blue/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyber-blue/10 flex items-center justify-center">
          <Layers className="w-4 h-4 text-cyber-blue" />
        </div>
        <span className="text-sm font-semibold text-white">Visualization Mode</span>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onClusteringModeChange('none')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
            clusteringMode === 'none'
              ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 shadow-neon-blue/20'
              : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="font-medium">Default View</span>
        </button>

        <button
          onClick={() => onClusteringModeChange('tiers')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
            clusteringMode === 'tiers'
              ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 shadow-neon-blue/20'
              : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="font-medium">Tier Clustering</span>
        </button>

        <button
          onClick={() => onClusteringModeChange('roles')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
            clusteringMode === 'roles'
              ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 shadow-neon-blue/20'
              : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
          }`}
        >
          <Circle className="w-4 h-4" />
          <span className="font-medium">Role Clustering</span>
        </button>
      </div>

      {/* Legend */}
      {clusteringMode !== 'none' && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Legend</span>
          </div>
          <div className="space-y-2">
            {clusteringMode === 'tiers' && (
              <>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-tier-1 shadow-neon-green" />
                  <span className="text-white/70">Tier 1: Direct connections</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-tier-2 shadow-neon-blue" />
                  <span className="text-white/70">Tier 2: Supporting sources</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-tier-3 shadow-neon-purple" />
                  <span className="text-white/70">Tier 3+: Background context</span>
                </div>
              </>
            )}
            {clusteringMode === 'roles' && (
              <>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-role-principle" />
                  <span className="text-white/70">Principle: Core concepts</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-role-fact" />
                  <span className="text-white/70">Fact: Supporting evidence</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-role-example" />
                  <span className="text-white/70">Example: Practical cases</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full bg-role-analogy" />
                  <span className="text-white/70">Analogy: Comparisons</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
