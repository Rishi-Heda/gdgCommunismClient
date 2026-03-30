import React from 'react';
import { mockJobs, mockNodes, mockActivity, mockCredits } from '../data/mock';
import { 
  Users, 
  Settings, 
  TrendingUp, 
  ArrowUpRight, 
  MoreHorizontal,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrambleText from '../components/common/ScrambleText';

const Dashboard = () => {
  const stats = [
    { label: 'Active Contributors', value: '1,248', trend: '+12 today', icon: Users },
    { label: 'Jobs Running', value: '412', trend: '+5 today', icon: Settings },
    { label: 'Compute Hours', value: '18.4k', trend: '+1.2k today', icon: TrendingUp },
    { label: 'Credits Earned', value: mockCredits.balance.toLocaleString(), trend: '+142.5 today', icon: ArrowUpRight },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING': return 'text-status-green bg-status-green/10 border-status-green/20';
      case 'PENDING': return 'text-status-yellow bg-status-yellow/10 border-status-yellow/20';
      case 'FAILED': return 'text-status-red bg-status-red/10 border-status-red/20';
      default: return 'text-text-muted bg-[#111] border-[#222]';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Feed & Table */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Current Task Queue Table */}
          <section className="bg-surface-card border border-[#222] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#222] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Current Task Queue</h2>
                <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.1em]">ACTIVE SYSTEM PROCESSES</p>
              </div>
              <Link to="/jobs" className="text-xs font-mono text-accent-primary hover:underline flex items-center gap-1">
                View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111]">
                    <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-[#555] uppercase">Task Name</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-[#555] uppercase">Submitter</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-[#555] uppercase">Status</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-[#555] uppercase">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {mockJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#111] transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                          <ScrambleText text={job.name} />
                        </div>
                        <div className="text-[10px] font-mono text-text-muted mt-0.5 uppercase tracking-tighter">
                          ID: <ScrambleText text={job.id} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-text-secondary">@{job.submitter}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-48">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-surface-elevated h-1 rounded-full overflow-hidden">
                            <div 
                              className="bg-accent-primary h-full transition-all duration-1000" 
                              style={{ width: `${job.progress}%` }} 
                            />
                          </div>
                          <span className="text-[10px] font-mono text-text-muted w-8">{job.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Active Nodes Grid */}
          <section>
            <div className="mb-4 flex justify-between items-center px-1">
              <div>
                <h2 className="text-lg font-bold">Active Compute Nodes</h2>
                <p className="text-xs text-text-muted font-mono uppercase tracking-[0.1em]">LIVE INSTANCES</p>
              </div>
              <LayoutGrid className="w-4 h-4 text-text-muted hover:text-accent-primary cursor-pointer transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockNodes.slice(0, 4).map((node) => (
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
                        <span>RAM Usage</span>
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
          </section>
        </div>

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-1">
          <section className="bg-surface-card border border-[#222] rounded-2xl h-full flex flex-col">
            <div className="p-6 border-b border-[#222]">
              <h2 className="text-lg font-bold">Activity Feed</h2>
              <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.1em]">LATEST NETWORK EVENTS</p>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[1000px]">
              {mockActivity.map((event) => (
                <div key={event.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`p-1 rounded-full bg-surface-elevated border border-[#222] group-hover:border-accent-primary transition-colors`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        event.color === 'green' ? 'bg-status-green' : 
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
    </div>
  );
};

export default Dashboard;
