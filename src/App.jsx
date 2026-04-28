import React, { useState, useEffect, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import MeshGrid from './components/MeshGrid';
import ComplexityPanel from './components/ComplexityPanel';
import { computeAllStates, initializeNodes } from './utils/shiftLogic';

/**
 * Main App Component
 * Orchestrates the application state and layout.
 */
function App() {
  // Application State
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [stage, setStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nodes, setNodes] = useState(() => initializeNodes(16));
  const [allStates, setAllStates] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    handleRun();
  }, []);

  const handleRun = () => {
    try {
      const states = computeAllStates(p, q);
      setAllStates(states);
      setNodes(states.initial);
      setStage(0);
      setIsAutoPlaying(false);
    } catch (error) {
      console.error("Computation error:", error);
    }
  };

  const handleReset = () => {
    const initial = initializeNodes(p);
    setNodes(initial);
    setStage(0);
    setAllStates(null);
    setIsAutoPlaying(false);
    setIsAnimating(false);
  };

  const handleStageChange = (newStage) => {
    if (!allStates) return;
    
    setIsAnimating(true);
    setStage(newStage);
    
    // Determine which state to show
    let nextNodes;
    if (newStage === 0) nextNodes = allStates.initial;
    else if (newStage === 1) nextNodes = allStates.afterStage1;
    else nextNodes = allStates.afterStage2;
    
    setNodes(nextNodes);
    
    // Animation duration match
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Auto-play logic
  useEffect(() => {
    let timeout;
    if (isAutoPlaying) {
      if (stage < 2) {
        timeout = setTimeout(() => {
          handleStageChange(stage + 1);
        }, 1500);
      } else {
        setIsAutoPlaying(false);
      }
    }
    return () => clearTimeout(timeout);
  }, [isAutoPlaying, stage]);

  const toggleAutoPlay = () => {
    if (stage === 2) {
      setStage(0);
      setNodes(allStates.initial);
      setTimeout(() => setIsAutoPlaying(true), 100);
    } else {
      setIsAutoPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col font-sans text-gray-200">
      {/* Modern Sticky Header */}
      <header className="sticky top-0 z-50 h-16 bg-[#111827]/80 backdrop-blur-md border-b border-gray-800 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            M
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Mesh Circular Shift Visualizer</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.1em] font-bold">System Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/f233027-droid/mesh-shift-visualizer/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 hover:border-gray-500"
          >
            <span className="text-sm font-medium">GitHub</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>
        </div>
      </header>

      {/* Main 3-Column Dashboard Layout */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-[22%_1fr_22%] gap-6 overflow-hidden">
        
        {/* Left Panel: Controls */}
        <aside className="space-y-6 overflow-y-auto no-scrollbar">
          <ControlPanel 
            p={p} 
            setP={setP} 
            q={q} 
            setQ={setQ} 
            onRun={handleRun} 
            onReset={handleReset} 
            isAnimating={isAnimating || isAutoPlaying} 
          />
        </aside>

        {/* Center Panel: Visualization Grid */}
        <section className="flex flex-col gap-6 min-w-0">
          <div className="flex-1 glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
             {/* Background Glows */}
             <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
             <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>

             <MeshGrid 
                nodes={nodes} 
                stage={stage} 
                p={p} 
                q={q} 
                isAnimating={isAnimating || isAutoPlaying} 
              />
          </div>

          {/* Step Navigation Bar */}
          <div className="flex justify-center">
            <div className="bg-[#111827] p-2 rounded-full border border-gray-800 shadow-2xl flex items-center gap-2">
              <button
                onClick={() => handleStageChange(0)}
                disabled={isAnimating || isAutoPlaying}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${stage === 0 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Initial
              </button>
              <button
                onClick={() => handleStageChange(1)}
                disabled={isAnimating || isAutoPlaying}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${stage === 1 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Stage 1
              </button>
              <button
                onClick={() => handleStageChange(2)}
                disabled={isAnimating || isAutoPlaying}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${stage === 2 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Stage 2
              </button>
              <div className="w-[1px] h-6 bg-gray-800 mx-2" />
              <button
                onClick={toggleAutoPlay}
                disabled={isAnimating || isAutoPlaying}
                className="px-8 py-2 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 disabled:bg-gray-700 disabled:text-gray-500"
              >
                {isAutoPlaying ? "Playing..." : "Auto Play"}
              </button>
            </div>
          </div>
        </section>

        {/* Right Panel: Analytics & Info */}
        <aside className="space-y-6 overflow-y-auto no-scrollbar">
          <ComplexityPanel p={p} q={q} />
        </aside>

      </main>
    </div>
  );
}

export default App;
