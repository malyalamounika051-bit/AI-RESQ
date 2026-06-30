import React, { useState, useEffect } from 'react';
import { Users, Heart, UserPlus, CheckCircle } from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Volunteer } from '../data/seedData';

export const VolunteerDashboard: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(db.getVolunteers());
  
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setVolunteers(db.getVolunteers());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !skills) return;

    db.addVolunteer({
      fullName: name,
      skills: skills.split(',').map(s => s.trim()),
      contact: phone
    });

    setName('');
    setSkills('');
    setPhone('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Volunteer Operations Directory</h2>
        <p className="text-slate-400 text-xs">Coordinate with local squads, enlist skills, and deploy for swift rescue missions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            Enlist as Disaster Volunteer
          </h3>
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rohan Verma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 mb-1">Skills (comma-separated):</label>
              <input
                type="text"
                required
                placeholder="e.g. First Aid, Swift Water Rescue, Logistics"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Phone:</label>
              <input
                type="text"
                required
                placeholder="+91-99222-XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg border border-indigo-700 transition-all duration-150"
            >
              Submit Application
            </button>

            {success && (
              <div className="text-emerald-400 text-xs flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-4 h-4" />
                Application approved. Thank you for volunteering!
              </div>
            )}
          </form>
        </div>

        {/* Directory List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Enlisted Volunteers Database
          </h3>
          <div className="space-y-3">
            {volunteers.map(vol => (
              <div key={vol.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                    {vol.fullName}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vol.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-850 text-slate-300 border border-slate-700/50 px-2 py-0.5 rounded text-[10px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-500">{vol.contact}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    vol.status === 'ACTIVE_MISSION' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {vol.status}
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
export default VolunteerDashboard;
