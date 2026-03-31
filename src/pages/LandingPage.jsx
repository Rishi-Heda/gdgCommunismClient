import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Wallet, Hexagon, Store } from 'lucide-react';
import ScrambleText from '../components/common/ScrambleText';
import FloatingHeader from '../components/layout/FloatingHeader';

const LandingPage = () => {
  const [liveStats, setLiveStats] = useState({
    active_nodes: '0',
    jobs_running: '0',
    network_total_tflops: '0 TFLOPS'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/network/stats');
        if (response.ok) {
          const data = await response.json();
          setLiveStats({
            active_nodes: data.active_nodes.toLocaleString(),
            jobs_running: data.jobs_running.toLocaleString(),
            network_total_tflops: data.network_total_tflops
          });
        }
      } catch (error) {
        console.error('Failed to fetch landing stats:', error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: 'Active Nodes', value: liveStats.active_nodes },
    { label: 'Jobs Running', value: liveStats.jobs_running },
    { label: 'Network Total', value: liveStats.network_total_tflops },
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
    {
      title: 'Exchange & Rewards',
      desc: 'Transform your Hive Coins into Mind Credits or exclusive partner rewards.',
      icon: Store
    },
  ];

  return (
    <div className="min-h-screen bg-background-base text-text-primary overflow-x-hidden animate-fade-in relative">
      <div className="noise" />

      {/* Premium Navigation Header */}
      <FloatingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
        {/* Yellow glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 blur-[120px] rounded-full -z-10" />

        {/* branding block */}
        <div className="flex items-center gap-4 mb-10 px-8 py-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_50px_rgba(250,255,0,0.05)] group hover:border-accent-primary/50 transition-all duration-700">
          <Hexagon className="w-7 h-7 text-accent-primary animate-spin-slow" />
          <span className="text-[22px] font-black tracking-[0.6em] uppercase text-white/90 ml-2">
            <ScrambleText text="HiveMind" />
          </span>
        </div>
        <div className="text-[12px] font-mono uppercase tracking-[0.3em] text-accent-primary mb-6 animate-fade-in">
          <ScrambleText text="DECENTRALIZED COMPUTE NETWORK" />
        </div>

        <h1 className="text-5xl md:text-8xl font-black max-w-5xl leading-[0.95] mb-6 tracking-tighter">
          <ScrambleText text="Your idle GPU." /><br />
          <span className="text-text-secondary opacity-50"><ScrambleText text="Someone's" /></span> <span className="text-accent-primary"><ScrambleText text="breakthrough." /></span>
        </h1>

        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mb-10">
          HiveMind connects idle CPU and GPU resources with researchers and developers
          who need compute, without the proprietary cloud bill.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full justify-center">
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
