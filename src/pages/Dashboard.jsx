import React, { useState } from 'react';
import { mockJobs, mockNodes, mockActivity } from '../data/mock';
import { Link } from 'react-router-dom';
import ScrambleText from '../components/common/ScrambleText';
import { useWealth } from '../context/WealthContext';
import {
  Users,
  Settings,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  LayoutGrid,
  Plus,
  Globe,
  CreditCard,
  Hexagon,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [isContributing, setIsContributing] = useState(false);
  const { wealth } = useWealth();

  const stats = [
    { label: 'Active Contributors', value: '1,248', trend: '+12 today', icon: Users },
    { label: 'Jobs Running', value: '412', trend: '+5 today', icon: Settings },
    { label: 'Network Points', value: '4,280', trend: 'Global Avg', icon: Hexagon },
    { label: 'Credits Balance', value: wealth.mindCredits.toLocaleString(), trend: '+142.5 today', icon: ArrowUpRight },
    { label: 'Active Tasks', value: '42', trend: '1.2s avg latency', icon: Clock },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING': return 'text-status-green bg-status-green/10 border-status-green/20';
      case 'PENDING': return 'text-status-yellow bg-status-yellow/10 border-status-yellow/20';
      case 'FAILED': return 'text-status-red bg-status-red/10 border-status-red/20';
      default: return 'text-text-muted bg-[#111] border-[#222]';
    }
  };

  const getCheckpointStyle = (status) => {
    switch (status) {
      case 'RUNNING': return { label: 'LIVE', color: 'text-status-green bg-status-green/10 border-status-green/20' };
      case 'PENDING': return { label: 'QUEUED', color: 'text-status-yellow bg-status-yellow/10 border-status-yellow/20' };
      case 'FAILED': return { label: 'REDISTRIBUTED', color: 'text-status-red bg-status-red/10 border-status-red/20' };
      default: return { label: 'UNKNOWN', color: 'text-text-muted bg-[#111] border-[#222]' };
    }
  };

  const transactions = [
    { type: 'earn', amount: '+12.0', desc: 'Contributed 2 GPU-hrs', time: '2M AGO' },
    { type: 'spend', amount: '-30.0', desc: 'Submitted ResNet Training', time: '1H AGO' },
    { type: 'earn', amount: '+8.5', desc: 'Contributed 1.5 CPU-hrs', time: '3H AGO' },
    { type: 'spend', amount: '-15.0', desc: 'Submitted ANN Experiment', time: '5H AGO' },
    { type: 'earn', amount: '+20.0', desc: 'Contributed 4 CPU-hrs', time: '1D AGO' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-text-primary pb-20 px-6 lg:px-8">
      {/* SECTION 1 — PAGE HEADER */}
      <div className="flex flex-row items-center justify-between mb-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight"><ScrambleText text="Dashboard" /></h1>
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-0.5">SYSTEM OVERVIEW</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsContributing(!isContributing)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${isContributing
                ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                : 'bg-surface-elevated border-[#222] text-text-muted'
              }`}
          >
            <span className={`text-[10px] font-mono uppercase flex items-center gap-1.5`}>
              {isContributing ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                  ◉ CONTRIBUTING
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                  ● IDLE
                </>
              )}
            </span>
          </button>

          <Link
            to="/submit"
            className="bg-accent-primary text-black text-xs font-mono font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Submit a Job
          </Link>
        </div>
      </div>

      {/* SECTION 2 — STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-card border border-[#222] rounded-2xl p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-mono font-bold text-status-green bg-status-green/5 px-2 py-0.5 rounded-full border border-status-green/10">
                {stat.trend}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-[#222] flex items-center justify-center mb-4 group-hover:border-accent-primary transition-colors">
              <stat.icon className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">
              <ScrambleText text={stat.label} />
            </div>
            <div className="text-3xl font-mono font-bold text-accent-primary leading-none">
              <ScrambleText text={stat.value} />
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3 — YOUR NODE */}
      <div className="bg-surface-card border border-accent-primary rounded-2xl p-6 w-full mb-8">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-accent-primary">YOUR NODE</div>
            <div className="text-xs font-mono text-text-muted mt-0.5">node-local-01</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isContributing ? 'bg-status-green animate-pulse' : 'bg-text-muted'}`} />
            <span className={`text-[10px] font-mono uppercase ${isContributing ? 'text-status-green' : 'text-text-muted'}`}>
              {isContributing ? 'CONTRIBUTING' : 'IDLE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CPU */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase tracking-tighter">
              <span>CPU</span>
              <span className="text-text-secondary">Intel i9-13900K</span>
              <span>34%</span>
            </div>
            <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
              <div
                className="bg-text-muted h-full transition-all duration-1000"
                style={{ width: '34%' }}
              />
            </div>
          </div>
          {/* GPU */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase tracking-tighter">
              <span>GPU</span>
              <span className="text-text-secondary">RTX 4080</span>
              <span>67%</span>
            </div>
            <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
              <div
                className="bg-accent-primary h-full transition-all duration-1000"
                style={{ width: '67%' }}
              />
            </div>
          </div>
          {/* RAM */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase tracking-tighter">
              <span>RAM</span>
              <span className="text-text-secondary">32GB DDR5</span>
              <span>51%</span>
            </div>
            <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
              <div
                className="bg-status-yellow h-full transition-all duration-1000"
                style={{ width: '51%' }}
              />
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-text-muted text-right mt-4 uppercase">
          2.4 GPU-hrs contributed today
        </div>
      </div>

      {/* SECTION 4 — MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Task Queue Table */}
        <div className="lg:col-span-2">
          <section className="bg-surface-card border border-[#222] rounded-2xl overflow-hidden h-full">
            <div className="p-6 border-b border-[#222] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold"><ScrambleText text="Current Task Queue" /></h2>
                <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.1em]">ACTIVE SYSTEM PROCESSES</p>
              </div>
              <Link to="/jobs" className="text-xs font-mono text-accent-primary hover:underline flex items-center gap-1">
                View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-[#111]">
                    <th className="w-[28%] px-4 py-3 text-[9px] font-mono tracking-[0.12em] text-[#555] uppercase whitespace-nowrap">Task Name</th>
                    <th className="w-[16%] px-4 py-3 text-[9px] font-mono tracking-[0.12em] text-[#555] uppercase whitespace-nowrap">Submitter</th>
                    <th className="w-[12%] px-4 py-3 text-[9px] font-mono tracking-[0.12em] text-[#555] uppercase whitespace-nowrap">Node</th>
                    <th className="w-[14%] px-4 py-3 text-[9px] font-mono tracking-[0.12em] text-[#555] uppercase whitespace-nowrap">Status</th>
                    <th className="w-[14%] px-4 py-3 text-[9px] font-mono tracking-[0.12em] text-[#555] uppercase whitespace-nowrap">Checkpoint</th>
                    <th className="w-[16%] px-4 py-3 text-[9px] font-mono tracking-[0.12em] text-[#555] uppercase whitespace-nowrap">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {mockJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#111] transition-colors group cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors truncate">
                          {job.name}
                        </div>
                        <div className="text-[9px] font-mono text-text-muted mt-0.5 uppercase tracking-tight truncate">
                          ID: {job.id}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-mono text-text-secondary truncate">@{job.submitter}</td>
                      <td className="px-4 py-3 text-[9px] font-mono text-text-muted uppercase truncate">
                        {job.node || 'node-77a2'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border whitespace-nowrap ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border whitespace-nowrap ${getCheckpointStyle(job.status).color}`}>
                          {getCheckpointStyle(job.status).label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-[60px] bg-surface-elevated h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-accent-primary h-full transition-all duration-1000"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-text-muted w-7 text-right">{job.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Credit Ledger */}
        <div className="lg:col-span-1">
          <section className="bg-surface-card border border-[#222] rounded-2xl flex flex-col h-full">
            <div className="p-6 border-b border-[#222]">
              <h2 className="text-lg font-bold"><ScrambleText text="Credit Activity" /></h2>
              <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.1em]">YOUR BALANCE & TRANSACTIONS</p>
            </div>

            <div className="p-6 pb-4 border-b border-[#222]">
              <div className="text-4xl font-mono font-bold text-accent-primary">
                <ScrambleText text={wealth.mindCredits.toLocaleString()} />
              </div>
              <p className="text-[10px] font-mono text-text-muted uppercase mt-1 tracking-widest">CREDITS AVAILABLE</p>
            </div>

            <div className="flex-1 p-6 space-y-0 divide-y divide-[#222]">
              {transactions.map((tx, i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <div>
                    <div className="text-xs text-text-secondary">{tx.desc}</div>
                    <div className="text-[10px] font-mono text-text-muted uppercase mt-0.5">{tx.time}</div>
                  </div>
                  <div className={`text-sm font-mono font-bold ${tx.type === 'earn' ? 'text-status-green' : 'text-status-red'}`}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#222]">
              <Link to="/credits" className="w-full block text-center text-[10px] font-mono text-[#555] uppercase tracking-widest hover:text-accent-primary transition-colors">
                View Full History →
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* SECTION 5 — ACTIVE COMPUTE NODES */}
      <div className="mb-8">
        <div className="mb-4 flex justify-between items-center px-1">
          <div>
            <h2 className="text-lg font-bold">Active Compute Nodes</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-[0.1em]">LIVE INSTANCES</p>
          </div>
          <LayoutGrid className="w-4 h-4 text-text-muted hover:text-accent-primary cursor-pointer transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pinned Your Node */}
          <div className="bg-surface-card border border-accent-primary p-5 rounded-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="text-xs font-mono text-accent-primary">
                  <ScrambleText text="node-local-01" />
                </div>
                <span className="text-[10px] font-mono bg-accent-primary text-black px-1.5 py-0.5 rounded ml-2 uppercase font-bold">YOU</span>
              </div>
              <div className={`w-2 h-2 rounded-full bg-status-green animate-pulse`} />
            </div>

            <div className="space-y-3">
              {/* CPU */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                  <span>CPU: Intel i9-13900K</span>
                  <span>34%</span>
                </div>
                <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
                  <div className="bg-text-muted h-full" style={{ width: '34%' }} />
                </div>
              </div>
              {/* GPU */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                  <span>GPU: RTX 4080</span>
                  <span>67%</span>
                </div>
                <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
                  <div className="bg-accent-primary h-full" style={{ width: '67%' }} />
                </div>
              </div>
              {/* RAM */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                  <span>RAM: 32GB</span>
                  <span>51%</span>
                </div>
                <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
                  <div className="bg-status-yellow h-full" style={{ width: '51%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Other Nodes */}
          {mockNodes.slice(0, 3).map((node) => (
            <div key={node.id} className="bg-surface-card border border-[#222] p-5 rounded-2xl hover:border-accent-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-mono text-accent-primary">
                  <ScrambleText text={node.id} />
                </div>
                <div className={`w-2 h-2 rounded-full ${node.status === 'ONLINE' ? 'bg-status-green' : 'bg-status-red'} animate-pulse`} />
              </div>

              <div className="space-y-3">
                {/* CPU */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                    <span>CPU: {node.specs.cpu}</span>
                    <span>{node.metrics.cpu}%</span>
                  </div>
                  <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
                    <div className="bg-text-muted h-full" style={{ width: `${node.metrics.cpu}%` }} />
                  </div>
                </div>
                {/* GPU */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                    <span>GPU: {node.specs.gpu}</span>
                    <span>{node.metrics.gpu}%</span>
                  </div>
                  <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
                    <div className="bg-accent-primary h-full" style={{ width: `${node.metrics.gpu}%` }} />
                  </div>
                </div>
                {/* RAM */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                    <span>RAM: {node.specs.ram}</span>
                    <span>{node.metrics.ram}%</span>
                  </div>
                  <div className="bg-surface-elevated h-1 rounded-full overflow-hidden">
                    <div className="bg-status-yellow h-full" style={{ width: `${node.metrics.ram}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6 — BOTTOM GRID (ACTIVITY FEED ONLY) */}
      <div className="grid grid-cols-1 gap-8">
        {/* Activity Feed */}
        <section className="bg-surface-card border border-[#222] rounded-2xl h-[450px] flex flex-col">
          <div className="p-6 border-b border-[#222]">
            <h2 className="text-lg font-bold">Activity Feed</h2>
            <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.1em]">LATEST NETWORK EVENTS</p>
          </div>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {mockActivity.map((event) => (
              <div key={event.id} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`p-1 rounded-full bg-surface-elevated border border-[#222] group-hover:border-accent-primary transition-colors`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${event.color === 'green' ? 'bg-status-green' :
                        event.color === 'red' ? 'bg-status-red' :
                          event.color === 'yellow' ? 'bg-status-yellow' : 'bg-text-secondary'
                      }`} />
                  </div>
                  <div className="w-[1px] flex-1 bg-[#222] mt-2 group-last:hidden" />
                </div>
                <div className="pb-6 last:pb-0">
                  <p className="text-xs text-text-primary leading-relaxed">{event.text}</p>
                  <span className="text-[10px] font-mono text-text-muted uppercase mt-1 inline-block">
                    <ScrambleText text={event.time} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-[#222]">
            <button className="w-full text-center py-2 text-[10px] font-mono text-[#555] uppercase tracking-widest hover:text-accent-primary transition-colors">
              Archive Log →
            </button>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Dashboard;
