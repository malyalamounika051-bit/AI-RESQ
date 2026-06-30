import {
  INITIAL_DISASTERS,
  INITIAL_ALERTS,
  INITIAL_SHELTERS,
  INITIAL_HOSPITALS,
  INITIAL_RESOURCES,
  INITIAL_RESOURCE_ALLOCATIONS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_VOLUNTEERS,
  INITIAL_MISSING_PERSONS,
  INITIAL_SOS_SIGNALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMELINE_EVENTS,
  type Disaster,
  type Alert,
  type Shelter,
  type Hospital,
  type Resource,
  type ResourceAllocation,
  type RescueTeam,
  type Volunteer,
  type AgentLog,
  type MissingPerson,
  type SOSSignal,
  type Notification,
  type TimelineEvent
} from './seedData';

class MockDatabase {
  private disasters: Disaster[] = [...INITIAL_DISASTERS];
  private alerts: Alert[] = [...INITIAL_ALERTS];
  private shelters: Shelter[] = [...INITIAL_SHELTERS];
  private hospitals: Hospital[] = [...INITIAL_HOSPITALS];
  private resources: Resource[] = [...INITIAL_RESOURCES];
  private allocations: ResourceAllocation[] = [...INITIAL_RESOURCE_ALLOCATIONS];
  private teams: RescueTeam[] = [...INITIAL_RESCUE_TEAMS];
  private volunteers: Volunteer[] = [...INITIAL_VOLUNTEERS];
  private agentLogs: AgentLog[] = [];
  private missingPersons: MissingPerson[] = [...INITIAL_MISSING_PERSONS];
  private sosSignals: SOSSignal[] = [...INITIAL_SOS_SIGNALS];
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  private timelineEvents: TimelineEvent[] = [...INITIAL_TIMELINE_EVENTS];
  
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Add default initial logs
    this.addAgentLog('Monitoring Agent', 'SYSTEM_INIT', 'INFO', 'AI RESQ Autonomous Agents online and listening to IoT feeds.');
  }

  // Subscribe to changes
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Disasters
  getDisasters() { return this.disasters; }
  addDisaster(d: Omit<Disaster, 'id' | 'reportedAt'>) {
    const newDisaster: Disaster = {
      ...d,
      id: `dis-${Date.now()}`,
      reportedAt: new Date().toISOString()
    };
    this.disasters.unshift(newDisaster);
    this.notify();
    return newDisaster;
  }
  updateDisasterStatus(id: string, status: Disaster['status']) {
    this.disasters = this.disasters.map(d => d.id === id ? { ...d, status } : d);
    this.notify();
  }

  // Alerts
  getAlerts() { return this.alerts; }
  addAlert(disasterId: string, severity: Alert['severity'], message: string) {
    const alert: Alert = {
      id: `alt-${Date.now()}`,
      disasterId,
      severity,
      message,
      status: 'SENT',
      broadcastAt: new Date().toISOString()
    };
    this.alerts.unshift(alert);
    this.notify();
    return alert;
  }

  // Shelters
  getShelters() { return this.shelters; }
  updateShelterOccupancy(id: string, change: number) {
    this.shelters = this.shelters.map(s => {
      if (s.id === id) {
        const newOccupancy = Math.max(0, Math.min(s.capacity, s.occupancy + change));
        const status = newOccupancy >= s.capacity ? 'FULL' : 'OPERATIONAL';
        return { ...s, occupancy: newOccupancy, status };
      }
      return s;
    });
    this.notify();
  }

  // Hospitals
  getHospitals() { return this.hospitals; }
  updateHospitalBeds(id: string, icuAvailable: number, generalAvailable: number) {
    this.hospitals = this.hospitals.map(h => 
      h.id === id ? { ...h, icuBedsAvailable: icuAvailable, generalBedsAvailable: generalAvailable } : h
    );
    this.notify();
  }

  // Resources
  getResources() { return this.resources; }
  getAllocations() { return this.allocations; }
  allocateResource(disasterId: string, resourceId: string, qty: number) {
    const res = this.resources.find(r => r.id === resourceId);
    if (!res || res.availableQuantity < qty) return false;

    res.availableQuantity -= qty;
    const allocation: ResourceAllocation = {
      id: `alloc-${Date.now()}`,
      disasterId,
      resourceId,
      resourceName: res.name,
      quantityAllocated: qty,
      status: 'DISPATCHED',
      allocatedAt: new Date().toISOString()
    };
    this.allocations.unshift(allocation);
    this.notify();
    return true;
  }

  // Teams
  getRescueTeams() { return this.teams; }
  updateTeamLocation(id: string, lat: number, lng: number) {
    this.teams = this.teams.map(t => t.id === id ? { ...t, latitude: lat, longitude: lng } : t);
    this.notify();
  }
  deployTeam(id: string, disasterId: string) {
    this.teams = this.teams.map(t => 
      t.id === id ? { ...t, status: 'DEPLOYED', currentAssignmentId: disasterId } : t
    );
    this.notify();
  }

  // Volunteers
  getVolunteers() { return this.volunteers; }
  addVolunteer(v: Omit<Volunteer, 'id' | 'status'>) {
    const newVol: Volunteer = {
      ...v,
      id: `vol-${Date.now()}`,
      status: 'APPROVED'
    };
    this.volunteers.push(newVol);
    this.notify();
  }

  // Agent Logs
  getAgentLogs() { return this.agentLogs; }
  addAgentLog(agentName: string, actionType: string, level: AgentLog['level'], message: string, metadata?: any) {
    const newLog: AgentLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      agentName,
      actionType,
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
    this.agentLogs.unshift(newLog);
    this.notify();
  }
  clearLogs() {
    this.agentLogs = [];
    this.notify();
  }

  // Missing Persons
  getMissingPersons() { return this.missingPersons; }
  addMissingPerson(p: Omit<MissingPerson, 'id' | 'reportedAt' | 'status'>) {
    const newPerson: MissingPerson = {
      ...p,
      id: `mp-${Date.now()}`,
      status: 'MISSING',
      reportedAt: new Date().toISOString()
    };
    this.missingPersons.unshift(newPerson);
    this.addNotification('Missing Person Report', `${p.fullName} reported missing near ${p.lastSeenLocation}.`, 'ALERT');
    this.notify();
    return newPerson;
  }
  updateMissingPersonStatus(id: string, status: MissingPerson['status']) {
    this.missingPersons = this.missingPersons.map(p => p.id === id ? { ...p, status } : p);
    this.notify();
  }

  // SOS Signals
  getSOSSignals() { return this.sosSignals; }
  addSOSSignal(citizenName: string, lat: number, lng: number, message: string, urgency: SOSSignal['urgency'] = 'CRITICAL') {
    const signal: SOSSignal = {
      id: `sos-${Date.now()}`,
      citizenName,
      latitude: lat,
      longitude: lng,
      message,
      urgency,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };
    this.sosSignals.unshift(signal);
    this.addNotification('🚨 SOS Signal Received', `${citizenName}: ${message}`, 'SOS');
    this.addTimelineEvent('Citizen SOS Received', message, 'RESCUE', urgency === 'CRITICAL' ? 'CRITICAL' : 'HIGH', 'Citizen Assistance Agent');
    this.notify();
    return signal;
  }
  updateSOSStatus(id: string, status: SOSSignal['status']) {
    this.sosSignals = this.sosSignals.map(s => s.id === id ? { ...s, status } : s);
    this.notify();
  }

  // Notifications
  getNotifications() { return this.notifications; }
  addNotification(title: string, message: string, type: Notification['type'] = 'INFO') {
    const notif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    this.notify();
    return notif;
  }
  markNotificationRead(id: string) {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.notify();
  }
  markAllNotificationsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.notify();
  }
  getUnreadCount() { return this.notifications.filter(n => !n.isRead).length; }

  // Timeline
  getTimelineEvents() { return this.timelineEvents; }
  addTimelineEvent(title: string, description: string, category: TimelineEvent['category'], severity: TimelineEvent['severity'], agentName?: string) {
    const event: TimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      description,
      category,
      severity,
      agentName
    };
    this.timelineEvents.unshift(event);
    this.notify();
    return event;
  }
}

export const db = new MockDatabase();
export default db;
