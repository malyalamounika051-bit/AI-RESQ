import React, { useState, useEffect } from 'react';
import { Cpu, Terminal } from 'lucide-react';
import { db } from '../data/mockDatabase';
import { AGENT_CONFIGS, type AgentLog } from '../data/seedData';

interface AgentConsoleProps {
  agentStatuses: Record<string, 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED'>;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({ agentStatuses }) => {
  const [logs, setLogs] = useState<AgentLog[]>(db.getAgentLogs());
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setLogs(db.getAgentLogs());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getStatusBadge = (status: 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED') => {
    switch (status) {
      case 'ANALYZING':
        return <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] animate-pulse">ANALYZING</span>;
      case 'DECIDING':
        return <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px] animate-bounce">DECIDING</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px]">COMPLETED</span>;
      default:
        return <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[10px]">IDLE</span>;
    }
  };

  const getLevelColor = (level: AgentLog['level']) => {
    switch (level) {
      case 'WARNING': return 'text-orange-400 border-orange-500/20 bg-orange-500/5';
      case 'DECISION': return 'text-purple-400 border-purple-500/20 bg-purple-500/5';
      case 'ERROR': return 'text-red-400 border-red-500/20 bg-red-500/5';
      default: return 'text-slate-300 border-slate-700/50 bg-slate-800/10';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedAgent && log.agentName !== selectedAgent) return false;
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Left panel - Agent Directories & Status */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/60 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold tracking-tight text-white">Agent Directory</h2>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => setSelectedAgent(null)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              selectedAgent === null
                ? 'bg-indigo-600/15 border-indigo-500/30 text-white'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            All Swarm Agents
          </button>
          
          {AGENT_CONFIGS.map(agent => {
            const status = agentStatuses[agent.name] || 'IDLE';
            const isSelected = selectedAgent === agent.name;
            return (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(agent.name)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-150 ${
                  isSelected 
                    ? 'bg-slate-800 border-slate-700 text-white shadow-inner' 
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-white" style={{ borderLeft: `2.5px solid ${agent.avatarColor}`, paddingLeft: '6px' }}>
                    {agent.name}
                  </span>
                  {getStatusBadge(status)}
                </div>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{agent.goal}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel - Stream Logs */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-white">Swarm Logic Console</h2>
              <p className="text-xs text-slate-500">Autonomous workflow logs (LangGraph-equivalent trace)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warnings</option>
              <option value="DECISION">Decisions</option>
              <option value="ERROR">Errors</option>
            </select>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-3 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
              <Terminal className="w-8 h-8" />
              <span>Console quiet. Trigger a disaster scenario to boot up the agent swarm.</span>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className={`p-3.5 rounded-lg border transition-all duration-150 flex items-start gap-3 ${getLevelColor(log.level)}`}
              >
                <div className="flex-none bg-slate-900/60 p-1.5 rounded border border-slate-800 text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">{log.agentName}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">{log.actionType}</span>
                    <span className="text-[10px] font-bold tracking-wider">{log.level}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">{log.message}</p>
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
