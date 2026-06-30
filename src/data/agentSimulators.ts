import { db } from './mockDatabase';

export interface SimulationStep {
  agentName: string;
  actionType: string;
  level: 'INFO' | 'WARNING' | 'DECISION' | 'ERROR';
  message: string;
  delay: number;
  effect?: () => void;
}

export const generateSimulationSteps = (disasterId: string): SimulationStep[] => {
  const disasters = db.getDisasters();
  const disaster = disasters.find(d => d.id === disasterId);
  if (!disaster) return [];

  const locationStr = `${disaster.latitude.toFixed(2)}°N, ${disaster.longitude.toFixed(2)}°E`;
  const isEarthquake = disaster.type === 'EARTHQUAKE';

  return [
    {
      agentName: 'Weather Agent',
      actionType: 'DISASTER_DETECTION',
      level: 'WARNING',
      message: `ALERT: Meteorological sensors detect anomalous ${isEarthquake ? 'tectonic tremor activity (fault slip)' : 'heavy convective precipitation/runoff'}. Predicted Impact Location: ${locationStr}. Evaluating severity coefficient...`,
      delay: 800
    },
    {
      agentName: 'Weather Agent',
      actionType: 'SEVERITY_CLASSIFICATION',
      level: 'DECISION',
      message: `OUTPUT: Disaster classification verified: ${disaster.type}. Severity: ${disaster.severity}. Time remaining to peak threshold impact: 5.2 hours. Initiating collaborative multi-agent response workflow...`,
      delay: 1000,
      effect: () => {
        db.addAlert(
          disasterId,
          disaster.severity === 'CRITICAL' || disaster.severity === 'HIGH' ? 'CRITICAL' : 'WARNING',
          `Weather Agent Alert: ${disaster.type} event confirmed at ${disaster.title} with ${disaster.severity} severity.`
        );
      }
    },
    {
      agentName: 'Shelter Agent',
      actionType: 'SHELTER_CAPACITY_PLANNING',
      level: 'DECISION',
      message: `OUTPUT: Safe shelter lookup completed. Nearest node: 'Balika Vidyalaya Relief Shelter' (capacity 500, currently 420 occupied). Rerouting overflow group of 50 evacuees to alternative: 'District Indoor Stadium Shelter' (capacity 1200, 650 occupied).`,
      delay: 1200,
      effect: () => {
        const targetShelter = db.getShelters()[0];
        if (targetShelter) {
          db.updateShelterOccupancy(targetShelter.id, 50);
        }
      }
    },
    {
      agentName: 'Resource Allocation Agent',
      actionType: 'LOGISTICS_CALCULATOR',
      level: 'DECISION',
      message: `OUTPUT: Calculating supply demands based on affected population (${disaster.affectedPopulation.toLocaleString()}). Allocating: 2,500 food packets, 3,000L drinking water, 800 blankets, 350 emergency kits, and 6 rescue speedboats. Distribution priority index: HIGH.`,
      delay: 1200,
      effect: () => {
        const resources = db.getResources();
        const food = resources.find(r => r.category === 'FOOD_WATER');
        if (food) {
          db.allocateResource(disasterId, food.id, 2500);
        }
      }
    },
    {
      agentName: 'Medical Agent',
      actionType: 'HEALTHCARE_TRIAGE',
      level: 'WARNING',
      message: `OUTPUT: Nearby hospitals queried. Narayana Medical Institute ICU capacity: 15/50 free. Sadar District Hospital general beds: 34 free. Dispatching 10 ambulances to high-risk zones. Prioritizing 8 severe trauma cases for ICU admission.`,
      delay: 1200,
      effect: () => {
        const hosp = db.getHospitals()[0];
        if (hosp) {
          db.updateHospitalBeds(hosp.id, Math.max(0, hosp.icuBedsAvailable - 8), Math.max(0, hosp.generalBedsAvailable - 15));
        }
      }
    },
    {
      agentName: 'Rescue Agent',
      actionType: 'ROUTE_OPTIMIZER',
      level: 'DECISION',
      message: `OUTPUT: Rescue plan initialized. Generating optimized paths. AVOIDING: flooded lowlands and landslide structural blockages. Prioritizing: elderly, children, and disabled citizens. Dispatching NDRF Battalion 09. Route ETA: 22 minutes.`,
      delay: 1500,
      effect: () => {
        const activeTeam = db.getRescueTeams().find(t => t.type === 'AQUATIC' || t.type === 'GROUND_SEARCH');
        if (activeTeam) {
          db.deployTeam(activeTeam.id, disasterId);
        }
      }
    }
  ];
};

export const executeSimulation = async (
  disasterId: string,
  onAgentChange: (agentName: string, status: 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED') => void
) => {
  const steps = generateSimulationSteps(disasterId);
  
  // Set all agents to IDLE first
  const agentNames = [
    'Weather Agent', 'Shelter Agent', 'Resource Allocation Agent',
    'Medical Agent', 'Rescue Agent'
  ];
  
  for (const name of agentNames) {
    onAgentChange(name, 'IDLE');
  }

  for (const step of steps) {
    onAgentChange(step.agentName, step.level === 'DECISION' ? 'DECIDING' : 'ANALYZING');
    
    await new Promise(resolve => setTimeout(resolve, step.delay));
    
    if (step.effect) {
      step.effect();
    }
    
    db.addAgentLog(step.agentName, step.actionType, step.level, step.message);
    
    // Feed the timeline events table
    let category: 'DETECTION' | 'EVACUATION' | 'RESCUE' | 'MEDICAL' | 'RESOURCE' | 'RESOLVED' = 'DETECTION';
    if (step.agentName === 'Weather Agent') category = 'DETECTION';
    else if (step.agentName === 'Shelter Agent') category = 'EVACUATION';
    else if (step.agentName === 'Resource Allocation Agent') category = 'RESOURCE';
    else if (step.agentName === 'Medical Agent') category = 'MEDICAL';
    else if (step.agentName === 'Rescue Agent') category = 'RESCUE';

    db.addTimelineEvent(
      `${step.agentName}: ${step.actionType.replace('_', ' ')}`,
      step.message.substring(0, 150) + (step.message.length > 150 ? '...' : ''),
      category,
      step.level === 'ERROR' ? 'CRITICAL' : step.level === 'WARNING' ? 'HIGH' : 'MEDIUM',
      step.agentName
    );

    // Push important alerts to Notification Center
    if (step.level === 'WARNING' || step.level === 'DECISION') {
      db.addNotification(
        `Agent Update: ${step.agentName}`,
        step.message,
        step.level === 'WARNING' ? 'ALERT' : 'INFO'
      );
    }
    
    onAgentChange(step.agentName, 'COMPLETED');
  }
};
