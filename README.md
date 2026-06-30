# AI RESQ – Autonomous Multi-Agent Disaster Response Platform

AI RESQ is a government-grade disaster management dashboard that uses simulated **Agentic AI** and **Multi-Agent Systems** to monitor crises, plan evacuations, optimize hospital resources, and coordinate rescue routes dynamically.

## Key Features

1. **Multi-Agent Swarm Simulation**: Watch 11 autonomous agents (IoT Monitoring, Routing Solver, Medical Triage, Capacity Planner) coordinate live on a LangGraph-equivalent trace console.
2. **Interactive GIS Map**: Click on OpenStreetMap using Leaflet coordinates to report active hazard sectors. View circular safety perimeters and marker details.
3. **Role-Based Command Centers (RBAC)**: Real-time UI panels customized for:
   * Government Command Officers
   * Citizens (SOS broadcasts, local reports)
   * Volunteers (Skill directory, sign-up forms)
   * NGOs (Resource logistics, inventory management)
   * Hospitals (Bed statuses, ambulances)
4. **ChatGPT-Style Assistant**: Natural language bot with streaming context memory, quick prompts, and voice recognition options.

---

## Local Setup & Dev Server

### 1. Install Node.js Dependencies
From the root directory, run:
```bash
npm install
```

### 2. Launch Development Server
Boot up the Vite bundler:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## Database Implementation (PostgreSQL / Supabase)

To deploy the schema to your database cluster:
1. Open the included `schema.sql` file.
2. Execute the script within your PostgreSQL query command tool.
3. It installs the `postgis` spatial extensions, creates indexing constraints, and registers core database triggers.

---

## Technical Presentation & Slide Deck
View `presentation.md` in this directory to read the system design pitch slides.
