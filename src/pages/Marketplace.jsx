import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  ChevronRight,
  Gift,
  ExternalLink,
  Coins,
  Plus
} from 'lucide-react';
import ScrollingTape from '../components/marketplace/ScrollingTape';
import { mockWealth } from '../data/mock';

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All Assets');
  const [exchangeAmount, setExchangeAmount] = useState(1000);
  const mcReceive = exchangeAmount / mockWealth.exchangeRate;

  const allItems = [
    {
      id: 'p1',
      category: 'Compute',
      company: 'NVIDIA',
      title: 'H100 Priority Access',
      desc: 'Get 24h guaranteed priority on H100 clusters.',
      cost: '25,000 HC',
      icon: Cpu,
      color: 'bg-black'
    },
    {
      id: 'p2',
      category: 'Datasets',
      company: 'DataForge',
      title: 'Medical Corpus v2',
      desc: 'Exclusive access to verified healthcare datasets.',
      cost: '15,000 HC',
      icon: Database,
      color: 'bg-black'
    },
    {
      id: 'p3',
      category: 'Partner Rewards',
      company: 'CoreSecure',
      title: 'Advanced Encryption',
      desc: 'Hardware-level encryption for your compute jobs.',
      cost: '8,000 HC',
      icon: ShieldCheck,
      color: 'bg-black'
    },
    {
      id: 'm1',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Neon Signature Cap',
      desc: 'Exclusive HiveMind embroidered dark cap.',
      cost: '1,500 HC',
      image: '/merch/cap.jpeg',
      color: 'bg-surface-card'
    },
    {
      id: 'm2',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Matrix T-Shirt',
      desc: 'Premium cotton tee with our signature pattern.',
      cost: '2,500 HC',
      image: '/merch/tshirt.jpeg',
      color: 'bg-surface-card'
    },
    {
      id: 'm3',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Root Access Hoodie',
      desc: 'Heavyweight hoodie for late-night coding sessions.',
      cost: '4,000 HC',
      image: '/merch/hoodie.jpeg',
      color: 'bg-surface-card'
    },
    {
      id: 'm4',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Quantum Coffee Cup',
      desc: 'Ceramic mug to keep your focus sharp.',
      cost: '800 HC',
      image: '/merch/coffee cup.jpeg',
      color: 'bg-surface-card'
    }
  ];

  const categories = ['All Assets', 'Compute', 'Datasets', 'Neural Weights', 'Partner Rewards', 'Merch'];

  const filteredItems = activeCategory === 'All Assets' 
    ? allItems 
    : allItems.filter(item => item.category === activeCategory);


  return (
    <div className="animate-fade-in pb-20">
      {/* Header Section with Scrolling Tape */}
      <div className="relative -mt-12 mb-24">
        <ScrollingTape text="THE HIVE MARKET" speed={40} tilt={-2} />

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-8 mt-16 text-center">
          <p className="text-text-secondary font-medium max-w-xl text-sm leading-relaxed">
            Exchange your earned Hive Coins for Mind Credits or exclusive partner assets and hardware access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Exchange Center */}
        <div className="lg:col-span-2 p-10 rounded-[40px] bg-black inverted-dark-container shadow-2xl relative overflow-hidden group text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 blur-[80px] -mr-32 -mt-32" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 text-[#FAFF00]">
              <ArrowRightLeft className="w-6 h-6" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Currency Exchange</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-4 text-[#FAFF00]/70">You Give (Hive Coins)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={exchangeAmount}
                      onChange={(e) => setExchangeAmount(Number(e.target.value))}
                      className="w-full bg-[#FAFF00]/10 border-2 border-[#FAFF00]/20 rounded-3xl px-8 py-6 text-4xl font-black focus:outline-none focus:border-[#FAFF00] transition-all text-[#FAFF00] placeholder:text-[#FAFF00]/30"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
                      <span className="text-xs font-mono font-bold text-[#FAFF00]">HC</span>
                      <span className="text-[10px] text-white/50 underline cursor-pointer hover:text-white transition-colors" onClick={() => setExchangeAmount(mockWealth.hiveCoins)}>MAX</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent-primary text-black flex items-center justify-center rotate-90 md:rotate-0">
                    <ArrowRightLeft className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-4 text-[#FAFF00]/70">You Receive (Mind Credits)</label>
                  <div className="bg-accent-primary/5 border-2 border-dashed border-accent-primary/20 rounded-3xl px-8 py-6 flex justify-between items-center">
                    <span className="text-4xl font-black text-white">{mcReceive.toLocaleString()}</span>
                    <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">MC</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent-primary/5 rounded-[32px] p-8 border border-accent-primary/10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                    <Zap className="w-4 h-4 text-accent-primary" /> Exchange Info
                  </h3>
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between border-b border-accent-primary/10 pb-2">
                      <span className="text-white/60 font-mono">RATE</span>
                      <span className="text-white font-bold">10 HC : 1 MC</span>
                    </div>
                    <div className="flex justify-between border-b border-accent-primary/10 pb-2">
                      <span className="text-white/60 font-mono">FEE</span>
                      <span className="text-status-green font-bold">0.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 font-mono">PROCESSING</span>
                      <span className="text-white font-bold">INSTANT</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-black text-[#FAFF00] border-2 border-[#FAFF00] py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#FAFF00] hover:text-black active:scale-95 transition-all mt-8">
                  Confirm Exchange
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wealth Summary Pill */}
        <div className="p-8 rounded-[40px] bg-surface-card border border-black/10 flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Coins className="w-5 h-5" /> Your Wealth
            </h2>
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-black inverted-dark-container border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#FAFF00]/70 mb-1">Hive Coins (HC)</div>
                <div className="text-3xl font-black tracking-tighter text-white">{mockWealth.hiveCoins.toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-black/10">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">Mind Credits (MC)</div>
                <div className="text-3xl font-black tracking-tighter">{mockWealth.mindCredits.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-black/5 rounded-3xl p-6 border border-dashed border-black/20 flex flex-col items-center justify-center text-center">
            <Gift className="w-8 h-8 mb-3 text-black/30" />
            <p className="text-xs font-mono uppercase tracking-widest text-black/40">New Partner Rewards Coming Soon</p>
          </div>
        </div>

      </div>

      {/* Partner Section */}
      <div className="mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 px-4">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            {activeCategory === 'All Assets' ? 'Asset Catalog' : activeCategory}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 p-1 bg-surface-card border border-black/10 rounded-2xl hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-black text-[#FAFF00]' : 'hover:bg-black/5 text-text-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border-2 border-black/5 rounded-[40px] p-8 hover:border-black transition-all cursor-pointer group h-full flex flex-col">
              {item.image && (
                <div className="w-full h-48 rounded-[24px] overflow-hidden bg-black/5 flex items-center justify-center mb-6">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className={`flex items-start ${!item.image ? 'justify-between' : 'justify-end'} mb-6`}>
                {!item.image && (
                  <div className={`p-4 rounded-3xl bg-black text-white`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                )}
                <div className="text-[10px] whitespace-nowrap font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-black/10">
                  {item.company}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:italic transition-all">{item.title}</h3>
              <p className="text-text-secondary text-sm mb-8 flex-1">{item.desc}</p>

              <div className="flex items-center justify-between pt-6 border-t border-black/5">
                <div className="font-mono text-sm font-black italic">{item.cost}</div>
                <button className="w-10 h-10 rounded-full bg-black text-[#FAFF00] flex items-center justify-center group-hover:scale-110 transition-all border border-[#FAFF00]/20">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
