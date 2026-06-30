import React, { useState, useEffect } from 'react';
import { Truck, Package } from 'lucide-react';
import { db } from '../data/mockDatabase';
import type { Resource, ResourceAllocation } from '../data/seedData';

export const NgoDashboard: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [allocations, setAllocations] = useState<ResourceAllocation[]>(db.getAllocations());

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setResources(db.getResources());
      setAllocations(db.getAllocations());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">NGO Logistics & Relief Supply Chain</h2>
        <p className="text-slate-400 text-xs">Manage volunteer supply drop-offs, food reserves, clean water distribution, and canvas shelters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resource inventory */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-400" />
            Central Warehouses Stock Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map(res => {
              const usagePct = (res.totalQuantity - res.availableQuantity) / res.totalQuantity * 100;
              return (
                <div key={res.id} className="bg-slate-950 p-4.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-sm">{res.name}</h4>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {res.category}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Available:</span>
                    <span className="font-bold text-white font-mono">{res.availableQuantity.toLocaleString()} / {res.totalQuantity.toLocaleString()} {res.unit}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${usagePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Allocations */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Active Distribution Dispatches
          </h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {allocations.map(alloc => (
              <div key={alloc.id} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{alloc.resourceName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(alloc.allocatedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Qty: <b>{alloc.quantityAllocated}</b></span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider text-[9px]">
                    {alloc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NgoDashboard;
