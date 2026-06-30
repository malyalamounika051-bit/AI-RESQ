import React, { useState } from 'react';
import { 
  Bell, 
  RefreshCw, 
  Activity, 
  MapPin,
  Flame,
  CloudLightning
} from 'lucide-react';
import { db } from '../data/mockDatabase';
import { executeSimulation } from '../data/agentSimulators';

interface TopNavProps {
  onSimulationStarted: () => void;
  onSimulationFinished: () => void;
  setAgentStatuses: React.Dispatch<React.SetStateAction<Record<string, 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED'>>>;
}

export const TopNav: React.FC<TopNavProps> = ({
  onSimulationStarted,
  onSimulationFinished,
  setAgentStatuses
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(db.getAlerts());

  const handleSimulateDisaster = async (type: 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'WILDFIRE') => {
    if (isSimulating) return;
    setIsSimulating(true);
    onSimulationStarted();

    // 1. Create a simulated disaster in the db
    const titleMap = {
      FLOOD: 'Ganges Inundation Zone C',
      CYCLONE: 'Cyclone Yaas Category 3 landfall',
      EARTHQUAKE: 'Bhuj Fault line shockwaves',
      WILDFIRE: 'Nilgiri biosphere hotspot fire'
    };

    const disaster = db.addDisaster({
      type,
      title: titleMap[type],
      description: `Autonomous Multi-Agent triggered simulation for ${type}. Evaluating vulnerability index.`,
      severity: 'HIGH',
      latitude: type === 'FLOOD' ? 26.20 : type === 'CYCLONE' ? 20.85 : type === 'EARTHQUAKE' ? 23.25 : 11.45,
      longitude: type === 'FLOOD' ? 86.85 : type === 'CYCLONE' ? 86.95 : type === 'EARTHQUAKE' ? 69.66 : 76.62,
      status: 'ACTIVE',
      affectedPopulation: type === 'FLOOD' ? 60000 : type === 'CYCLONE' ? 120000 : type === 'EARTHQUAKE' ? 15000 : 4000
    });

    // 2. Execute Multi-Agent crew
    await executeSimulation(disaster.id, 
      (agentName, status) => {
        setAgentStatuses(prev => ({
          ...prev,
          [agentName]: status
        }));
      }
    );

    setIsSimulating(false);
    onSimulationFinished();
    setNotifications(db.getAlerts());
  };

  const handleClearLogs = () => {
    db.clearLogs();
  };

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-slate-300 relative z-30">
      {/* TopNav Left - Platform Telemetry */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>AUTONOMOUS OPS NETWORK:</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px]">HEALTHY</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>Active Command Sector: Patna & Western Ghats</span>
        </div>
      </div>

      {/* TopNav Right - Action buttons */}
      <div className="flex items-center gap-4">
        {/* Simulation Triggers */}
        <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-lg p-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">Test Scenario:</span>
          <button
            onClick={() => handleSimulateDisaster('FLOOD')}
            disabled={isSimulating}
            className="flex items-center gap-1 text-[11px] font-medium bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-2.5 py-1.5 rounded transition-all duration-150 mr-1 disabled:opacity-50"
          >
            <CloudLightning className="w-3 h-3" />
            Flood
          </button>
          <button
            onClick={() => handleSimulateDisaster('WILDFIRE')}
            disabled={isSimulating}
            className="flex items-center gap-1 text-[11px] font-medium bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white px-2.5 py-1.5 rounded transition-all duration-150 mr-1 disabled:opacity-50"
          >
            <Flame className="w-3 h-3" />
            Fire
          </button>
          <button
            onClick={() => handleSimulateDisaster('CYCLONE')}
            disabled={isSimulating}
            className="flex items-center gap-1 text-[11px] font-medium bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-2.5 py-1.5 rounded transition-all duration-150 disabled:opacity-50"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            Cyclone
          </button>
        </div>

        {/* Clear Logs Button */}
        <button
          onClick={handleClearLogs}
          className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white px-4 py-2 rounded-lg transition-all duration-150 border border-slate-700"
        >
          Clear Logs
        </button>

        {/* Alerts Center Dropdown Indicator */}
        <div className="relative">
          <button className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700 relative">
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
export default TopNav;
