import React, { useState, useEffect } from 'react';
import { Cpu, MessageSquare, ShieldAlert } from 'lucide-react';
import { db } from '../data/mockDatabase';
import { AGENT_CONFIGS, type AgentLog } from '../data/seedData';

interface AgentConsoleProps {
  agentStatuses: Record<string, 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED'>;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({ agentStatuses }) => {
  const [logs, setLogs] = useState<AgentLog[]>(db.getAgentLogs());
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setLogs(db.getAgentLogs());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getAgentColor = (name: string) => {
    switch (name) {
      case 'Weather Agent': return 'border-blue-500 text-blue-400 bg-blue-500/5';
      case 'Shelter Agent': return 'border-pink-500 text-pink-400 bg-pink-500/5';
      case 'Resource Allocation Agent': return 'border-green-500 text-green-400 bg-green-500/5';
      case 'Medical Agent': return 'border-red-500 text-red-400 bg-red-500/5';
      case 'Rescue Agent': return 'border-indigo-500 text-indigo-400 bg-indigo-500/5';
      default: return 'border-slate-700 text-slate-400 bg-slate-800/10';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedAgent && log.agentName !== selectedAgent) return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left panel - Agent Directories */}
      <div className="w-80 border-r border-slate-900 bg-slate-950/60 p-6 overflow-y-auto hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-bold tracking-tight text-white uppercase">Agent Roster</h2>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => setSelectedAgent(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border transition-all duration-150 cursor-pointer ${
              selectedAgent === null
                ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40'
            }`}
          >
            All Swarm Feed
          </button>
          
          {AGENT_CONFIGS.map(agent => {
            const status = agentStatuses[agent.name] || 'IDLE';
            const isSelected = selectedAgent === agent.name;
            return (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(agent.name)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-800 text-white shadow-md' 
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">
                    {agent.name}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                    status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 
                    status === 'ANALYZING' || status === 'DECIDING' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' : 
                    'bg-slate-900 text-slate-500'
                  }`}>
                    {status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 font-medium">{agent.goal}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel - Streaming Feeds */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <div className="p-6 border-b border-slate-900 flex items-center gap-3 bg-slate-950/40">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Swarm Activity Feed</h2>
            <p className="text-[10px] text-slate-500 font-medium">Real-time collaborative planning logs.</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 font-mono text-xs">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span>Console awaiting action. Run AI Coordination from Overview tab.</span>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className={`p-4 rounded-xl border flex gap-3 text-xs shadow-sm max-w-2xl ${getAgentColor(log.agentName)}`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold font-mono text-[10px] border border-slate-800 flex-none text-white">
                  {log.agentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{log.agentName}</span>
                    <span className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-normal font-medium">{log.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentConsole;
