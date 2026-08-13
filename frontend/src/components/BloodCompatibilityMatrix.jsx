import React, { useState } from 'react';
import { Droplet, HeartHandshake, CheckCircle2, Info } from 'lucide-react';

const COMPATIBILITY_DATA = {
  'O-': {
    give: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    receive: ['O-'],
    note: 'Universal Blood Donor - Can be given to patients of any blood type in emergency situations.',
  },
  'O+': {
    give: ['O+', 'A+', 'B+', 'AB+'],
    receive: ['O+', 'O-'],
    note: 'Most common blood group. Can be given to any positive blood group.',
  },
  'A-': {
    give: ['A-', 'A+', 'AB-', 'AB+'],
    receive: ['A-', 'O-'],
    note: 'Can donate to any A or AB blood type.',
  },
  'A+': {
    give: ['A+', 'AB+'],
    receive: ['A+', 'A-', 'O+', 'O-'],
    note: 'Second most common blood type.',
  },
  'B-': {
    give: ['B-', 'B+', 'AB-', 'AB+'],
    receive: ['B-', 'O-'],
    note: 'Rare blood type. Highly valued by blood banks.',
  },
  'B+': {
    give: ['B+', 'AB+'],
    receive: ['B+', 'B-', 'O+', 'O-'],
    note: 'Can receive blood from B and O groups.',
  },
  'AB-': {
    give: ['AB-', 'AB+'],
    receive: ['AB-', 'A-', 'B-', 'O-'],
    note: 'Rarest blood type in the general population.',
  },
  'AB+': {
    give: ['AB+'],
    receive: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    note: 'Universal Plasma Donor & Universal Red Cell Recipient - Can receive blood from any group.',
  },
};

const BloodCompatibilityMatrix = () => {
  const [selectedGroup, setSelectedGroup] = useState('O-');
  const activeData = COMPATIBILITY_DATA[selectedGroup];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-4 h-4" />
            <span>Interactive Guide</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Blood Group Compatibility Matrix</h2>
          <p className="text-slate-500 text-sm mt-1">Select your blood group to see who you can donate blood to and receive blood from.</p>
        </div>

        {/* Blood Group Picker Pills */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(COMPATIBILITY_DATA).map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                selectedGroup === bg
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-700'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Group Highlight Panel */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-rose-600/30">
              {selectedGroup}
            </div>
            <div>
              <h3 className="font-bold text-lg">Type {selectedGroup} Compatibility</h3>
              <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                <Info className="w-3.5 h-3.5 text-rose-400" />
                <span>{activeData.note}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Can Donate To */}
          <div className="bg-white/10 p-4 rounded-xl space-y-2 backdrop-blur-md">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1">
              <Droplet className="w-4 h-4 text-rose-400 fill-current" />
              <span>Can Donate Blood To:</span>
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeData.give.map((target) => (
                <span
                  key={target}
                  className="px-2.5 py-1 bg-rose-500/30 border border-rose-400/40 text-white text-xs font-bold rounded-lg"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>

          {/* Can Receive From */}
          <div className="bg-white/10 p-4 rounded-xl space-y-2 backdrop-blur-md">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Can Receive Blood From:</span>
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeData.receive.map((source) => (
                <span
                  key={source}
                  className="px-2.5 py-1 bg-emerald-500/30 border border-emerald-400/40 text-white text-xs font-bold rounded-lg"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityMatrix;
