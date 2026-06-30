import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  Cpu, 
  MessageSquare, 
  LayoutDashboard, 
  Layers, 
  UserCheck 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
}

const ROLES = [
  { id: 'GOVERNMENT_OFFICER', label: 'Government Command', color: 'border-red-500 text-red-600' },
  { id: 'CITIZEN', label: 'Citizen Portal', color: 'border-blue-500 text-blue-600' },
  { id: 'VOLUNTEER', label: 'Volunteer Directory', color: 'border-green-500 text-green-600' },
  { id: 'NGO', label: 'NGO Relief Logistics', color: 'border-orange-500 text-orange-600' },
  { id: 'HOSPITAL_STAFF', label: 'Hospital Staff Care', color: 'border-teal-500 text-teal-600' },
  { id: 'ADMIN', label: 'System Admin Console', color: 'border-purple-500 text-purple-600' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole
}) => {
  const tabs = [
    { id: 'map', label: 'Live GIS Map', icon: Map },
    { id: 'dashboard', label: 'Role Analytics', icon: LayoutDashboard },
    { id: 'agents', label: 'AI Agent Console', icon: Cpu },
    { id: 'chat', label: 'Citizen Chat Assistant', icon: MessageSquare },
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              AI RESQ <span className="text-[10px] bg-red-600 text-white font-semibold px-1.5 py-0.5 rounded">AUTO</span>
            </h1>
            <p className="text-xs text-slate-500">Autonomous Multi-Agent Crisis Ops</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">Navigation</p>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-inner border-l-2 border-red-500' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Role Switcher */}
        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-3">Active Persona (RBAC)</p>
          <div className="space-y-1">
            {ROLES.map(role => {
              const isSelected = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole(role.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    isSelected
                      ? `bg-slate-800 border-slate-700 text-white`
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/20 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{role.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-6 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-600 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-3.5 h-3.5" />
          <span>PostgreSQL Active</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Local Agent Network (CrewAI style)</span>
        </div>
        <p className="mt-2">Emergency Response Command © 2026</p>
      </div>
    </aside>
  );
};
export default Sidebar;
