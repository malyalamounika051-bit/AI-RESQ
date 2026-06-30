import React, { useState, useEffect } from 'react';
import { Database, Settings, DatabaseZap } from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Disaster, Shelter, Hospital, Volunteer } from '../data/seedData';

export const AdminDashboard: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>(db.getDisasters());
  const [shelters, setShelters] = useState<Shelter[]>(db.getShelters());
  const [hospitals, setHospitals] = useState<Hospital[]>(db.getHospitals());
  const [volunteers, setVolunteers] = useState<Volunteer[]>(db.getVolunteers());
  
  const [autoApprove, setAutoApprove] = useState(true);
  const [debugLevel, setDebugLevel] = useState<'DEBUG' | 'INFO'>('INFO');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDisasters(db.getDisasters());
      setShelters(db.getShelters());
      setHospitals(db.getHospitals());
      setVolunteers(db.getVolunteers());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleSeedDatabase = () => {
    // Add additional dummy assets
    db.addVolunteer({
      fullName: 'Vikram Batra',
      skills: ['Pararescue', 'Radio Communication'],
      contact: '+91-99888-77665'
    });
    alert('Simulated volunteer asset seeded successfully.');
  };

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-mono">System Admin Console</h2>
        <p className="text-slate-400 text-xs">PostgreSQL database rows inspector, system flags, and simulation overrides.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            Agent Control Parameters
          </h3>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-400">Auto-Approve Citizen SOS Signals:</label>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={e => setAutoApprove(e.target.checked)}
                className="w-4 h-4 bg-slate-800 border-slate-700 rounded focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Trace Level:</label>
              <select
                value={debugLevel}
                onChange={e => setDebugLevel(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="INFO">Info & Decisions (Recommended)</option>
                <option value="DEBUG">Verbose Trace (Full LangGraph dumps)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all duration-150"
            >
              Commit Settings
            </button>

            {success && (
              <p className="text-emerald-400 text-xs mt-2">Parameters saved successfully.</p>
            )}
          </form>
        </div>

        {/* Database Inspectors */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            PostgreSQL Relations Row Counts
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-500">disasters</p>
              <p className="text-lg font-bold text-white mt-1 font-mono">{disasters.length} rows</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-500">shelters</p>
              <p className="text-lg font-bold text-white mt-1 font-mono">{shelters.length} rows</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-500">hospitals</p>
              <p className="text-lg font-bold text-white mt-1 font-mono">{hospitals.length} rows</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-500">volunteers</p>
              <p className="text-lg font-bold text-white mt-1 font-mono">{volunteers.length} rows</p>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 flex justify-between items-center gap-4">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <DatabaseZap className="w-4 h-4 text-yellow-500" />
                Seed Testing Assets
              </h4>
              <p className="text-slate-500 text-[10px] leading-relaxed mt-1">Inserts mock NDRF/SDRF teams and ambulance inventory data into database cache.</p>
            </div>
            <button
              onClick={handleSeedDatabase}
              className="bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white px-4 py-2.5 rounded-lg border border-slate-700 transition-all duration-150"
            >
              Seed Assets
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;
