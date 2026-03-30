import React from 'react';
import { 
  Users, 
  MapPin, 
  Cpu, 
  Zap, 
  Search, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { mockNodes } from '../data/mock';
import ScrambleText from '../components/common/ScrambleText';

const Contributors = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'text-status-green bg-status-green/10 border-status-green/20';
      case 'OFFLINE': return 'text-status-red bg-status-red/10 border-status-red/20';
      default: return 'text-text-muted bg-[#111] border-[#222]';
    }
  };

  const networkStats = [
    { label: 'Online Nodes', value: '1,192', icon: Zap, color: 'text-status-green' },
    { label: 'Avg CPU Load', value: '42.8%', icon: Cpu, color: 'text-accent-primary' },
    { label: 'Total TFLOPS', value: '94,200', icon: ShieldCheck, color: 'text-text-primary' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-accent-primary" />
            <ScrambleText text="Contributor Network" />
          </h1>
          <p className="text-text-secondary mt-1">1,248 active nodes across 14 global regions. Providing distributed compute for research.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-accent-primary text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,255,0,0.1)]">
            Join the Network <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Network Stats Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {networkStats.map((stat) => (
          <div key={stat.label} className="bg-surface-card border border-[#222] rounded-2xl p-6 group hover:border-accent-primary transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-surface-elevated border border-[#222] group-hover:border-accent-primary transition-all ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#555]">
                <ScrambleText text={stat.label} />
              </span>
            </div>
            <div className={`text-4xl font-mono font-bold ${stat.color}`}>
              <ScrambleText text={stat.value} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-card border border-[#222] p-4 rounded-2xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select className="bg-surface-elevated border border-[#222] rounded-xl px-4 py-2 text-xs font-mono text-text-secondary outline-none focus:border-accent-primary transition-colors cursor-pointer appearance-none">
            <option>All Regions</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia</option>
            <option>South America</option>
          </select>
          
          <select className="bg-surface-elevated border border-[#222] rounded-xl px-4 py-2 text-xs font-mono text-text-secondary outline-none focus:border-accent-primary transition-colors cursor-pointer appearance-none">
            <option>All Statuses</option>
            <option>Online</option>
            <option>Offline</option>
          </select>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Filter by ID or hardware..." 
            className="w-full bg-surface-elevated border border-[#222] rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-accent-primary transition-colors text-text-primary"
          />
        </div>
      </div>

      {/* Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...mockNodes, ...mockNodes, ...mockNodes].slice(0, 9).map((node, idx) => (
          <div key={`${node.id}-${idx}`} className="bg-surface-card border border-[#222] rounded-3xl p-6 card-hover relative group">
            <header className="flex justify-between items-start mb-6">
              <div>
                <div className="text-sm font-mono font-bold text-accent-primary">
                  <ScrambleText text={node.id} />
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-text-muted">
                  <span className="text-sm">{node.location}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusColor(node.status)}`}>
                {node.status}
              </span>
            </header>
            
            <div className="space-y-4 mb-8">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#444] mb-2 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Hardware Spec
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-elevated rounded-xl p-3 border border-[#222] group-hover:border-[#333]">
                  <div className="text-[8px] font-mono text-[#555] uppercase tracking-tighter mb-1">CPU</div>
                  <div className="text-[10px] font-medium truncate">{node.specs.cpu}</div>
                </div>
                <div className="bg-surface-elevated rounded-xl p-3 border border-[#222] group-hover:border-[#333]">
                  <div className="text-[8px] font-mono text-[#555] uppercase tracking-tighter mb-1">RAM</div>
                  <div className="text-[10px] font-medium">{node.specs.ram}</div>
                </div>
              </div>
              <div className="bg-surface-elevated rounded-xl p-3 border border-[#222] group-hover:border-[#333]">
                <div className="text-[8px] font-mono text-[#555] uppercase tracking-tighter mb-1">GPU Accelerator</div>
                <div className="text-[10px] font-medium text-accent-primary">{node.specs.gpu}</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#444] mb-2">Live Metrics</div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">Usage Intensity</span>
                    <span className="text-[10px] text-accent-primary font-mono">{node.metrics.cpu}%</span>
                  </div>
                  <div className="h-1 bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-accent-primary transition-all duration-1000" style={{ width: `${node.metrics.cpu}%` }} />
                  </div>
               </div>
            </div>

            <footer className="pt-6 border-t border-[#222] flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <div className="text-[8px] font-mono text-[#555] uppercase tracking-tighter mb-0.5">Completed</div>
                  <div className="text-xs font-mono font-bold">{node.jobsCompleted}</div>
                </div>
                <div>
                  <div className="text-[8px] font-mono text-[#555] uppercase tracking-tighter mb-0.5">Reputation</div>
                  <div className="text-xs font-mono font-bold flex items-center gap-1">
                    {node.reputation} <Star className="w-3 h-3 text-status-yellow fill-status-yellow" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-mono text-[#555] uppercase tracking-tighter mb-0.5">Uptime</div>
                <div className="text-xs font-mono font-bold text-status-green">{node.uptime}</div>
              </div>
            </footer>
          </div>
        ))}
      </div>
      
      <div className="py-12 flex justify-center">
        <button className="bg-surface-card border border-[#222] text-text-secondary px-8 py-3 rounded-xl font-bold hover:border-accent-primary hover:text-accent-primary transition-all flex items-center gap-2">
          Load More Nodes <Zap className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Contributors;
