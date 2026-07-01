import React from 'react';
import { ShieldAlert, Play, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnterConsole: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterConsole }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar */}
      <header className="px-8 py-6 border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
              AI RESQ <span className="text-[9px] bg-indigo-600 text-white font-semibold px-1.5 py-0.5 rounded">COMMAND</span>
            </h1>
          </div>
        </div>
        <button
          onClick={onEnterConsole}
          className="bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-all duration-150 flex items-center gap-2 cursor-pointer"
        >
          Access Command Console
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Autonomous Crisis Coordination Swarm
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none"
          >
            National AI Disaster Command Platform
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg leading-relaxed font-medium"
          >
            AI RESQ orchestrates specialized autonomous agents to detect weather hazards, allocate shelter capacities, dispatch ambulances, and calculate optimal escape routes in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex justify-center"
          >
            <button
              onClick={onEnterConsole}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-8 py-4 rounded-xl border border-indigo-700 hover:scale-105 transition-all duration-200 shadow-xl flex items-center gap-3 cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              Launch Emergency Simulation
            </button>
          </motion.div>
        </div>

        {/* Multi-Agent workflow animation */}
        <section className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 shadow-inner space-y-6">
          <h3 className="text-center font-bold text-sm text-slate-400 uppercase tracking-wider">
            Automated Collaboration Pipeline
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Weather Agent', desc: 'Detects hazard alerts & triggers coordinator flow.', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5' },
              { name: 'Shelter Agent', desc: 'Queries capacities and reroutes overflow.', color: 'border-pink-500/20 text-pink-400 bg-pink-500/5' },
              { name: 'Resource Agent', desc: 'Calculates inventory rations and distribution.', color: 'border-green-500/20 text-green-400 bg-green-500/5' },
              { name: 'Medical Agent', desc: 'Dispatches emergency ambulances.', color: 'border-red-500/20 text-red-400 bg-red-500/5' },
              { name: 'Rescue Agent', desc: 'Solves route safety & bypasses blockages.', color: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5' },
            ].map((agent, idx) => (
              <div key={idx} className={`p-4 rounded-xl border text-center space-y-2 flex flex-col justify-between ${agent.color}`}>
                <h4 className="font-bold text-xs">{agent.name}</h4>
                <p className="text-[10px] text-slate-500 leading-normal">{agent.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <h3 className="text-center text-xl font-bold tracking-tight text-white">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Telemetry Ingestion', desc: 'IoT sensors detect critical rainfall runoff or tectonic slip thresholds.' },
              { step: '02', title: 'Agent Consensus', desc: 'Specialized agents evaluate nearest shelters, hospital beds, and roads.' },
              { step: '03', title: 'Logistics Optimization', desc: 'Supplies are dispatched automatically based on population impact.' },
              { step: '04', title: 'Safe Route Dispatch', desc: 'NDRF squads deploy via optimized routes bypassing flooded zones.' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-3 relative bg-slate-900/20 p-5 rounded-xl border border-slate-900/60">
                <span className="text-2xl font-black text-indigo-500 font-mono">{item.step}</span>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Impact Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center space-y-1.5 shadow-lg">
            <h4 className="text-3xl font-black text-indigo-400 font-mono">78%</h4>
            <p className="text-xs text-slate-400 font-semibold">Response Time Reduction</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center space-y-1.5 shadow-lg">
            <h4 className="text-3xl font-black text-emerald-400 font-mono">98.4%</h4>
            <p className="text-xs text-slate-400 font-semibold">AI Decision Accuracy</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center space-y-1.5 shadow-lg">
            <h4 className="text-3xl font-black text-red-500 font-mono">14,500+</h4>
            <p className="text-xs text-slate-400 font-semibold">Distress Coordinates Routed</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-600">
        <p>Emergency Management Operations Platform © 2026. Made for Hackathon Demonstration.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
