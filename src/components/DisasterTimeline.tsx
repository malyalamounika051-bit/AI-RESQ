import React, { useState, useEffect } from 'react';
import { db } from '../data/mockDatabase';
import type { TimelineEvent } from '../data/seedData';
import { Clock, Filter, Radio, Heart, Package, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DisasterTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(db.getTimelineEvents());
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setEvents(db.getTimelineEvents());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'DETECTION': return <Radio className="w-4 h-4 text-blue-400" />;
      case 'EVACUATION': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'RESCUE': return <Heart className="w-4 h-4 text-red-500" />;
      case 'MEDICAL': return <Heart className="w-4 h-4 text-pink-400" />;
      case 'RESOURCE': return <Package className="w-4 h-4 text-green-400" />;
      case 'RESOLVED': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: TimelineEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-emerald-500';
    }
  };

  const getCategoryColor = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'DETECTION': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'EVACUATION': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'RESCUE': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'MEDICAL': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'RESOURCE': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const filteredEvents = events.filter(e => activeCategory === 'ALL' || e.category === activeCategory);

  const categories = ['ALL', 'DETECTION', 'EVACUATION', 'RESCUE', 'MEDICAL', 'RESOURCE', 'RESOLVED'];

  return (
    <div className="h-[calc(100vh-5rem)] p-8 bg-slate-950 text-slate-100 overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-500" />
          Autonomous Action Timeline
        </h2>
        <p className="text-slate-400 text-xs">A comprehensive timeline tracing the detection, planning, resource mapping, and rescue status updates.</p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2 items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" />
          Filter Timeline:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all duration-150 font-semibold ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                : 'bg-slate-850 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline Grid */}
      <div className="max-w-3xl mx-auto relative border-l-2 border-slate-800 pl-8 space-y-8 py-2">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-xs font-mono">
            No events registered in timeline directory.
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="relative space-y-2">
              {/* Event Dot */}
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <span className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)} ${
                  event.severity === 'CRITICAL' ? 'animate-ping' : ''
                }`} />
              </div>

              {/* Card Container */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-800 border border-slate-700">
                      {getCategoryIcon(event.category)}
                    </span>
                    <h4 className="font-bold text-white text-sm leading-tight">{event.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] items-center">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {event.description}
                </p>

                {event.agentName && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Orchestrator:</span>
                    <span className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
                      {event.agentName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisasterTimeline;
