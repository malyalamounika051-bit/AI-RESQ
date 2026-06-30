import React, { useState, useEffect } from 'react';
import { Crosshair, HeartPulse, RefreshCw } from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Hospital } from '../data/seedData';

export const HospitalDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>(db.getHospitals());
  const [selectedHospId, setSelectedHospId] = useState<string>('');
  
  const [icuBeds, setIcuBeds] = useState(10);
  const [genBeds, setGenBeds] = useState(50);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      const currentHospitals = db.getHospitals();
      setHospitals(currentHospitals);
      if (currentHospitals.length > 0 && !selectedHospId) {
        setSelectedHospId(currentHospitals[0].id);
        setIcuBeds(currentHospitals[0].icuBedsAvailable);
        setGenBeds(currentHospitals[0].generalBedsAvailable);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [selectedHospId]);

  const handleUpdateBeds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospId) return;

    db.updateHospitalBeds(selectedHospId, icuBeds, genBeds);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleHospitalChange = (id: string) => {
    setSelectedHospId(id);
    const target = hospitals.find(h => h.id === id);
    if (target) {
      setIcuBeds(target.icuBedsAvailable);
      setGenBeds(target.generalBedsAvailable);
    }
  };

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Healthcare System Dashboard</h2>
        <p className="text-slate-400 text-xs">Monitor ICU bed occupancy, dispatch medical responders, and request emergency blood stock transfers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Triage & Update Bed Status Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-pink-500" />
            Update Hospital Telemetry
          </h3>
          <form onSubmit={handleUpdateBeds} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Select Facility:</label>
              <select
                value={selectedHospId}
                onChange={e => handleHospitalChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600 font-semibold"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">ICU Beds Available:</label>
                <input
                  type="number"
                  value={icuBeds}
                  onChange={e => setIcuBeds(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-slate-400 mb-1">Gen Beds Available:</label>
                <input
                  type="number"
                  value={genBeds}
                  onChange={e => setGenBeds(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 rounded-lg border border-pink-700 transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Update Telemetry
            </button>

            {success && (
              <p className="text-emerald-400 text-xs mt-2">Facility logs updated successfully.</p>
            )}
          </form>
        </div>

        {/* Hospital statistics list */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-indigo-400" />
            Healthcare Facility Status
          </h3>
          <div className="space-y-4">
            {hospitals.map(h => (
              <div key={h.id} className="bg-slate-950 p-4.5 rounded-lg border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">{h.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    h.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500">ICU Bed Occupancy</p>
                    <p className="font-bold text-white font-mono mt-0.5">
                      {h.icuBedsTotal - h.icuBedsAvailable} / {h.icuBedsTotal}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">General Bed Occupancy</p>
                    <p className="font-bold text-white font-mono mt-0.5">
                      {h.generalBedsTotal - h.generalBedsAvailable} / {h.generalBedsTotal}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Ambulances</p>
                    <p className="font-bold text-slate-300 mt-0.5">
                      {h.ambulancesAvailable} Free / {h.ambulancesTotal}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Blood Bank</p>
                    <p className={`font-black mt-0.5 ${
                      h.bloodBankStatus === 'CRITICAL' ? 'text-red-500' : h.bloodBankStatus === 'LOW' ? 'text-orange-500' : 'text-emerald-400'
                    }`}>
                      {h.bloodBankStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default HospitalDashboard;
