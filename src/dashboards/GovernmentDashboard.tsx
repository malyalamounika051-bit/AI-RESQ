import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle,
  Home,
  HeartPulse,
  Navigation,
  AlertTriangle,
  Compass,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Disaster, ResourceAllocation, RescueTeam, Alert, Shelter, Hospital, Resource } from '../data/seedData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const GovernmentDashboard: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>(db.getDisasters());
  const [allocations, setAllocations] = useState<ResourceAllocation[]>(db.getAllocations());
  const [teams, setTeams] = useState<RescueTeam[]>(db.getRescueTeams());
  const [alerts, setAlerts] = useState<Alert[]>(db.getAlerts());
  const [shelters, setShelters] = useState<Shelter[]>(db.getShelters());
  const [hospitals, setHospitals] = useState<Hospital[]>(db.getHospitals());
  const [resources, setResources] = useState<Resource[]>(db.getResources());

  const [activeSubTab, setActiveSubTab] = useState<'home' | 'monitoring' | 'shelters' | 'resources' | 'medical' | 'rescue'>('home');

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDisasters(db.getDisasters());
      setAllocations(db.getAllocations());
      setTeams(db.getRescueTeams());
      setAlerts(db.getAlerts());
      setShelters(db.getShelters());
      setHospitals(db.getHospitals());
      setResources(db.getResources());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const activeDisasters = disasters.filter(d => d.status === 'ACTIVE');
  const primaryDisaster = activeDisasters[0] || disasters[0];

  // Helper stats
  const totalBedsAvailable = shelters.reduce((acc, s) => acc + (s.capacity - s.occupancy), 0);
  const activeRescueTeamsCount = teams.filter(t => t.status === 'DEPLOYED').length;
  const ambulancesAvailableCount = hospitals.reduce((acc, h) => acc + h.ambulancesAvailable, 0);

  // Natural Language Disaster Summary (dynamic depending on primary disaster)
  const getDisasterSummary = () => {
    if (!primaryDisaster) return "No active disaster sectors monitored. System standing by.";
    const isEarthquake = primaryDisaster.type === 'EARTHQUAKE';
    if (isEarthquake) {
      return `Earthquake tremor of magnitude 6.2 confirmed at ${primaryDisaster.title}. Estimated impact covers 3 towns within 1 hour. Recommended action: Open 2 shelters, allocate 800 tents and blankets, dispatch 15 trauma units, and clear landslide routes.`;
    }
    return `Flood likely to affect 12 villages within 6 hours. Severity classified as CRITICAL. Recommended action: Allocate 6 rescue speedboats, open 4 shelters, dispatch 10 ambulances, and distribute 2,500 food packets immediately.`;
  };

  const handleResolveDisaster = (id: string) => {
    db.updateDisasterStatus(id, 'RESOLVED');
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-6">
      {/* Sub Tabs selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'home', label: 'Home Dashboard' },
          { id: 'monitoring', label: 'Disaster Monitoring' },
          { id: 'shelters', label: 'Shelter Management' },
          { id: 'resources', label: 'Resource Dashboard' },
          { id: 'medical', label: 'Medical Dashboard' },
          { id: 'rescue', label: 'Rescue Dashboard' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`text-xs px-4 py-2 rounded-lg border transition-all duration-150 font-bold ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Summary Panel */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-black tracking-wider uppercase">
            AI Summary Summary (Natural Language)
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold italic">
            "{getDisasterSummary()}"
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
          <div className="text-xs">
            <p className="font-bold text-white uppercase text-[10px]">Active Warnings</p>
            <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{alerts[0]?.message || 'Monitoring active'}</p>
          </div>
        </div>
      </div>

      {/* TAB CONTENT: Home Summary */}
      {activeSubTab === 'home' && (
        <div className="space-y-6">
          {/* Severity Meter & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Severity Card */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disaster Status</p>
                  <h4 className="text-sm font-black text-white mt-1">{primaryDisaster?.title || 'Standing By'}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  primaryDisaster?.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {primaryDisaster?.severity || 'LOW'}
                </span>
              </div>
              {/* Severity Gauge */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Risk Severity Level</span>
                  <span>{primaryDisaster?.severity === 'CRITICAL' ? '92%' : '65%'}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${
                    primaryDisaster?.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'
                  }`} style={{ width: primaryDisaster?.severity === 'CRITICAL' ? '92%' : '65%' }} />
                </div>
              </div>
            </div>

            {/* General info cards */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Shelter Beds</p>
                <h3 className="text-xl font-black text-white mt-1">{totalBedsAvailable} Available</h3>
                <p className="text-[10px] text-slate-500 mt-1">Across {shelters.length} safe zones</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                <Home className="w-5 h-5 text-blue-500" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rescue Teams</p>
                <h3 className="text-xl font-black text-white mt-1">{activeRescueTeamsCount} Deployed</h3>
                <p className="text-[10px] text-slate-500 mt-1">NDRF / SDRF active battalions</p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <Compass className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ambulance Assets</p>
                <h3 className="text-xl font-black text-white mt-1">{ambulancesAvailableCount} Available</h3>
                <p className="text-[10px] text-slate-500 mt-1">In 2 regional medical centers</p>
              </div>
              <div className="bg-pink-500/10 p-3 rounded-lg border border-pink-500/20">
                <HeartPulse className="w-5 h-5 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Active incidents command table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Command Control incidents list</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <th className="p-4">Disaster Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Population Affected</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {disasters.map(d => (
                    <tr key={d.id} className="hover:bg-slate-850/50">
                      <td className="p-4 flex items-center gap-2 font-bold text-white">
                        <span className={`w-2 h-2 rounded-full ${
                          d.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'
                        }`} />
                        {d.type}
                      </td>
                      <td className="p-4 text-slate-300">{d.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>
                          {d.severity}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{d.affectedPopulation.toLocaleString()}</td>
                      <td className="p-4 text-slate-400 font-bold">{d.status}</td>
                      <td className="p-4">
                        {d.status === 'ACTIVE' ? (
                          <button 
                            onClick={() => handleResolveDisaster(d.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg border border-indigo-700 transition-all duration-150"
                          >
                            Mark Containment
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Disaster Monitoring */}
      {activeSubTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                Live Sensor Telemetry
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Regional Temperature:</span>
                  <span className="font-bold text-white">28.4°C (Normal)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Humidity Coefficient:</span>
                  <span className="font-bold text-white">88% (High)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Fault Strain Accumulation:</span>
                  <span className="font-bold text-red-400">0.04m (Critical)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-400" />
                Rainfall & Runoff Gauge
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Accumulated (24h):</span>
                  <span className="font-bold text-white">340mm (High runoff)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">River Basin level:</span>
                  <span className="font-bold text-orange-400">Danger mark +2.4m</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Saturability index:</span>
                  <span className="font-bold text-white">92%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Disaster Severity Index
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Triangulation sources:</span>
                  <span className="font-bold text-white">5 Satellites + 12 IoT</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Workflow Trigger state:</span>
                  <span className="font-bold text-emerald-400">Active Autopilot</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500">Misinformation check:</span>
                  <span className="font-bold text-white">Clear compliance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Shelter Management */}
      {activeSubTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map(shelter => (
            <div key={shelter.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{shelter.name}</h4>
                <div className="flex justify-between text-xs text-slate-400 pt-2">
                  <span>Location:</span>
                  <span className="font-mono text-slate-200">26.15°N, 86.85°E</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Capacity:</span>
                  <span className="font-semibold text-slate-200">{shelter.capacity} Beds</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Beds Available:</span>
                  <span className="font-bold text-emerald-400">{shelter.capacity - shelter.occupancy} Free</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Food Inventory:</span>
                  <span className="font-bold text-orange-400">{shelter.foodStockDays} days available</span>
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => alert(`Simulating GPS navigation routing directions to coordinates [${shelter.latitude}, ${shelter.longitude}].`)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-[10px] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Navigation Map Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Resource Dashboard */}
      {activeSubTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stock metrics per category</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resources}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                  <Bar dataKey="availableQuantity" name="Available Inventory" fill="#10b981" />
                  <Bar dataKey="totalQuantity" name="Total Capacity" fill="#334155" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Relief Packets dispatched log</h4>
            <div className="space-y-3 overflow-y-auto max-h-56 pr-2">
              {allocations.map(alloc => (
                <div key={alloc.id} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{alloc.resourceName}</p>
                    <p className="text-[10px] text-slate-500">{new Date(alloc.allocatedAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-emerald-400 font-bold">-{alloc.quantityAllocated}</p>
                    <span className="text-[9px] uppercase font-black bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {alloc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Medical Dashboard */}
      {activeSubTab === 'medical' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hospitals.map(hosp => (
            <div key={hosp.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">{hosp.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  hosp.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {hosp.status}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between border-b border-slate-850 pb-1">
                  <span className="text-slate-500">ICU Beds Available:</span>
                  <span className="font-bold text-white font-mono">{hosp.icuBedsAvailable} / {hosp.icuBedsTotal}</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1">
                  <span className="text-slate-500">General Beds Available:</span>
                  <span className="font-bold text-white font-mono">{hosp.generalBedsAvailable} / {hosp.generalBedsTotal}</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1">
                  <span className="text-slate-500">Ambulances Dispatched:</span>
                  <span className="font-bold text-white font-mono">{hosp.ambulancesTotal - hosp.ambulancesAvailable} dispatched</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">On-Duty Medical Staff:</span>
                  <span className="font-bold text-white">{hosp.doctorsOnDuty} Doctors</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Rescue Dashboard */}
      {activeSubTab === 'rescue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">{team.name}</h4>
                  <p className="text-[10px] text-slate-500">{team.agency}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  team.status === 'DEPLOYED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {team.status}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between border-b border-slate-850 pb-1">
                  <span className="text-slate-500">Operational Type:</span>
                  <span className="font-bold text-indigo-400">{team.type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1">
                  <span className="text-slate-500">Active Personnel:</span>
                  <span className="font-bold text-white font-mono">{team.membersCount} Responders</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1">
                  <span className="text-slate-500">Emergency Contacts:</span>
                  <span className="font-bold text-slate-400 font-mono">{team.contactPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route ETA index:</span>
                  <span className="font-bold text-white font-mono">22 mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GovernmentDashboard;
