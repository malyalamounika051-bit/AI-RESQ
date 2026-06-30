import React, { useState, useEffect } from 'react';
import { Database, Settings, DatabaseZap, Plus, FileDown } from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Disaster, Shelter, Hospital, Volunteer, Resource } from '../data/seedData';

export const AdminDashboard: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>(db.getDisasters());
  const [shelters, setShelters] = useState<Shelter[]>(db.getShelters());
  const [hospitals, setHospitals] = useState<Hospital[]>(db.getHospitals());
  const [volunteers, setVolunteers] = useState<Volunteer[]>(db.getVolunteers());
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  
  // Settings & Actions
  const [autoApprove, setAutoApprove] = useState(true);
  const [debugLevel, setDebugLevel] = useState<'DEBUG' | 'INFO'>('INFO');
  const [success, setSuccess] = useState(false);

  // New Shelter Form
  const [newShelterName, setNewShelterName] = useState('');
  const [newShelterCapacity, setNewShelterCapacity] = useState(500);
  const [newShelterLat, setNewShelterLat] = useState(26.15);
  const [newShelterLng, setNewShelterLng] = useState(86.85);
  const [shelterSuccess, setShelterSuccess] = useState(false);

  // Resource Update Selection
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [updateQty, setUpdateQty] = useState(1000);
  const [resourceSuccess, setResourceSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDisasters(db.getDisasters());
      setShelters(db.getShelters());
      setHospitals(db.getHospitals());
      setVolunteers(db.getVolunteers());
      setResources(db.getResources());
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

  const handleAddShelter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShelterName) return;

    // Simulate adding a shelter to the mock state
    const newShelter: Shelter = {
      id: `sh-${Date.now()}`,
      name: newShelterName,
      latitude: newShelterLat,
      longitude: newShelterLng,
      capacity: newShelterCapacity,
      occupancy: 0,
      foodStockDays: 5,
      waterStockDays: 5,
      powerBackup: true,
      medicalFacility: false,
      status: 'OPERATIONAL'
    };

    // Push into mock state array directly for visual update
    db.getShelters().unshift(newShelter);
    setNewShelterName('');
    setShelterSuccess(true);
    setTimeout(() => setShelterSuccess(false), 2000);
  };

  const handleUpdateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId) return;
    const res = resources.find(r => r.id === selectedResourceId);
    if (res) {
      res.totalQuantity += updateQty;
      res.availableQuantity += updateQty;
      setResourceSuccess(true);
      setTimeout(() => setResourceSuccess(false), 2000);
    }
  };

  const handleExportReport = () => {
    const reportData = `AI Disaster Coordination Platform - Situation Report\nReported: ${new Date().toISOString()}\nActive Disasters: ${disasters.length}\nActive Shelters: ${shelters.length}\nHospitals Operational: ${hospitals.length}\nVolunteers Enlisted: ${volunteers.length}`;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SITREP_${Date.now()}.txt`;
    link.click();
  };

  const handleSeedDatabase = () => {
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white font-mono">System Admin Control Center</h2>
          <p className="text-slate-400 text-xs">Configure autonomous agent thresholds, provision shelters, adjust warehouse logs, and export status bulletins.</p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 border border-indigo-700 cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          Export SITREP Report
        </button>
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
              <label className="text-slate-400">Auto-Approve AI Recommendations:</label>
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all duration-150 cursor-pointer"
            >
              Commit Settings
            </button>

            {success && (
              <p className="text-emerald-400 text-xs mt-2">Parameters saved successfully.</p>
            )}
          </form>
        </div>

        {/* Provision Shelters */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            Provision New Shelter
          </h3>
          <form onSubmit={handleAddShelter} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Shelter Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. KV School Hall C"
                value={newShelterName}
                onChange={e => setNewShelterName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Capacity:</label>
                <input
                  type="number"
                  value={newShelterCapacity}
                  onChange={e => setNewShelterCapacity(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none text-[11px]"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Latitude:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newShelterLat}
                  onChange={e => setNewShelterLat(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none text-[11px]"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Longitude:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newShelterLng}
                  onChange={e => setNewShelterLng(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all duration-150 cursor-pointer"
            >
              Add Shelter
            </button>

            {shelterSuccess && (
              <p className="text-emerald-400 text-xs mt-2">New Shelter registered to database.</p>
            )}
          </form>
        </div>

        {/* Update Resource Stock */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Update Inventory Stock
          </h3>
          <form onSubmit={handleUpdateResource} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Select Item:</label>
              <select
                value={selectedResourceId}
                onChange={e => setSelectedResourceId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="">-- Select Resource --</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.availableQuantity} available)</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-slate-400 mb-1">Quantity to Add:</label>
              <input
                type="number"
                value={updateQty}
                onChange={e => setUpdateQty(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-all duration-150 cursor-pointer"
            >
              Top Up Inventory
            </button>

            {resourceSuccess && (
              <p className="text-emerald-400 text-xs mt-2">Warehouse database updated.</p>
            )}
          </form>
        </div>

      </div>

      {/* Database Inspectors */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
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
            className="bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white px-4 py-2.5 rounded-lg border border-slate-700 transition-all duration-150 cursor-pointer"
          >
            Seed Assets
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
