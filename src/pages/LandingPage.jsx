import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, ArrowRight, Zap, Shield, Wallet } from 'lucide-react';
import ScrambleText from '../components/common/ScrambleText';

const LandingPage = () => {
  const stats = [
    { label: 'Active Nodes', value: '1,248' },
    { label: 'Jobs Running', value: '412' },
    { label: 'Network Total', value: '94.2 TFLOPS' },
  ];

  const features = [
    { 
      title: 'Zero Setup', 
      desc: 'Connect your resources in minutes with our lightweight client.', 
      icon: Zap 
    },
    { 
      title: 'Fault Tolerant', 
      desc: 'Jobs are automatically redistributed if nodes go offline.', 
      icon: Shield 
    },
    { 
      title: 'Credit Based', 
      desc: 'Transparent pricing with direct node operator payouts.', 
      icon: Wallet 
    },
  ];

  return (
    <div className="min-h-screen bg-background-base text-text-primary overflow-x-hidden animate-fade-in relative">
      <div className="noise" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-[#222]/50 bg-background-base/80 backdrop-blur-xl z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hexagon className="w-8 h-8 text-accent-primary" />
          <span className="text-xl font-mono font-bold tracking-tight">
            <ScrambleText text="HiveMind" />
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors">How it works</a>
          <a href="#docs" className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors">Docs</a>
          <Link to="/dashboard" className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors">Dashboard</Link>
        </div>
        
        <Link to="/dashboard">
          <button className="bg-accent-primary text-black px-6 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,255,0,0.1)]">
            Launch App
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
        {/* Yellow glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="text-[12px] font-mono uppercase tracking-[0.3em] text-accent-primary mb-6 animate-fade-in">
          <ScrambleText text="DECENTRALIZED COMPUTE NETWORK" />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black max-w-5xl leading-[0.95] mb-8 tracking-tighter">
          <ScrambleText text="Your idle GPU." /><br />
          <span className="text-text-secondary opacity-50"><ScrambleText text="Someone's" /></span> <span className="text-accent-primary"><ScrambleText text="breakthrough." /></span>
        </h1>
        
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mb-12">
          HiveMind connects idle CPU and GPU resources with researchers and developers 
          who need compute — without the proprietary cloud bill.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full justify-center">
          <Link to="/submit" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-accent-primary text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
              Submit a Job <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link to="/contributors" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-surface-card border border-[#333] text-text-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-accent-primary hover:text-accent-primary transition-all">
              Contribute Resources
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-24 py-8 px-12 border border-[#222] bg-surface-card/30 backdrop-blur-sm rounded-3xl">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                <span className="text-3xl md:text-4xl font-mono font-bold text-accent-primary">
                  <ScrambleText text={stat.value} />
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#555]">
                <ScrambleText text={stat.label} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-32 border-t border-[#222] bg-background-base/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="group p-8 rounded-3xl bg-surface-card border border-[#222] hover:border-accent-primary transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,255,0,0.03)]">
              <div className="w-12 h-12 rounded-2xl bg-accent-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                <ScrambleText text={feature.title} />
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-12 border-t border-[#222] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] font-mono tracking-widest text-text-muted">
          HIVEMIND · WT'26 · DECENTRALIZED COMPUTE
        </div>
        <div className="flex gap-8 text-[10px] font-mono tracking-widest text-text-muted">
          <a href="#" className="hover:text-accent-primary transition-colors">TWITTER</a>
          <a href="#" className="hover:text-accent-primary transition-colors">GITHUB</a>
          <a href="#" className="hover:text-accent-primary transition-colors">DISCORD</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
