import React, { useState, useEffect } from 'react';
import { db } from '../data/mockDatabase';
import { executeSimulation } from '../data/agentSimulators';
import type { Disaster } from '../data/seedData';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Download, 
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverviewTabProps {
  setAgentStatuses: React.Dispatch<React.SetStateAction<Record<string, 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED'>>>;
  agentStatuses: Record<string, 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED'>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ setAgentStatuses, agentStatuses }) => {
  const [disasters, setDisasters] = useState<Disaster[]>(db.getDisasters());
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [showSummary, setShowSummary] = useState(false);

  const activeDisasters = disasters.filter(d => d.status === 'ACTIVE');
  const primaryDisaster = activeDisasters[0] || disasters[0];

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDisasters(db.getDisasters());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const agentsList = [
    { name: 'Weather Agent', goal: 'Classify extreme storm gauges & trigger response flow.', summary: 'Triggered flood severity level: HIGH. Impact ETA: 5.2 hours.' },
    { name: 'Shelter Agent', role: 'Compute safe shelters', summary: 'Rerouting 50 evacuees from Balika Vidyalaya to District Stadium.' },
    { name: 'Resource Allocation Agent', role: 'Logistics optimizer', summary: 'Allocating 2,500 food packets, 3,000L water, and 6 rescue boats.' },
    { name: 'Medical Agent', role: 'Triage coordinator', summary: 'Ambulances dispatched. Narayana Medical ICU status monitored.' },
    { name: 'Rescue Agent', role: 'Safe route routing', summary: 'Bypassing active flood rivers. Deployed NDRF Battalion 09.' }
  ];

  const handleRunCoordination = async () => {
    if (isSimulating || !primaryDisaster) return;
    setIsSimulating(true);
    setShowSummary(false);
    setCurrentAgentIndex(-1);

    // Dynamic step-by-step simulator
    for (let i = 0; i < agentsList.length; i++) {
      setCurrentAgentIndex(i);
      setAgentStatuses(prev => ({
        ...prev,
        [agentsList[i].name]: 'ANALYZING'
      }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAgentStatuses(prev => ({
        ...prev,
        [agentsList[i].name]: 'COMPLETED'
      }));
    }

    // Run backend database updates
    await executeSimulation(primaryDisaster.id, (agentName, status) => {
      setAgentStatuses(prev => ({ ...prev, [agentName]: status }));
    });

    setIsSimulating(false);
    setShowSummary(true);
  };

  const handleDownloadSITREP = () => {
    if (!primaryDisaster) return;
    const reportData = `AI RESQ SITUATION REPORT\n=======================\nDisaster Type: ${primaryDisaster.type}\nSeverity: ${primaryDisaster.severity}\nLocation: ${primaryDisaster.title}\nEst. Impact: 45,000 residents\nAI Confidence Score: 98.4%\nResources Allocated: 2,500 food packets, 3,000L water, 6 rescue speedboats\nHospitals Mobilized: Narayana Medical, Sadar District Hospital\nStatus: COMMAND ACTIVE`;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SITREP_${primaryDisaster.type}_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="space-y-8 pb-12 text-slate-100 font-sans">
      {/* 1. Large Disaster Status Banner */}
      {primaryDisaster ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] uppercase font-black text-red-500 tracking-wider">Active Command Status</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">{primaryDisaster.title}</h3>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
              <span>Type: <strong className="text-white font-bold">{primaryDisaster.type}</strong></span>
              <span>Severity: <strong className="text-red-400 font-bold">{primaryDisaster.severity}</strong></span>
              <span>Location: <strong className="text-white">{primaryDisaster.latitude.toFixed(2)}°N, {primaryDisaster.longitude.toFixed(2)}°E</strong></span>
              <span>Est. Impact: <strong className="text-white">45,000 Citizens</strong></span>
              <span>AI Confidence: <strong className="text-indigo-400 font-bold">98.4%</strong></span>
            </div>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
            <div className="text-left md:text-right space-y-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Evacuation Window Remaining</p>
              <div className="flex items-center gap-1.5 font-mono text-xl font-bold text-white">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>05:12:00</span>
              </div>
            </div>
            <button
              onClick={handleRunCoordination}
              disabled={isSimulating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-3.5 rounded-xl border border-indigo-700 hover:scale-105 transition-all duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:scale-100"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Run AI Coordination
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-500 font-mono">
          Monitoring feed standing by. No anomalies detected.
        </div>
      )}

      {/* 2. Visual Agent Timeline Progress */}
      {(isSimulating || currentAgentIndex >= 0) && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
            AI Agent Coordination Stream
          </h4>
          
          <div className="space-y-4">
            {agentsList.map((agent) => {
              const status = agentStatuses[agent.name] || 'IDLE';
              return (
                <div key={agent.name} className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                  status === 'ANALYZING' || status === 'DECIDING' ? 'bg-indigo-600/5 border-indigo-500/30' : 
                  status === 'COMPLETED' ? 'bg-slate-950/40 border-slate-800/80 opacity-70' : 
                  'bg-slate-900/10 border-transparent opacity-30'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'COMPLETED' ? 'bg-emerald-500' : 
                      status === 'ANALYZING' || status === 'DECIDING' ? 'bg-indigo-500 animate-ping' : 
                      'bg-slate-700'
                    }`} />
                    <div>
                      <h5 className="font-bold text-white text-xs">{agent.name}</h5>
                      {status === 'ANALYZING' || status === 'DECIDING' ? (
                        <p className="text-[10px] text-indigo-400 animate-pulse">Thinking / Dispatching...</p>
                      ) : status === 'COMPLETED' ? (
                        <p className="text-[10px] text-slate-400 italic font-semibold">"{agent.summary}"</p>
                      ) : (
                        <p className="text-[10px] text-slate-600">Pending workflow activation.</p>
                      )}
                    </div>
                  </div>

                  {(status === 'ANALYZING' || status === 'DECIDING') && (
                    <div className="w-full sm:w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden flex-none">
                      <div className="bg-indigo-500 h-1.5 rounded-full animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
                    </div>
                  )}

                  {status === 'COMPLETED' && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Success
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Emergency Summary Card */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Disaster Overview Summary
                </h4>
                <p className="text-xs text-slate-500">Autonomous recommendation plan mapped in 5.2 seconds.</p>
              </div>
              <button
                onClick={handleDownloadSITREP}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white px-4 py-2.5 rounded-lg border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download SITREP Report
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Population Affected</p>
                <p className="text-lg font-black text-white mt-1">45,000 citizens</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Resources Deployed</p>
                <p className="text-lg font-black text-white mt-1">2,500 food packets</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Shelters Activated</p>
                <p className="text-lg font-black text-white mt-1">4 operational</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Hospitals On Standby</p>
                <p className="text-lg font-black text-white mt-1">2 centers ready</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 text-xs space-y-2">
              <p className="font-bold text-indigo-400">AI Recommended Next Actions:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Deploy NDRF Battalion 09 Swift Water Rescue squad to coordinate with medical triage units.</li>
                <li>Activate additional 2 relief warehouses in Sector 4 for food inventory storage updates.</li>
                <li>Alert municipal water pump grids to initiate drainage flows bypassed by the Rescue Agent.</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Simple Visual Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Shelter Bed Occupancy', pct: 84, color: 'border-blue-500 text-blue-400' },
          { label: 'Hospital General Capacity', pct: 67, color: 'border-pink-500 text-pink-400' },
          { label: 'Resource Stock Utilization', pct: 32, color: 'border-green-500 text-green-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-xl font-black text-white mt-1">{stat.pct}%</h4>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-mono text-[10px] font-bold">
              {stat.pct}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;
