export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
}

export interface Disaster {
  id: string;
  type: 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'WILDFIRE' | 'LANDSLIDE';
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
  affectedPopulation: number;
  reportedAt: string;
}

export interface Alert {
  id: string;
  disasterId: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  status: 'SENT' | 'DRAFT';
  broadcastAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupancy: number;
  foodStockDays: number;
  waterStockDays: number;
  powerBackup: boolean;
  medicalFacility: boolean;
  status: 'OPERATIONAL' | 'FULL' | 'CLOSED';
}

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  icuBedsTotal: number;
  icuBedsAvailable: number;
  generalBedsTotal: number;
  generalBedsAvailable: number;
  ambulancesTotal: number;
  ambulancesAvailable: number;
  doctorsOnDuty: number;
  bloodBankStatus: 'NORMAL' | 'CRITICAL' | 'LOW';
  status: 'OPERATIONAL' | 'OVERLOADED' | 'DAMAGED';
}

export interface Resource {
  id: string;
  name: string;
  category: 'FOOD_WATER' | 'MEDICAL' | 'SHELTER_KIT' | 'EQUIPMENT' | 'VEHICLE' | 'FUEL';
  totalQuantity: number;
  availableQuantity: number;
  unit: string;
}

export interface ResourceAllocation {
  id: string;
  disasterId: string;
  resourceId: string;
  resourceName: string;
  quantityAllocated: number;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
  allocatedAt: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  agency: string;
  type: 'AERIAL' | 'AQUATIC' | 'GROUND_SEARCH' | 'MEDICAL' | 'HAZMAT';
  membersCount: number;
  contactPhone: string;
  status: 'AVAILABLE' | 'DEPLOYED' | 'STANDBY';
  latitude: number;
  longitude: number;
  currentAssignmentId?: string;
}

export interface Volunteer {
  id: string;
  fullName: string;
  skills: string[];
  status: 'APPROVED' | 'ACTIVE_MISSION' | 'PENDING';
  contact: string;
  assignedTeamId?: string;
}

export interface AgentLog {
  id: string;
  agentName: string;
  actionType: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'DECISION';
  message: string;
  timestamp: string;
  metadata?: any;
}

export interface AgentConfig {
  name: string;
  role: string;
  goal: string;
  status: 'IDLE' | 'ANALYZING' | 'DECIDING' | 'COMPLETED';
  avatarColor: string;
}

// Initial Static Seeding Data
export const INITIAL_DISASTERS: Disaster[] = [
  {
    id: 'dis-1',
    type: 'FLOOD',
    title: 'Kosi River Overflow & Basin Inundation',
    description: 'Heavy monsoon rains caused a breach in the Kosi River embankment, flooding 14 low-lying villages.',
    severity: 'HIGH',
    latitude: 26.15,
    longitude: 86.85,
    status: 'ACTIVE',
    affectedPopulation: 45000,
    reportedAt: '2026-06-30T10:00:00Z',
  },
  {
    id: 'dis-2',
    type: 'WILDFIRE',
    title: 'Western Ghats Ridge Fire',
    description: 'Dry winds and lightning sparked a forest fire expanding along the ridge toward adjacent settlements.',
    severity: 'MEDIUM',
    latitude: 11.45,
    longitude: 76.60,
    status: 'ACTIVE',
    affectedPopulation: 8500,
    reportedAt: '2026-06-30T12:30:00Z',
  },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    disasterId: 'dis-1',
    severity: 'CRITICAL',
    message: 'EVACUATION ALERT: Residents of Kosi basin area are advised to evacuate immediately to nearest designated shelters.',
    status: 'SENT',
    broadcastAt: '2026-06-30T10:15:00Z',
  },
];

export const INITIAL_SHELTERS: Shelter[] = [
  {
    id: 'sh-1',
    name: 'Balika Vidyalaya Relief Shelter',
    latitude: 26.22,
    longitude: 86.89,
    capacity: 500,
    occupancy: 420,
    foodStockDays: 4,
    waterStockDays: 3,
    powerBackup: true,
    medicalFacility: true,
    status: 'OPERATIONAL',
  },
  {
    id: 'sh-2',
    name: 'District Indoor Stadium Shelter',
    latitude: 26.11,
    longitude: 86.82,
    capacity: 1200,
    occupancy: 650,
    foodStockDays: 7,
    waterStockDays: 8,
    powerBackup: true,
    medicalFacility: true,
    status: 'OPERATIONAL',
  },
  {
    id: 'sh-3',
    name: 'Wayanad Forest Fire Base Camp',
    latitude: 11.40,
    longitude: 76.58,
    capacity: 300,
    occupancy: 110,
    foodStockDays: 5,
    waterStockDays: 5,
    powerBackup: false,
    medicalFacility: false,
    status: 'OPERATIONAL',
  },
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Sadar District Hospital',
    latitude: 26.13,
    longitude: 86.80,
    icuBedsTotal: 30,
    icuBedsAvailable: 4,
    generalBedsTotal: 250,
    generalBedsAvailable: 34,
    ambulancesTotal: 10,
    ambulancesAvailable: 3,
    doctorsOnDuty: 14,
    bloodBankStatus: 'LOW',
    status: 'OPERATIONAL',
  },
  {
    id: 'hosp-2',
    name: 'Narayana Medical Institute',
    latitude: 26.18,
    longitude: 86.92,
    icuBedsTotal: 50,
    icuBedsAvailable: 15,
    generalBedsTotal: 400,
    generalBedsAvailable: 85,
    ambulancesTotal: 15,
    ambulancesAvailable: 8,
    doctorsOnDuty: 22,
    bloodBankStatus: 'NORMAL',
    status: 'OPERATIONAL',
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  { id: 'res-1', name: 'Standard Food Rations', category: 'FOOD_WATER', totalQuantity: 10000, availableQuantity: 6200, unit: 'packets' },
  { id: 'res-2', name: 'Bottled Mineral Water', category: 'FOOD_WATER', totalQuantity: 20000, availableQuantity: 11500, unit: 'liters' },
  { id: 'res-3', name: 'Emergency Trauma Kits', category: 'MEDICAL', totalQuantity: 1500, availableQuantity: 820, unit: 'units' },
  { id: 'res-4', name: 'Temporary Inflatable Tents', category: 'SHELTER_KIT', totalQuantity: 800, availableQuantity: 340, unit: 'tents' },
  { id: 'res-5', name: 'OBM Rescue Speedboats', category: 'VEHICLE', totalQuantity: 25, availableQuantity: 8, unit: 'boats' },
  { id: 'res-6', name: 'High-Output Water Pumps', category: 'EQUIPMENT', totalQuantity: 40, availableQuantity: 12, unit: 'pumps' },
];

export const INITIAL_RESOURCE_ALLOCATIONS: ResourceAllocation[] = [
  {
    id: 'alloc-1',
    disasterId: 'dis-1',
    resourceId: 'res-1',
    resourceName: 'Standard Food Rations',
    quantityAllocated: 3800,
    status: 'DISPATCHED',
    allocatedAt: '2026-06-30T11:00:00Z',
  },
  {
    id: 'alloc-2',
    disasterId: 'dis-1',
    resourceId: 'res-5',
    resourceName: 'OBM Rescue Speedboats',
    quantityAllocated: 12,
    status: 'DELIVERED',
    allocatedAt: '2026-06-30T10:30:00Z',
  },
];

export const INITIAL_RESCUE_TEAMS: RescueTeam[] = [
  {
    id: 'team-1',
    name: 'NDRF Battalion 09 - Aquatic Rescue',
    agency: 'National Disaster Response Force',
    type: 'AQUATIC',
    membersCount: 45,
    contactPhone: '+91-98765-43210',
    status: 'DEPLOYED',
    latitude: 26.16,
    longitude: 86.87,
    currentAssignmentId: 'dis-1',
  },
  {
    id: 'team-2',
    name: 'State Fire Service - Wildfire Unit B',
    agency: 'State Disaster Response Force',
    type: 'GROUND_SEARCH',
    membersCount: 20,
    contactPhone: '+91-98765-43211',
    status: 'DEPLOYED',
    latitude: 11.44,
    longitude: 76.59,
    currentAssignmentId: 'dis-2',
  },
  {
    id: 'team-3',
    name: 'Army Medical Corps Field Unit 4',
    agency: 'Indian Army',
    type: 'MEDICAL',
    membersCount: 15,
    contactPhone: '+91-98765-43212',
    status: 'STANDBY',
    latitude: 26.12,
    longitude: 86.81,
  },
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'vol-1', fullName: 'Dr. Aarav Mehta', skills: ['Emergency Trauma Care', 'BLS Training'], status: 'APPROVED', contact: '+91-99222-11111' },
  { id: 'vol-2', fullName: 'Vikram Singh', skills: ['Powerboat Handling', 'Swift Water Rescue'], status: 'ACTIVE_MISSION', contact: '+91-99222-22222', assignedTeamId: 'team-1' },
  { id: 'vol-3', fullName: 'Priyanka Sharma', skills: ['Disaster Logistics', 'First Aid'], status: 'APPROVED', contact: '+91-99222-33333' },
  { id: 'vol-4', fullName: 'Anil Kumar', skills: ['Debris Removal', 'Amateur Radio Operations'], status: 'PENDING', contact: '+91-99222-44444' },
];

export const AGENT_CONFIGS: AgentConfig[] = [
  { name: 'Monitoring Agent', role: 'IoT & Remote Sensing Specialist', goal: 'Continuously pull IoT gauges, weather feeds, and satellite alarms to identify onset disaster events.', status: 'IDLE', avatarColor: '#3b82f6' },
  { name: 'Information Retrieval Agent', role: 'Context Aggregation & Verification Engine', goal: 'Gather live bed availabilities, shelter stocks, and weather telemetry surrounding the target area.', status: 'IDLE', avatarColor: '#10b981' },
  { name: 'Planning Agent', role: 'Strategic Operations Planner', goal: 'Formulate predictive evacuation radiuses, risk grids, and shelter capacities to map optimal solutions.', status: 'IDLE', avatarColor: '#8b5cf6' },
  { name: 'Decision Support Agent', role: 'Command Optimiser & Severity Ranker', goal: 'Weight risk vectors and resource needs to produce clear actionable summaries for administrators.', status: 'IDLE', avatarColor: '#f59e0b' },
  { name: 'Shelter Agent', role: 'Geospatial Shelter Coordinator', goal: 'Compute nearest shelters, current occupancies, and reroute incoming evacuees to alternate nodes when full.', status: 'IDLE', avatarColor: '#ec4899' },
  { name: 'Resource Allocation Agent', role: 'Logistics Optimization Solver', goal: 'Distribute assets (rations, tents, pumps) prioritizing high severity and affected density.', status: 'IDLE', avatarColor: '#14b8a6' },
  { name: 'Healthcare Agent', role: 'Medical Logistics Coordinator', goal: 'Triage bed demands, assign ambulance routes, and monitor blood bank deficits across hospitals.', status: 'IDLE', avatarColor: '#ef4444' },
  { name: 'Rescue Agent', role: 'Tactical Safe Route Planner', goal: 'Map navigation courses avoiding floods, forest fires, or landslide blockages for rescue teams.', status: 'IDLE', avatarColor: '#6366f1' },
  { name: 'Citizen Assistance Agent', role: 'Interactive Support Operator', goal: 'Provide real-time guidelines, shelters, and collect incident reports directly from citizens.', status: 'IDLE', avatarColor: '#84cc16' },
  { name: 'Reporting Agent', role: 'Compliance & Summary Documenter', goal: 'Generate standard Situation Reports (SITREPs) and analytics charts for NGOs and governments.', status: 'IDLE', avatarColor: '#6b7280' },
  { name: 'Compliance Agent', role: 'Ethical Guardrail & Fact Validator', goal: 'Filter incoming reports to verify authenticity, prevent rumors, and enforce data privacy standards.', status: 'IDLE', avatarColor: '#4b5563' },
];

// ========== NEW: Missing Persons ==========
export interface MissingPerson {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastSeenLocation: string;
  lastSeenTime: string;
  description: string;
  contactPhone: string;
  photoPlaceholder: string;
  status: 'MISSING' | 'FOUND' | 'UNDER_INVESTIGATION';
  reportedAt: string;
}

export const INITIAL_MISSING_PERSONS: MissingPerson[] = [
  {
    id: 'mp-1',
    fullName: 'Ravi Shankar',
    age: 67,
    gender: 'Male',
    lastSeenLocation: 'Kosi River embankment near village Bhagalpur',
    lastSeenTime: '2026-06-30T08:30:00Z',
    description: 'Elderly man, grey hair, wearing white kurta and brown sandals. Uses a wooden walking stick.',
    contactPhone: '+91-98765-11111',
    photoPlaceholder: 'RS',
    status: 'MISSING',
    reportedAt: '2026-06-30T10:15:00Z',
  },
  {
    id: 'mp-2',
    fullName: 'Meera Devi',
    age: 34,
    gender: 'Female',
    lastSeenLocation: 'Near Balika Vidyalaya shelter entrance',
    lastSeenTime: '2026-06-30T11:00:00Z',
    description: 'Woman with two children (ages 5 and 8). Wearing red saree. Last seen moving towards higher ground.',
    contactPhone: '+91-98765-22222',
    photoPlaceholder: 'MD',
    status: 'UNDER_INVESTIGATION',
    reportedAt: '2026-06-30T12:00:00Z',
  },
  {
    id: 'mp-3',
    fullName: 'Arjun Patel',
    age: 12,
    gender: 'Male',
    lastSeenLocation: 'District Indoor Stadium Shelter',
    lastSeenTime: '2026-06-30T14:00:00Z',
    description: 'Young boy, school uniform (blue shirt, grey trousers), carrying a green backpack.',
    contactPhone: '+91-98765-33333',
    photoPlaceholder: 'AP',
    status: 'FOUND',
    reportedAt: '2026-06-30T14:30:00Z',
  },
];

// ========== NEW: SOS Signals ==========
export interface SOSSignal {
  id: string;
  citizenName: string;
  latitude: number;
  longitude: number;
  message: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED';
  timestamp: string;
}

export const INITIAL_SOS_SIGNALS: SOSSignal[] = [
  {
    id: 'sos-1',
    citizenName: 'Anonymous Citizen',
    latitude: 26.14,
    longitude: 86.83,
    message: 'Family of 4 stranded on rooftop. Water level rising rapidly. Need boat rescue.',
    urgency: 'CRITICAL',
    status: 'DISPATCHED',
    timestamp: '2026-06-30T11:30:00Z',
  },
];

// ========== NEW: Notifications ==========
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'SOS';
  isRead: boolean;
  timestamp: string;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', title: 'Evacuation Order Issued', message: 'Kosi basin evacuation order activated by District Collector.', type: 'ALERT', isRead: false, timestamp: '2026-06-30T10:15:00Z' },
  { id: 'notif-2', title: 'NDRF Battalion Deployed', message: 'Battalion 09 aquatic rescue team has been dispatched to sector.', type: 'SUCCESS', isRead: false, timestamp: '2026-06-30T10:30:00Z' },
  { id: 'notif-3', title: 'Blood Bank Alert', message: 'Sadar District Hospital blood bank status changed to LOW.', type: 'ALERT', isRead: true, timestamp: '2026-06-30T11:00:00Z' },
  { id: 'notif-4', title: 'Shelter Capacity Warning', message: 'Balika Vidyalaya shelter approaching 90% capacity.', type: 'INFO', isRead: false, timestamp: '2026-06-30T11:45:00Z' },
];

// ========== NEW: Timeline Events ==========
export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'DETECTION' | 'EVACUATION' | 'RESCUE' | 'MEDICAL' | 'RESOURCE' | 'RESOLVED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  agentName?: string;
}

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'tl-1', timestamp: '2026-06-30T09:45:00Z', title: 'Abnormal Water Levels Detected', description: 'IoT river gauges report 340% above normal flow rate at Kosi embankment sensor array.', category: 'DETECTION', severity: 'HIGH', agentName: 'Monitoring Agent' },
  { id: 'tl-2', timestamp: '2026-06-30T10:00:00Z', title: 'Flood Event Confirmed', description: 'Multi-sensor triangulation confirms Category 3 flood event. Confidence: 98.4%.', category: 'DETECTION', severity: 'CRITICAL', agentName: 'Monitoring Agent' },
  { id: 'tl-3', timestamp: '2026-06-30T10:15:00Z', title: 'Evacuation Alert Broadcast', description: 'District-wide emergency broadcast issued to 45,000+ residents in low-lying areas.', category: 'EVACUATION', severity: 'CRITICAL', agentName: 'Decision Support Agent' },
  { id: 'tl-4', timestamp: '2026-06-30T10:30:00Z', title: 'NDRF Rescue Teams Dispatched', description: 'Battalion 09 aquatic rescue (45 personnel) deployed via high-elevation highway.', category: 'RESCUE', severity: 'HIGH', agentName: 'Rescue Agent' },
  { id: 'tl-5', timestamp: '2026-06-30T11:00:00Z', title: 'Emergency Rations Dispatched', description: '3,800 food ration packets dispatched to shelter nodes sh-1 and sh-2.', category: 'RESOURCE', severity: 'MEDIUM', agentName: 'Resource Allocation Agent' },
  { id: 'tl-6', timestamp: '2026-06-30T11:30:00Z', title: 'Citizen SOS Received', description: 'Family of 4 stranded on rooftop. Speedboat unit redirected. ETA: 12 minutes.', category: 'RESCUE', severity: 'CRITICAL', agentName: 'Citizen Assistance Agent' },
  { id: 'tl-7', timestamp: '2026-06-30T12:00:00Z', title: 'Blood Bank Critical Alert', description: 'Sadar District Hospital blood bank reserves depleted to critical levels.', category: 'MEDICAL', severity: 'HIGH', agentName: 'Healthcare Agent' },
  { id: 'tl-8', timestamp: '2026-06-30T12:30:00Z', title: 'Western Ghats Fire Detected', description: 'Satellite imagery confirms wildfire ignition along ridge line near Wayanad settlements.', category: 'DETECTION', severity: 'MEDIUM', agentName: 'Monitoring Agent' },
];

