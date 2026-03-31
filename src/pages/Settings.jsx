import React, { useState } from 'react';
import { 
  User, 
  Cpu, 
  Zap, 
  Database, 
  Wifi, 
  Activity,
  Pencil
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

const Settings = () => {
  const [nodeActive, setNodeActive] = useState(true);
  const [computeAllocation, setComputeAllocation] = useState(75);
  const [username, setUsername] = useState('Hivestitch_Admin');
  const [isEditingName, setIsEditingName] = useState(false);
  const { wealth } = useWealth();

  const renderNodeContent = () => {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3 font-mono">
              <Activity className="w-5 h-5 text-[#FAFF00]" />
              Compute Control
            </h3>
            <button 
              onClick={() => setNodeActive(!nodeActive)}
              className={`px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest transition-all ${nodeActive ? 'bg-[#FAFF00] text-black shadow-[0_0_20px_rgba(250,255,0,0.3)]' : 'bg-white/5 text-text-secondary'}`}
            >
              {nodeActive ? 'NODE ACTIVE' : 'NODE OFFLINE'}
            </button>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">Compute Power Allocation</label>
                <span className="text-[#FAFF00] font-mono font-bold italic">{computeAllocation}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={computeAllocation}
                onChange={(e) => setComputeAllocation(e.target.value)}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FAFF00]" 
              />
              <div className="flex justify-between mt-2 text-[9px] font-mono text-text-secondary uppercase italic">
                <span>Power Saving</span>
                <span>High Fidelity</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Bandwidth', value: 'Unlimited', icon: Wifi },
                { label: 'Disk Share', value: '512 GB', icon: Database },
                { label: 'Worker Latency', value: '14ms', icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-[#FAFF00]/30 transition-all transition-all">
                  <stat.icon className="w-4 h-4 text-[#FAFF00] mb-4" />
                  <div className="text-[9px] font-mono text-text-muted uppercase mb-1">{stat.label}</div>
                  <div className="text-lg font-bold font-mono">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-0 pb-20 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12">
        {/* Left: Navigation and Profile Preview */}
        <aside className="space-y-8">
          <div className="sticky top-20 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FAFF00] to-yellow-600 rounded-3xl mb-6 mx-auto flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-[#FAFF00]" />
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {isEditingName ? (
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditingName(false);
                        }
                      }}
                      autoFocus
                      className="w-52 bg-black/40 border border-white/10 rounded-xl px-3 py-1 text-center text-lg font-black font-mono text-white focus:outline-none focus:border-[#FAFF00] transition-all"
                    />
                  ) : (
                    <h2 className="text-xl font-black font-mono text-white">{username}</h2>
                  )}
                  <button
                    onClick={() => setIsEditingName((prev) => !prev)}
                    className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-[#FAFF00] hover:scale-105 transition-all"
                    aria-label="Edit username"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em] mb-4">Level 4 Architect</p>
                <div className="flex items-center justify-center gap-2 px-3 py-1 bg-[#FAFF00]/10 border border-[#FAFF00]/20 rounded-full w-fit mx-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FAFF00] animate-pulse" />
                  <span className="text-[9px] font-mono font-bold text-[#FAFF00] uppercase tracking-widest">Network Synchronized</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Content Area */}
        <main className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div>
              <h1 className="text-4xl font-black italic font-mono mb-2 uppercase text-white">Settings</h1>
              <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Manage your terminal environment</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[28px] p-4 pr-6">
              <div className="flex flex-col items-end">
                <div className="text-[9px] font-mono text-text-muted uppercase leading-none">Wallet Status</div>
                <div className="text-lg font-black italic text-[#FAFF00]">{wealth.mindCredits.toLocaleString()} MC</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="flex flex-col items-end">
                <div className="text-[9px] font-mono text-text-muted uppercase leading-none">Market Assets</div>
                <div className="text-lg font-black italic text-text-secondary">{wealth.hiveCoins.toLocaleString()} HC</div>
              </div>
            </div>
          </div>

          <div className="min-h-[500px]">
            {renderNodeContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
