import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { db } from '../data/mockDatabase';
import type { Disaster, Shelter, Hospital, RescueTeam } from '../data/seedData';
import { ShieldAlert, Crosshair, Home, Shield } from 'lucide-react';

// Create custom leaflet icons dynamically using inline styles to avoid broken default markers
const getMarkerIcon = (type: 'DISASTER' | 'SHELTER' | 'HOSPITAL' | 'TEAM', color: string) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 bg-white rounded-full border border-slate-300 shadow-md">
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs" style="background-color: ${color}">
          ${type[0]}
        </div>
        <div class="absolute -inset-1 rounded-full border border-white opacity-40 radar-ring" style="background-color: ${color}"></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

interface MapModuleProps {
  currentRole: string;
}

export const MapModule: React.FC<MapModuleProps> = ({ currentRole }) => {
  const [disasters, setDisasters] = useState<Disaster[]>(db.getDisasters());
  const [shelters, setShelters] = useState<Shelter[]>(db.getShelters());
  const [hospitals, setHospitals] = useState<Hospital[]>(db.getHospitals());
  const [teams, setTeams] = useState<RescueTeam[]>(db.getRescueTeams());
  
  const [newDisasterForm, setNewDisasterForm] = useState<{
    lat: number;
    lng: number;
    title: string;
    type: Disaster['type'];
    severity: Disaster['severity'];
    population: number;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDisasters(db.getDisasters());
      setShelters(db.getShelters());
      setHospitals(db.getHospitals());
      setTeams(db.getRescueTeams());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Map click handler to report a disaster
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (currentRole === 'GOVERNMENT_OFFICER' || currentRole === 'CITIZEN' || currentRole === 'ADMIN') {
          setNewDisasterForm({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            title: '',
            type: 'FLOOD',
            severity: 'HIGH',
            population: 15000,
          });
        }
      },
    });
    return null;
  };

  const handleReportDisaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisasterForm || !newDisasterForm.title) return;

    db.addDisaster({
      type: newDisasterForm.type,
      title: newDisasterForm.title,
      description: `User reported crisis via GIS map coordinator. Evaluating severity indexes.`,
      severity: newDisasterForm.severity,
      latitude: newDisasterForm.lat,
      longitude: newDisasterForm.lng,
      status: 'ACTIVE',
      affectedPopulation: newDisasterForm.population,
    });

    setNewDisasterForm(null);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row relative bg-slate-900">
      {/* Map display */}
      <div className="flex-1 h-full z-10">
        <MapContainer 
          center={[26.15, 86.85]} 
          zoom={10} 
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler />

          {/* Render Disasters */}
          {disasters.map(d => {
            const color = d.severity === 'CRITICAL' ? '#ef4444' : d.severity === 'HIGH' ? '#f97316' : '#eab308';
            return (
              <React.Fragment key={d.id}>
                <Marker 
                  position={[d.latitude, d.longitude]} 
                  icon={getMarkerIcon('DISASTER', color)}
                >
                  <Popup>
                    <div className="p-1 max-w-[200px] text-slate-800">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-red-600 mb-1">
                        <ShieldAlert className="w-4 h-4" />
                        {d.type} - {d.severity}
                      </div>
                      <p className="font-semibold text-xs mb-1">{d.title}</p>
                      <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{d.description}</p>
                      <div className="text-[10px] font-bold text-slate-600 bg-slate-100 p-1.5 rounded">
                        Est. Population Affected: {d.affectedPopulation.toLocaleString()}
                      </div>
                    </div>
                  </Popup>
                </Marker>
                {/* Evacuation perimeter circle */}
                <Circle 
                  center={[d.latitude, d.longitude]} 
                  radius={6000} 
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.15, weight: 2.5 }}
                />
              </React.Fragment>
            );
          })}

          {/* Render Shelters */}
          {shelters.map(s => (
            <Marker 
              key={s.id} 
              position={[s.latitude, s.longitude]} 
              icon={getMarkerIcon('SHELTER', '#3b82f6')}
            >
              <Popup>
                <div className="p-1 text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-blue-600 mb-1">
                    <Home className="w-4 h-4" />
                    Shelter Center
                  </div>
                  <p className="font-semibold text-xs mb-1">{s.name}</p>
                  <div className="text-[10px] space-y-0.5">
                    <p>Occupancy: <b>{s.occupancy}</b> / {s.capacity} beds</p>
                    <p>Food stock: {s.foodStockDays} days remaining</p>
                    <p>Water stock: {s.waterStockDays} days remaining</p>
                    <p>Medical center: {s.medicalFacility ? 'Available' : 'None'}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Hospitals */}
          {hospitals.map(h => (
            <Marker 
              key={h.id} 
              position={[h.latitude, h.longitude]} 
              icon={getMarkerIcon('HOSPITAL', '#ec4899')}
            >
              <Popup>
                <div className="p-1 text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-pink-600 mb-1">
                    <Crosshair className="w-4 h-4" />
                    Medical Center
                  </div>
                  <p className="font-semibold text-xs mb-1">{h.name}</p>
                  <div className="text-[10px] space-y-0.5">
                    <p>ICU Beds: <b>{h.icuBedsAvailable}</b> Available / {h.icuBedsTotal}</p>
                    <p>General Beds: <b>{h.generalBedsAvailable}</b> / {h.generalBedsTotal}</p>
                    <p>Ambulances status: {h.ambulancesAvailable} operational</p>
                    <p>Doctors: {h.doctorsOnDuty} on shift</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Teams */}
          {teams.map(t => (
            <Marker 
              key={t.id} 
              position={[t.latitude, t.longitude]} 
              icon={getMarkerIcon('TEAM', '#10b981')}
            >
              <Popup>
                <div className="p-1 text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-600 mb-1">
                    <Shield className="w-4 h-4" />
                    Rescue Battalion
                  </div>
                  <p className="font-semibold text-xs mb-1">{t.name}</p>
                  <div className="text-[10px] space-y-0.5">
                    <p>Type: <b>{t.type}</b></p>
                    <p>Status: <span className="uppercase font-semibold">{t.status}</span></p>
                    <p>Personnel: {t.membersCount} responders</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Floating Add Disaster Form Panel (if map is clicked) */}
      {newDisasterForm && (
        <div className="absolute top-4 right-4 z-[999] bg-slate-900/95 backdrop-blur border border-slate-700 text-white rounded-lg p-5 w-80 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-sm font-bold">Report New Hazard Sector</h3>
          </div>
          <form onSubmit={handleReportDisaster} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Coordinates:</label>
              <span className="text-[10px] text-indigo-400 font-mono bg-slate-950 px-2 py-1 rounded block">
                {newDisasterForm.lat.toFixed(4)}°N, {newDisasterForm.lng.toFixed(4)}°E
              </span>
            </div>
            
            <div>
              <label className="block text-slate-400 mb-1">Hazard Title:</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Flash Flood Sector B"
                value={newDisasterForm.title}
                onChange={e => setNewDisasterForm({ ...newDisasterForm, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Hazard Type:</label>
                <select
                  value={newDisasterForm.type}
                  onChange={e => setNewDisasterForm({ ...newDisasterForm, type: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none"
                >
                  <option value="FLOOD">Flood</option>
                  <option value="WILDFIRE">Wildfire</option>
                  <option value="CYCLONE">Cyclone</option>
                  <option value="EARTHQUAKE">Earthquake</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-400 mb-1">Severity Scale:</label>
                <select
                  value={newDisasterForm.severity}
                  onChange={e => setNewDisasterForm({ ...newDisasterForm, severity: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Est. Affected Density:</label>
              <input 
                type="number" 
                value={newDisasterForm.population}
                onChange={e => setNewDisasterForm({ ...newDisasterForm, population: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                className="flex-1 bg-red-600 hover:bg-red-700 font-bold py-2 rounded text-center"
              >
                Trigger Agents
              </button>
              <button 
                type="button" 
                onClick={() => setNewDisasterForm(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sidebar explanation panel */}
      <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 overflow-y-auto text-slate-300">
        <h3 className="font-bold text-sm mb-4 text-white uppercase tracking-wider">GIS Map Legends</h3>
        
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded bg-red-600 flex items-center justify-center font-bold text-[10px]">D</span>
            <div>
              <p className="font-semibold text-white">Disaster Sector Center</p>
              <p className="text-slate-500">Rings represent computed evacuation radii.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-bold text-[10px]">S</span>
            <div>
              <p className="font-semibold text-white">Operational Shelter Nodes</p>
              <p className="text-slate-500">Click to view food reserves, power status, and bed capacities.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded bg-pink-600 flex items-center justify-center font-bold text-[10px]">H</span>
            <div>
              <p className="font-semibold text-white">Medical Center Nodes</p>
              <p className="text-slate-500">Displays ICUs, ambulances, and doctor shifts.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center font-bold text-[10px]">T</span>
            <div>
              <p className="font-semibold text-white">Rescue Teams</p>
              <p className="text-slate-500">Identifies deployable state/national emergency response squads.</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mt-6">
            <p className="text-[11px] font-semibold text-indigo-400 mb-2">GIS Command Options:</p>
            <p className="text-[10px] text-slate-500 leading-normal">
              Click anywhere directly on the OpenStreetMap window to report a localized hazard pin. The multi-agent simulator will automatically launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MapModule;
