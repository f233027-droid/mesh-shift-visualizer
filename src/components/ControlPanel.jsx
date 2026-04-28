import React, { useMemo } from 'react';
import { getRowShift, getColShift, getSqrt } from '../utils/shiftLogic';

/**
 * ControlPanel Component
 * Handles user inputs for topology size (p) and shift amount (q).
 * Redesigned with card-based blocks and modern inputs.
 */
const ControlPanel = ({ p, setP, q, setQ, onRun, onReset, isAnimating }) => {
  const isPerfectSquare = Number.isInteger(Math.sqrt(p)) && p >= 4 && p <= 64;
  const isQValid = q >= 1 && q < p;
  const isValid = isPerfectSquare && isQValid;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-1">Simulation Controls</h2>
        <p className="text-gray-400 text-xs">Configure your mesh network parameters</p>
      </div>

      {/* Node Configuration Card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-200">Network Size</h3>
        </div>
        
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Number of Nodes (p)
          </label>
          <div className="relative">
            <input
              type="number"
              value={p}
              onChange={(e) => setP(parseInt(e.target.value) || 0)}
              className={`w-full h-11 bg-gray-900 border ${isPerfectSquare ? 'border-gray-800' : 'border-red-500/50'} rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              disabled={isAnimating}
            />
            {isPerfectSquare && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-xs">✓</span>}
          </div>
          {!isPerfectSquare && (
            <p className="text-red-400 text-[10px] font-medium">Use a perfect square: 4, 9, 16, 25, 36, 49, 64</p>
          )}
        </div>
      </div>

      {/* Shift Parameter Card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-200">Shift Logic</h3>
        </div>
        
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Shift Amount (q)
          </label>
          <div className="relative">
            <input
              type="number"
              value={q}
              onChange={(e) => setQ(parseInt(e.target.value) || 0)}
              className={`w-full h-11 bg-gray-900 border ${isQValid ? 'border-gray-800' : 'border-red-500/50'} rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              disabled={isAnimating}
            />
            {isQValid && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-xs">✓</span>}
          </div>
          {!isQValid && (
            <p className="text-red-400 text-[10px] font-medium">Value must be between 1 and {p-1}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onRun}
          disabled={!isValid || isAnimating}
          className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-blue-900/20 glow-blue cursor-pointer"
        >
          Run Simulation
        </button>
        <button
          onClick={onReset}
          className="w-full h-11 bg-transparent hover:bg-gray-800 border border-gray-700 text-gray-300 font-bold rounded-xl transition-all cursor-pointer"
        >
          Reset Environment
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
