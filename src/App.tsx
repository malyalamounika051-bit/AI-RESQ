import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MapModule from './components/MapModule';
import AgentConsole from './components/AgentConsole';
import ChatAssistant from './components/ChatAssistant';
import MissingPersons from './components/MissingPersons';
import DisasterTimeline from './components/DisasterTimeline';
import OverviewTab from './dashboards/OverviewTab';
import GovernmentDashboard from './dashboards/GovernmentDashboard';
import CitizenDashboard from './dashboards/CitizenDashboard';
import VolunteerDashboard from './dashboards/VolunteerDashboard';
import NgoDashboard from './dashboards/NgoDashboard';
import HospitalDashboard from './dashboards/HospitalDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<string>('GOVERNMENT_OFFICER');
  
  const [agentStatuses, setAgentStatuses] = useState<Record<string, 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED'>>({
    'Weather Agent': 'IDLE',
    'Shelter Agent': 'IDLE',
    'Resource Allocation Agent': 'IDLE',
    'Medical Agent': 'IDLE',
    'Rescue Agent': 'IDLE',
  });

  const renderDashboardByRole = () => {
    switch (currentRole) {
      case 'CITIZEN':
        return <CitizenDashboard />;
      case 'VOLUNTEER':
        return <VolunteerDashboard />;
      case 'NGO':
        return <NgoDashboard />;
      case 'HOSPITAL_STAFF':
        return <HospitalDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <GovernmentDashboard />;
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewTab setAgentStatuses={setAgentStatuses} agentStatuses={agentStatuses} />;
      case 'dashboard':
        return renderDashboardByRole();
      case 'agents':
        return <AgentConsole agentStatuses={agentStatuses} />;
      case 'timeline':
        return <DisasterTimeline />;
      case 'missing':
        return <MissingPersons />;
      case 'chat':
        return <ChatAssistant />;
      default:
        return <MapModule currentRole={currentRole} />;
    }
  };

  if (showLanding) {
    return <LandingPage onEnterConsole={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      {/* Main Workspace content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onSimulationStarted={() => {
            setCurrentTab('agents');
          }}
          onSimulationFinished={() => {
          }}
          setAgentStatuses={setAgentStatuses}
        />
        
        <main className="flex-1 min-h-0 bg-slate-950 relative overflow-y-auto px-8 py-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
