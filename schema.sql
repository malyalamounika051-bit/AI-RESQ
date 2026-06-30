-- ====================================================================
-- AI RESQ: Autonomous Disaster Management Platform - Database Schema
-- Target Database: PostgreSQL / Supabase
-- ====================================================================

-- Enable PostGIS extension for GIS data capabilities
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed basic roles
INSERT INTO roles (name, permissions) VALUES
('CITIZEN', '{"can_report_disaster": true, "can_request_help": true, "can_view_map": true, "can_access_chat": true}'),
('VOLUNTEER', '{"can_report_disaster": true, "can_request_help": true, "can_view_map": true, "can_access_chat": true, "can_update_status": true}'),
('NGO', '{"can_view_map": true, "can_allocate_resources": true, "can_view_analytics": true}'),
('HOSPITAL_STAFF', '{"can_update_beds": true, "can_manage_ambulances": true, "can_view_map": true}'),
('GOVERNMENT_OFFICER', '{"can_approve_plans": true, "can_broadcast_alerts": true, "can_deploy_teams": true, "can_view_all": true}'),
('ADMIN', '{"all_permissions": true}');

-- 2. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user email
CREATE INDEX idx_users_email ON users(email);

-- 3. Disasters table
CREATE TABLE disasters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('FLOOD', 'EARTHQUAKE', 'CYCLONE', 'WILDFIRE', 'LANDSLIDE', 'CHEMICAL_SPILL')),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CONTAINED', 'RESOLVED')),
    affected_population INTEGER DEFAULT 0,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update geometry column based on lat/lng
CREATE OR REPLACE FUNCTION update_disaster_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_disaster_geom
BEFORE INSERT OR UPDATE ON disasters
FOR EACH ROW EXECUTE FUNCTION update_disaster_geom();

-- 4. Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'SENT' CHECK (status IN ('DRAFT', 'SENT', 'CANCELLED')),
    broadcast_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Shelters table
CREATE TABLE shelters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    capacity INTEGER NOT NULL,
    occupancy INTEGER DEFAULT 0 CHECK (occupancy >= 0),
    food_stock_days INTEGER DEFAULT 0,
    water_stock_days INTEGER DEFAULT 0,
    power_backup BOOLEAN DEFAULT TRUE,
    medical_facility BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL', 'FULL', 'CLOSED', 'DAMAGED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_shelter_geom
BEFORE INSERT OR UPDATE ON shelters
FOR EACH ROW EXECUTE FUNCTION update_disaster_geom();

-- 6. Hospitals table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    icu_beds_total INTEGER NOT NULL,
    icu_beds_available INTEGER NOT NULL CHECK (icu_beds_available <= icu_beds_total),
    general_beds_total INTEGER NOT NULL,
    general_beds_available INTEGER NOT NULL CHECK (general_beds_available <= general_beds_total),
    ambulances_total INTEGER DEFAULT 0,
    ambulances_available INTEGER DEFAULT 0,
    doctors_on_duty INTEGER DEFAULT 0,
    blood_bank_status VARCHAR(50) DEFAULT 'NORMAL',
    status VARCHAR(20) DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL', 'OVERLOADED', 'DAMAGED')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_hospital_geom
BEFORE INSERT OR UPDATE ON hospitals
FOR EACH ROW EXECUTE FUNCTION update_disaster_geom();

-- 7. Resources inventory table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FOOD_WATER', 'MEDICAL', 'SHELTER_KIT', 'EQUIPMENT', 'VEHICLE', 'FUEL')),
    total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
    available_quantity INTEGER NOT NULL CHECK (available_quantity <= total_quantity),
    unit VARCHAR(20) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Resource Allocations
CREATE TABLE resource_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE RESTRICT,
    quantity_allocated INTEGER NOT NULL CHECK (quantity_allocated > 0),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DISPATCHED', 'DELIVERED', 'CANCELLED')),
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Rescue Teams
CREATE TABLE rescue_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    agency VARCHAR(100) NOT NULL, -- e.g., NDRF, Fire Dept, SDRF
    type VARCHAR(50) NOT NULL CHECK (type IN ('AERIAL', 'AQUATIC', 'GROUND_SEARCH', 'MEDICAL', 'HAZMAT')),
    members_count INTEGER NOT NULL CHECK (members_count > 0),
    contact_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'DEPLOYED', 'STANDBY', 'OFF_DUTY')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    current_assignment_id UUID REFERENCES disasters(id) ON DELETE SET NULL
);

CREATE TRIGGER trg_rescueteam_geom
BEFORE INSERT OR UPDATE ON rescue_teams
FOR EACH ROW EXECUTE FUNCTION update_disaster_geom();

-- 10. Volunteers table
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] NOT NULL,
    status VARCHAR(20) DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE_MISSION')),
    assigned_team_id UUID REFERENCES rescue_teams(id) ON DELETE SET NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. AI Agent Logs
CREATE TABLE ai_agent_logs (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g., 'EVACUATION_PLANNING', 'RISK_MONITORING'
    log_level VARCHAR(20) DEFAULT 'INFO' CHECK (log_level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'DECISION')),
    message TEXT NOT NULL,
    payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_agent_logs_agent ON ai_agent_logs(agent_name);
CREATE INDEX idx_ai_agent_logs_timestamp ON ai_agent_logs(timestamp);

-- 12. Reports table (Automated NGO/Gov summary reports)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    disaster_id UUID REFERENCES disasters(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('SITUATION_REPORT', 'RESOURCE_SUMMARY', 'CASUALTY_ANALYSIS', 'COMPLIANCE')),
    summary TEXT NOT NULL,
    content_json JSONB,
    generated_by VARCHAR(50) DEFAULT 'ReportingAgent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Conversations (Citizen Assistant memory)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) DEFAULT 'Emergency Support Chat',
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL' CHECK (type IN ('GENERAL', 'EVACUATION', 'ALERT', 'RESOURCE_ALLOCATION')),
    recipient_role VARCHAR(50), -- send to specific roles like 'VOLUNTEER' or 'CITIZEN' or NULL for all
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Spatial Indexes for GIS Queries
CREATE INDEX idx_disasters_geom ON disasters USING GIST(geom);
CREATE INDEX idx_shelters_geom ON shelters USING GIST(geom);
CREATE INDEX idx_hospitals_geom ON hospitals USING GIST(geom);
CREATE INDEX idx_rescue_teams_geom ON rescue_teams USING GIST(geom);
