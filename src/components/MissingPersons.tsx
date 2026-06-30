import React, { useState, useEffect } from 'react';
import { db } from '../data/mockDatabase';
import type { MissingPerson } from '../data/seedData';
import { Search, UserX, PlusCircle, CheckCircle, Eye } from 'lucide-react';

export const MissingPersons: React.FC = () => {
  const [persons, setPersons] = useState<MissingPerson[]>(db.getMissingPersons());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setPersons(db.getMissingPersons());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !phone) return;

    db.addMissingPerson({
      fullName: name,
      age,
      gender,
      lastSeenLocation: location,
      lastSeenTime: new Date().toISOString(),
      description,
      contactPhone: phone,
      photoPlaceholder: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    });

    setName('');
    setAge(30);
    setGender('Male');
    setLocation('');
    setDescription('');
    setPhone('');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
    }, 2000);
  };

  const handleUpdateStatus = (id: string, status: MissingPerson['status']) => {
    db.updateMissingPersonStatus(id, status);
  };

  const filteredPersons = persons.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          p.lastSeenLocation.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: MissingPerson['status']) => {
    switch (status) {
      case 'FOUND': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'UNDER_INVESTIGATION': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      default: return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] p-8 bg-slate-950 text-slate-100 overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserX className="w-6 h-6 text-red-500 animate-pulse" />
            Missing Persons Locator Portal
          </h2>
          <p className="text-slate-400 text-xs">Help authorities and emergency services report and locate missing individuals.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg border border-indigo-700 transition-all duration-150 flex items-center gap-2 text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          {showForm ? 'View Directory' : 'Report Missing Person'}
        </button>
      </div>

      {showForm ? (
        /* Report Form */
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">File Incident Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name:</label>
              <input
                type="text"
                required
                placeholder="Rohan Malhotra"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Age:</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Gender:</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Last Seen Location:</label>
              <input
                type="text"
                required
                placeholder="e.g. Near Kosi bridge sector 3"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Description / Clothing Details:</label>
              <textarea
                rows={3}
                placeholder="Details like black jacket, blue cap, birthmarks, medical conditions, etc."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Phone Number:</label>
              <input
                type="text"
                required
                placeholder="+91-XXXXX-XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg border border-red-700 transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              Submit Search Bulletin
            </button>

            {success && (
              <div className="text-emerald-400 text-xs flex items-center gap-1.5 mt-2 justify-center">
                <CheckCircle className="w-4 h-4" />
                Bulletin submitted. Swarm AI Compliance Agent routing...
              </div>
            )}
          </form>
        </div>
      ) : (
        /* Directory list with search */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            {/* Search */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full md:max-w-md">
              <Search className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
              />
            </div>
            
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-lg text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="MISSING">Missing</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="FOUND">Found</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersons.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500 text-xs">
                No matching reports found in database.
              </div>
            ) : (
              filteredPersons.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md hover:border-slate-700 transition-all duration-150">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs font-mono">
                      {p.photoPlaceholder}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.fullName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{p.age} yrs • {p.gender}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <p className="leading-relaxed"><strong className="text-slate-500">Last Seen Location:</strong> {p.lastSeenLocation}</p>
                    <p><strong className="text-slate-500">Last Seen:</strong> {new Date(p.lastSeenTime).toLocaleTimeString()} ({new Date(p.lastSeenTime).toLocaleDateString()})</p>
                    {p.description && <p className="leading-relaxed"><strong className="text-slate-500">Details:</strong> {p.description}</p>}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${getStatusColor(p.status)}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                    
                    {/* Status updater for simulation/officer roles */}
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <select
                        value={p.status}
                        onChange={e => handleUpdateStatus(p.id, e.target.value as any)}
                        className="bg-slate-800 border border-slate-700 text-[10px] px-2 py-1 rounded text-slate-300 focus:outline-none"
                      >
                        <option value="MISSING">Missing</option>
                        <option value="UNDER_INVESTIGATION">Investigating</option>
                        <option value="FOUND">Found</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissingPersons;
