import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Cpu, 
  Zap, 
  Database, 
  Wifi, 
  Bell, 
  Globe, 
  Activity,
  ChevronRight,
  Terminal,
  LogOut,
  Fingerprint
} from 'lucide-react';
import { mockWealth } from '../data/mock';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('identity');
  const [nodeActive, setNodeActive] = useState(true);
  const [computeAllocation, setComputeAllocation] = useState(75);

  const tabs = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'node', label: 'Node Config', icon: Cpu },
    { id: 'interface', label: 'Interface', icon: Globe },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'identity':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 font-mono">
                <Fingerprint className="w-5 h-5 text-[#FAFF00]" />
                Neural Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-2">Username</label>
                    <input type="text" defaultValue="Hivestitch_Admin" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FAFF00] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-2">Bio-Link</label>
                    <textarea rows="3" defaultValue="Neural architect and compute provider. Building the backbone of the HiveMind network." className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FAFF00] transition-all resize-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-2">Public Key</label>
                    <div className="flex items-center gap-2 bg-black/60 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-text-secondary truncate">
                      hv_8f2a...9c4e7d2b01
                      <button className="ml-auto text-[#FAFF00] hover:scale-110 transition-all font-bold">COPY</button>
                    </div>
                  </div>
                  <div className="p-6 bg-[#FAFF00]/5 border border-[#FAFF00]/10 rounded-2xl">
                    <p className="text-[11px] text-[#FAFF00] font-mono italic">
                      Verified Contributor Status: Level 4 Architect
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'node':
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
                  className={`px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest transition-all ${nodeActive ? 'bg-[#FAFF00] text-black shadow-[0_0_20px_rgba(250,255,0,0.3)]' : 'bg-white/5 text-text-muted'}`}
                >
                  {nodeActive ? 'NODE ACTIVE' : 'NODE OFFLINE'}
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Compute Power Allocation</label>
                    <span className="text-[#FAFF00] font-mono font-bold italic">{computeAllocation}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={computeAllocation}
                    onChange={(e) => setComputeAllocation(e.target.value)}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FAFF00]" 
                  />
                  <div className="flex justify-between mt-2 text-[9px] font-mono text-text-muted uppercase italic">
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
      case 'interface':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 font-mono">
                <Bell className="w-5 h-5 text-[#FAFF00]" />
                Communication
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Direct Messages', 'System Alerts', 'Network Vitality', 'Market Updates'].map((notif, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black checked:bg-[#FAFF00] accent-[#FAFF00]" />
                    <span className="text-sm font-bold text-text-secondary">{notif}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12">
        {/* Left: Navigation and Profile Preview */}
        <aside className="space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FAFF00] to-yellow-600 rounded-3xl mb-6 mx-auto flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-[#FAFF00]" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black italic font-mono mb-1 text-white">Hivestitch_Admin</h2>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-4">Level 4 Architect</p>
                <div className="flex items-center justify-center gap-2 px-3 py-1 bg-[#FAFF00]/10 border border-[#FAFF00]/20 rounded-full w-fit mx-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FAFF00] animate-pulse" />
                  <span className="text-[9px] font-mono font-bold text-[#FAFF00] uppercase tracking-widest">Network Synchronized</span>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 font-mono text-xs uppercase tracking-widest font-bold ${activeTab === tab.id ? 'bg-[#FAFF00] border-[#FAFF00] text-black shadow-[0_10px_30px_rgba(250,255,0,0.2)]' : 'bg-transparent border-white/5 text-text-secondary hover:border-white/20'}`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-[#FAFF00]'}`} />
                  {tab.label}
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
            </nav>
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
                <div className="text-lg font-black italic text-[#FAFF00]">{mockWealth.mindCredits.toLocaleString()} MC</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="flex flex-col items-end">
                <div className="text-[9px] font-mono text-text-muted uppercase leading-none">Market Assets</div>
                <div className="text-lg font-black italic text-[#888]">{mockWealth.hiveCoins.toLocaleString()} HC</div>
              </div>
            </div>
          </div>

          <div className="min-h-[500px]">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
