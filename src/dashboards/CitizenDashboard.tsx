import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Home, 
  HeartHandshake,
  Send,
  CheckCircle
} from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Disaster, Shelter, Alert } from '../data/seedData';

export const CitizenDashboard: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>(db.getShelters());
  const [alerts, setAlerts] = useState<Alert[]>(db.getAlerts());
  
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<Disaster['type']>('FLOOD');
  const [reportDesc, setReportDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setShelters(db.getShelters());
      setAlerts(db.getAlerts());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;

    db.addDisaster({
      type: reportType,
      title: reportTitle,
      description: reportDesc,
      severity: 'MEDIUM',
      latitude: 26.15 + (Math.random() - 0.5) * 0.1,
      longitude: 86.85 + (Math.random() - 0.5) * 0.1,
      status: 'ACTIVE',
      affectedPopulation: 200
    });

    setReportTitle('');
    setReportDesc('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleTriggerSOS = () => {
    db.addSOSSignal(
      'Stranded Citizen (SOS)',
      26.155 + (Math.random() - 0.5) * 0.02,
      86.845 + (Math.random() - 0.5) * 0.02,
      'URGENT: Flash flooding surrounding residence. Requesting immediate aerial evacuation rescue.',
      'CRITICAL'
    );
    alert('SOS Signal transmitted. The AI RESQ Agent Crew has received your geo-coordinates and dispatched the closest rescue unit.');
  };

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Citizen Safety Portal</h2>
          <p className="text-slate-400 text-xs">Access emergency shelter coordinates, report local hazards, and alert authorities.</p>
        </div>

        {/* Dynamic SOS Trigger */}
        <button
          onClick={handleTriggerSOS}
          className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-xl border border-red-700 hover:scale-105 transition-all duration-150 shadow-lg flex items-center gap-2 text-sm uppercase tracking-wider animate-pulse"
        >
          <PhoneCall className="w-5 h-5 animate-bounce" />
          Broadcast SOS (Emergency)
        </button>
      </div>

      {/* Broadcast warnings */}
      {alerts.length > 0 && (
        <div className="bg-red-600/10 border border-red-500/20 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-red-500 flex-none" />
          <div>
            <h4 className="font-bold text-sm text-red-400">CRITICAL EVACUATION ADVISORY</h4>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">{alerts[0].message}</p>
          </div>
        </div>
      )}

      {/* Body sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Report Hazard Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            Log Local Hazard Report
          </h3>
          <form onSubmit={handleReport} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Issue Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Broken embankment near sector 4"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Hazard Category:</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
                >
                  <option value="FLOOD">Flood Inundation</option>
                  <option value="WILDFIRE">Wildfire / Smoke</option>
                  <option value="CYCLONE">Severe Wind Damage</option>
                  <option value="EARTHQUAKE">Tremor / Structural Fracture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Additional description & details:</label>
              <textarea
                rows={3}
                placeholder="Details of blockages, stranded citizens, water logging depth, etc."
                value={reportDesc}
                onChange={e => setReportDesc(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg border border-indigo-700 transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit to Agent Command
            </button>

            {successMsg && (
              <div className="text-emerald-400 text-xs flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-4 h-4" />
                Report logged successfully. Swarm agents triggered.
              </div>
            )}
          </form>
        </div>

        {/* Shelter Lookup */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-400" />
            Shelter Bed Availability Finder
          </h3>
          <div className="space-y-3">
            {shelters.map(shelter => (
              <div key={shelter.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{shelter.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-1">
                    <span>Capacity: {shelter.capacity} beds</span>
                    <span>• Food stock: {shelter.foodStockDays} days</span>
                    <span>• Medical Support: {shelter.medicalFacility ? 'Available' : 'None'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Available Beds</p>
                    <p className={`text-base font-bold ${
                      shelter.capacity - shelter.occupancy > 50 ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {shelter.capacity - shelter.occupancy}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    shelter.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {shelter.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default CitizenDashboard;
