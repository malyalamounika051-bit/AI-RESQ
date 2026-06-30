import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Truck, 
  TrendingUp, 
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Disaster, ResourceAllocation, RescueTeam, Alert } from '../data/seedData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const GovernmentDashboard: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>(db.getDisasters());
  const [allocations, setAllocations] = useState<ResourceAllocation[]>(db.getAllocations());
  const [teams, setTeams] = useState<RescueTeam[]>(db.getRescueTeams());
  const [alerts, setAlerts] = useState<Alert[]>(db.getAlerts());

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDisasters(db.getDisasters());
      setAllocations(db.getAllocations());
      setTeams(db.getRescueTeams());
      setAlerts(db.getAlerts());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Compute stats
  const activeDisasters = disasters.filter(d => d.status === 'ACTIVE').length;
  const totalAffected = disasters.reduce((acc, curr) => acc + curr.affectedPopulation, 0);
  const totalDeployedTeams = teams.filter(t => t.status === 'DEPLOYED').length;

  // Chart data
  const chartsData = disasters.map(d => ({
    name: d.type,
    population: d.affectedPopulation,
  }));

  const resourceChartData = allocations.map(a => ({
    name: a.resourceName.substring(0, 10),
    quantity: a.quantityAllocated
  }));

  const handleResolveDisaster = (id: string) => {
    db.updateDisasterStatus(id, 'RESOLVED');
  };

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Government Command Center</h2>
          <p className="text-slate-400 text-xs">Real-Time Disaster Mitigation & Inter-Departmental Logistics</p>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-lg flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
          <div className="text-xs">
            <p className="font-bold text-white uppercase">Critical Alerts Broadcast</p>
            <p className="text-[10px] text-slate-400">{alerts[0]?.message || 'No alerts broadcasted'}</p>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Disasters</p>
            <h3 className="text-2xl font-black text-white">{activeDisasters}</h3>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Estimated Inundation</p>
            <h3 className="text-2xl font-black text-white">{totalAffected.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">Cap</span></h3>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deployed Teams</p>
            <h3 className="text-2xl font-black text-white">{totalDeployedTeams} / {teams.length}</h3>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <Truck className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active SITREPs</p>
            <h3 className="text-2xl font-black text-white">SITREP-03</h3>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Affected Population by Sector
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Bar dataKey="population" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Resource Allocations
          </h3>
          <div className="h-64">
            {resourceChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">No resources dispatched yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                  <Bar dataKey="quantity" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Disasters Management list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Incident Command Desk</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <th className="p-4">Disaster Type</th>
                <th className="p-4">Location Sector</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Est. Population</th>
                <th className="p-4">Status</th>
                <th className="p-4">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {disasters.map(d => (
                <tr key={d.id} className="hover:bg-slate-800/30">
                  <td className="p-4 flex items-center gap-2 font-bold text-white">
                    <span className={`w-2 h-2 rounded-full ${
                      d.severity === 'CRITICAL' ? 'bg-red-500' : d.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    {d.type}
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{d.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {d.severity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{d.affectedPopulation.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {d.status}
                    </span>
                  </td>
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

      {/* NEW: SOS Dispatch Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 animate-pulse flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Live Citizen SOS Distress Feed
            </h3>
            <p className="text-[10px] text-slate-500">Urgent distress broadcasts mapped by coordinates.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <th className="p-4">Urgency</th>
                <th className="p-4">Reporter Name</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Distress Message</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {db.getSOSSignals().map(sos => (
                <tr key={sos.id} className="hover:bg-slate-800/30">
                  <td className="p-4">
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                      {sos.urgency}
                    </span>
                  </td>
                  <td className="p-4 text-white font-bold">{sos.citizenName}</td>
                  <td className="p-4 text-slate-400 font-mono">{sos.latitude.toFixed(4)}°N, {sos.longitude.toFixed(4)}°E</td>
                  <td className="p-4 text-slate-300 leading-normal max-w-sm truncate">{sos.message}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sos.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                      sos.status === 'DISPATCHED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {sos.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {sos.status === 'PENDING' ? (
                      <button
                        onClick={() => db.updateSOSStatus(sos.id, 'DISPATCHED')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1 rounded text-[11px] border border-indigo-700"
                      >
                        Dispatch Team
                      </button>
                    ) : sos.status === 'DISPATCHED' ? (
                      <button
                        onClick={() => db.updateSOSStatus(sos.id, 'RESOLVED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded text-[11px] border border-emerald-700"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-slate-500">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default GovernmentDashboard;
