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

  return [
    {
      agentName: 'Monitoring Agent',
      actionType: 'RISK_DETECTION',
      level: 'WARNING',
      message: `ALERT: IoT telemetric trigger received. High flow threshold exceeded at sensor point. Location: ${locationStr}. Confirming hazard profile...`,
      delay: 500
    },
    {
      agentName: 'Monitoring Agent',
      actionType: 'DISASTER_CONFIRMATION',
      level: 'DECISION',
      message: `CONFIRMED: Autonomous sensor triangulation confirms ${disaster.type} event of ${disaster.severity} severity. Confidence rating: 98.4%. Time remaining to peak impact: 4.5 hours.`,
      delay: 1000,
      effect: () => {
        db.addAlert(
          disasterId,
          disaster.severity === 'CRITICAL' || disaster.severity === 'HIGH' ? 'CRITICAL' : 'WARNING',
          `AI RESQ Broadcast: A ${disaster.type} event (${disaster.severity}) has been confirmed at ${disaster.title}. Immediate precautionary measures advised.`
        );
      }
    },
    {
      agentName: 'Information Retrieval Agent',
      actionType: 'DATA_AGGREGATION',
      level: 'INFO',
      message: `COLLECTING DATA: Fetching local weather sensors, hospital database, shelter inventories, and active responder units within a 25km radius.`,
      delay: 1200
    },
    {
      agentName: 'Information Retrieval Agent',
      actionType: 'DATA_SUMMARIZATION',
      level: 'INFO',
      message: `RETRIEVED: Found ${db.getShelters().length} operational shelters, ${db.getHospitals().length} medical centers, and ${db.getRescueTeams().length} regional responder teams. Querying live capacity...`,
      delay: 1000
    },
    {
      agentName: 'Planning Agent',
      actionType: 'PREDICTIVE_MODELLING',
      level: 'DECISION',
      message: `EVACUATION STRATEGY: Computing hazard expansion radial. Estimated population in high-risk zones: ${disaster.affectedPopulation.toLocaleString()} citizens. Setting shelter thresholds.`,
      delay: 1500
    },
    {
      agentName: 'Decision Support Agent',
      actionType: 'COMMAND_RANKING',
      level: 'DECISION',
      message: `PRIORITY ACTION PLAN GENERATED:
- Evacuation Urgency: Level 9/10.
- Key Actions: Dispatch Aquatic rescue teams, provision shelter sh-1 & sh-2, allocate 3,000+ food rations, standby Sadar District Hospital ICU beds.`,
      delay: 1500
    },
    {
      agentName: 'Shelter Agent',
      actionType: 'CAPACITY_MATCHING',
      level: 'DECISION',
      message: `SHELTER CORRELATION: Directing evacuees to nearest shelter node. 'Balika Vidyalaya Relief Shelter' currently at 84% capacity. Preparing overflow routing to 'District Indoor Stadium Shelter'.`,
      delay: 1200,
      effect: () => {
        // Increment occupancy to show agent shelter allocations
        const targetShelter = db.getShelters()[0];
        if (targetShelter) {
          db.updateShelterOccupancy(targetShelter.id, 50);
        }
      }
    },
    {
      agentName: 'Resource Allocation Agent',
      actionType: 'INVENTORY_OPTIMIZATION',
      level: 'DECISION',
      message: `LOGISTICS DISPATCH: Prioritizing allocation of emergency supplies based on population density. Allocating 1,500 food units and 2,000 water liters to shelter 'sh-2'.`,
      delay: 1500,
      effect: () => {
        const resources = db.getResources();
        const food = resources.find(r => r.category === 'FOOD_WATER');
        if (food) {
          db.allocateResource(disasterId, food.id, 1000);
        }
      }
    },
    {
      agentName: 'Healthcare Agent',
      actionType: 'MEDICAL_TRIAGE',
      level: 'WARNING',
      message: `MEDICAL DISPATCH: Sadar District Hospital reporting blood bank status 'LOW'. Dispatching field ambulance unit and notifying medical volunteers for emergency support duty.`,
      delay: 1200,
      effect: () => {
        const hosp = db.getHospitals()[0];
        if (hosp) {
          db.updateHospitalBeds(hosp.id, Math.max(0, hosp.icuBedsAvailable - 2), Math.max(0, hosp.generalBedsAvailable - 10));
        }
      }
    },
    {
      agentName: 'Rescue Agent',
      actionType: 'ROUTING_SOLVER',
      level: 'DECISION',
      message: `NAVIGATION SOLVED: Safe dispatch route created. Bypassing active water levels along River Corridor. Routing NDRF Battalion 09 through High-Elevation highways. ETA: 28 minutes.`,
      delay: 1500,
      effect: () => {
        const activeTeam = db.getRescueTeams().find(t => t.type === 'AQUATIC' || t.type === 'GROUND_SEARCH');
        if (activeTeam) {
          db.deployTeam(activeTeam.id, disasterId);
        }
      }
    },
    {
      agentName: 'Citizen Assistance Agent',
      actionType: 'BROADCAST_PROTOCOLS',
      level: 'INFO',
      message: `ASSISTANCE DISPATCHED: Updating citizen chatbots with localized evacuation guides, shelter directions, and safety advisories in English and Hindi.`,
      delay: 1000
    },
    {
      agentName: 'Reporting Agent',
      actionType: 'SITREP_COMPILATION',
      level: 'INFO',
      message: `REPORT GENERATED: Automated Government Situation Report (SITREP-01) drafted and queued for administrative approval. Analytical dashboard maps updated.`,
      delay: 1000
    },
    {
      agentName: 'Compliance Agent',
      actionType: 'FACT_VALIDATION',
      level: 'DECISION',
      message: `COMPLIANCE CHECKS PASSED: Information verified against government IoT protocols. Zero misinformation clusters detected. Citizen emergency transmission signed and authenticated.`,
      delay: 800
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
    'Monitoring Agent', 'Information Retrieval Agent', 'Planning Agent',
    'Decision Support Agent', 'Shelter Agent', 'Resource Allocation Agent',
    'Healthcare Agent', 'Rescue Agent', 'Citizen Assistance Agent',
    'Reporting Agent', 'Compliance Agent'
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
    
    onAgentChange(step.agentName, 'COMPLETED');
  }
};
