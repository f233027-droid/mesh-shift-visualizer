import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getRowShift, getColShift, getMeshSteps, getRingSteps, getSqrt } from '../utils/shiftLogic';

/**
 * ComplexityPanel Component
 * Displays analytical cards, charts, and complexity data.
 */
const ComplexityPanel = ({ p, q }) => {
  const isPerfectSquare = Number.isInteger(Math.sqrt(p)) && p >= 4;
  
  const rowShift = isPerfectSquare ? getRowShift(q, p) : 0;
  const colShift = isPerfectSquare ? getColShift(q, p) : 0;
  const meshSteps = isPerfectSquare ? getMeshSteps(q, p) : 0;
  const ringSteps = isPerfectSquare ? getRingSteps(q, p) : 0;
  const stepDiff = ringSteps - meshSteps;

  const chartData = [
    { name: 'Ring', steps: ringSteps, color: '#EF4444' },
    { name: 'Mesh', steps: meshSteps, color: '#3B82F6' }
  ];

  const tableConfigs = [
    { tp: 16, tq: 3 },
    { tp: 16, tq: 7 },
    { tp: 64, tq: 5 },
    { tp: 64, tq: 7 },
  ];

  const tableData = tableConfigs.map(config => ({
    ...config,
    ring: getRingSteps(config.tq, config.tp),
    mesh: getMeshSteps(config.tq, config.tp),
    isCurrent: config.tp === p && config.tq === q
  }));

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-1">Performance Analytics</h2>
        <p className="text-gray-400 text-xs">Algorithmic complexity comparison</p>
      </div>

      {/* Shift Breakdown Card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-200">Shift Breakdown</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Formula Info</span>
            <span className="text-blue-400 font-mono font-bold">(i + {q}) mod {p}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Row Steps</span>
            <span className="text-orange-400 font-mono font-bold">{rowShift}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Col Steps</span>
            <span className="text-green-400 font-mono font-bold">{colShift}</span>
          </div>
          <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-200">Total Mesh Steps</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black">{meshSteps}</span>
          </div>
        </div>
      </div>

      {/* Comparison Chart Card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-200">Step Comparison</h3>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', fontSize: '12px' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Bar dataKey="steps" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complexity Table Card */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-gray-800">
           <h3 className="text-sm font-semibold text-gray-200">Complexity Matrix</h3>
        </div>
        <table className="w-full text-[11px] text-left">
          <thead className="bg-gray-900/50 text-gray-500 font-bold uppercase tracking-widest">
            <tr>
              <th className="px-4 py-3">P</th>
              <th className="px-4 py-3">Q</th>
              <th className="px-4 py-3">Ring</th>
              <th className="px-4 py-3">Mesh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {tableData.map((row, idx) => (
              <tr key={idx} className={`${row.isCurrent ? 'bg-blue-600/10' : ''} hover:bg-gray-800/30 transition-colors`}>
                <td className="px-4 py-3 text-gray-300">{row.tp}</td>
                <td className="px-4 py-3 text-gray-300">{row.tq}</td>
                <td className="px-4 py-3 text-red-400 font-bold">{row.ring}</td>
                <td className="px-4 py-3 text-blue-400 font-bold">{row.mesh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation Card */}
      <div className="glass-card p-5">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="text-gray-300 font-bold block mb-1">Architectural Insight</span>
          Mesh networks reduce communication overhead by decomposing shifts into parallel horizontal and vertical stages, exploiting the √P physical distance optimization.
        </p>
      </div>
    </div>
  );
};

export default ComplexityPanel;
