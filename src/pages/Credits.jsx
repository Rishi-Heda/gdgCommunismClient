import React from 'react';
import { Wallet, TrendingUp, PieChart, Clock, CreditCard, ChevronRight, Zap, Target, Layers } from 'lucide-react';
import ScrambleText from '../components/common/ScrambleText';

import { mockWealth } from '../data/mock';

const Credits = () => {
  const mcBalance = mockWealth.mindCredits.toLocaleString();
  const hcBalance = mockWealth.hiveCoins.toLocaleString();
  
  const usageStats = [
    { label: 'AI Inference', percentage: 62, icon: Zap, color: '#FAFF00' },
    { label: 'Rendering', percentage: 24, icon: Layers, color: '#FFFFFF' },
    { label: 'Computation', percentage: 14, icon: Target, color: '#888' },
  ];

  const packages = [
    { 
      name: 'Starter', 
      amount: '2,000', 
      price: '10', 
      bonus: '0%', 
      desc: 'Ideal for individual experimentation.',
      popular: false 
    },
    { 
      name: 'Developer', 
      amount: '12,000', 
      price: '50', 
      bonus: '20%', 
      desc: 'Best for standard development teams.',
      popular: true 
    },
    { 
      name: 'Enterprise', 
      amount: '150,000', 
      price: '500', 
      bonus: '50%', 
      desc: 'Maximum throughput for scaled apps.',
      popular: false 
    },
  ];

  const history = [
    { date: 'MAR 30', action: 'Purchase (Developer)', amount: '+12,000 HC', status: 'Completed' },
    { date: 'MAR 29', action: 'Job Execution (LLM-70B)', amount: '-142.50 HC', status: 'Successful' },
    { date: 'MAR 29', action: 'Job Execution (Node-AF)', amount: '-84.20 HC', status: 'Successful' },
    { date: 'MAR 28', action: 'Purchase (Starter)', amount: '+2,000 HC', status: 'Completed' },
  ];

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col gap-8">
        
        {/* Hero Section - Balance Dashboard */}
        <div className="relative p-10 rounded-[32px] bg-surface-card border border-[#222] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/5 blur-[100px] -mr-48 -mt-48 transition-all duration-700 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10 w-full">
            <div className="flex flex-col md:flex-row gap-12">
               <div>
                 <div className="flex items-center gap-2 mb-3 text-text-muted font-mono tracking-widest text-[10px] uppercase">
                   <Zap className="w-3 h-3 text-accent-primary" />
                   Compute Fuel (MC)
                 </div>
                 <div className="flex items-baseline gap-3">
                   <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                     <ScrambleText text={mcBalance} />
                   </h1>
                   <span className="text-xl font-mono text-accent-primary font-bold">MC</span>
                 </div>
               </div>

               <div className="md:border-l md:border-white/10 md:pl-12">
                 <div className="flex items-center gap-2 mb-3 text-text-muted font-mono tracking-widest text-[10px] uppercase">
                   <Wallet className="w-3 h-3 text-text-secondary" />
                   Earning Rewards (HC)
                 </div>
                 <div className="flex items-baseline gap-3">
                   <h1 className="text-5xl md:text-6xl font-black tracking-tighter opacity-80">
                     <ScrambleText text={hcBalance} />
                   </h1>
                   <span className="text-xl font-mono text-text-muted font-bold">HC</span>
                 </div>
               </div>
            </div>
            
            <button className="bg-accent-primary text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(250,255,0,0.1)] group">
              <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Quick Purchase
            </button>
          </div>
        </div>

        {/* Credit System Explanation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-[#FAFF00]/20 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FAFF00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAFF00]/10 flex items-center justify-center border border-[#FAFF00]/20">
                <Zap className="w-5 h-5 text-[#FAFF00]" />
              </div>
              <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
                <ScrambleText text="MindCredits (MC) — Compute Fuel" />
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-1">
              MindCredits are the operational fuel of the HiveMind. Use them to launch high-fidelity AI models, secure priority compute queues, and execute complex distributed tasks across the network. 
              <span className="block mt-2 text-[#FAFF00] font-mono text-[10px] uppercase tracking-wider font-bold">Utility: Spending · Performance · Priority</span>
            </p>
          </div>

          <div className="space-y-4 md:border-l md:border-white/10 md:pl-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAFF00]/10 flex items-center justify-center border border-[#FAFF00]/20">
                <Wallet className="w-5 h-5 text-[#FAFF00]" />
              </div>
              <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
                <ScrambleText text="HiveCoins (HC) — Earning Rewards" />
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-1">
              HiveCoins are the proof of your contribution. Earn them by providing GPU/CPU bandwidth, completing network-verified tasks, or participating in the HiveMind economy.
              <span className="block mt-2 text-[#FAFF00] font-mono text-[10px] uppercase tracking-wider font-bold">Utility: Earning · Liquidity · Redemption</span>
            </p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usage Stats */}
          <div className="p-8 rounded-[32px] bg-surface-card border border-[#222] flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent-primary" />
                <ScrambleText text="Usage Insights" />
              </h2>
              <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">Last 30 Days</span>
            </div>

            <div className="flex flex-col gap-6">
              {usageStats.map((stat) => (
                <div key={stat.label} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-background-base border border-[#333] flex items-center justify-center p-1.5">
                          <stat.icon className="w-full h-full text-text-secondary group-hover:text-accent-primary transition-colors" />
                       </div>
                       <span className="text-sm font-medium text-text-secondary">{stat.label}</span>
                    </div>
                    <span className="font-mono text-sm font-bold">{stat.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-background-base rounded-full overflow-hidden border border-[#222]">
                    <div 
                      className="h-full bg-accent-primary group-hover:brightness-125 transition-all duration-1000 ease-out" 
                      style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Mini Chart Alternative */}
          <div className="p-8 rounded-[32px] bg-surface-card border border-[#222] flex flex-col gap-6 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-2">
                <PieChart className="w-5 h-5 text-accent-primary" />
                <h2 className="text-xl font-bold">
                   <ScrambleText text="Efficiency Score" />
                </h2>
             </div>
             
             <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative flex items-center justify-center">
                   {/* Mock SVG Circle Chart */}
                   <svg className="w-48 h-48 -rotate-90">
                      <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[#181818]" />
                      <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502.4" strokeDashoffset="50.24" className="text-accent-primary animate-[dash_2s_ease-in-out_forwards]" />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-black tracking-tighter">94%</span>
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-1">Optimal</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-background-base border border-[#222]">
                   <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Cost / Epoch</div>
                   <div className="text-lg font-bold">0.42 HC</div>
                </div>
                <div className="p-4 rounded-2xl bg-background-base border border-[#222]">
                   <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Peak Utilization</div>
                   <div className="text-lg font-bold">98.2%</div>
                </div>
             </div>
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 px-2">
            <CreditCard className="w-6 h-6 text-accent-primary" />
             Purchase Mind Credits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.name} 
                className={`relative p-8 rounded-[32px] border ${pkg.popular ? 'border-accent-primary bg-accent-primary/[0.03] shadow-[0_0_60px_rgba(250,255,0,0.05)]' : 'border-[#222] bg-surface-card'} flex flex-col items-center text-center group cursor-pointer hover:border-accent-primary transition-all duration-500`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                
                <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] mb-4">{pkg.name}</span>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black tracking-tighter">
                    <ScrambleText text={pkg.amount} />
                  </span>
                  <span className="text-sm font-mono text-accent-primary font-bold">MC</span>
                </div>
                
                <div className="text-2xl font-black mb-6">
                  {pkg.bonus !== '0%' && (
                    <span className="text-xs text-status-green font-mono uppercase tracking-widest block mb-1">+{pkg.bonus} Bonus</span>
                  )}
                  ${pkg.price}
                </div>

                <p className="text-text-secondary text-sm mb-8 leading-relaxed px-4">
                  {pkg.desc}
                </p>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${pkg.popular ? 'bg-accent-primary text-black hover:brightness-110' : 'bg-surface-elevated text-text-primary hover:bg-background-base border border-[#333] hover:border-accent-primary'}`}>
                  Select Pack <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions History */}
        <div className="p-8 rounded-[32px] bg-surface-card border border-[#222]">
           <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-accent-primary" />
              <ScrambleText text="Transaction History" />
           </h2>

           <div className="flex flex-col font-inter">
              <div className="grid grid-cols-4 gap-4 px-4 pb-4 border-b border-[#222] text-[10px] font-mono tracking-widest text-text-muted uppercase">
                 <div>Date</div>
                 <div>Description</div>
                 <div>Amount</div>
                 <div className="text-right">Status</div>
              </div>
              
              <div className="flex flex-col">
                {history.map((item, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-[#222]/50 hover:bg-surface-elevated/50 transition-colors">
                    <div className="text-sm text-text-secondary font-mono">{item.date}</div>
                    <div className="text-sm font-semibold">{item.action}</div>
                    <div className={`text-sm font-mono font-bold ${item.amount.startsWith('+') ? 'text-status-green' : 'text-text-primary'}`}>
                       {item.amount.replace('HC', item.action.includes('Purchase') ? 'MC' : 'HC')}
                    </div>
                    <div className="text-sm text-right flex items-center justify-end gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Completed' || item.status === 'Successful' ? 'bg-status-green' : 'bg-status-yellow'}`} />
                       <span className="text-text-secondary text-xs">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Credits;
