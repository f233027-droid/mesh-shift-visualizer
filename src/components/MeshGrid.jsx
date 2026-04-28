import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSqrt } from '../utils/shiftLogic';

/**
 * MeshGrid Component
 * Visualizes the 2D mesh with modern tiles and smooth animations.
 */
const MeshGrid = ({ nodes, stage, p, q, isAnimating }) => {
  const s = getSqrt(p);
  
  // Dynamic grid configuration
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${s}, 1fr)`,
    gap: '16px',
  };

  const getNodeColorClass = (node) => {
    if (stage === 0) return 'node-gradient';
    if (stage === 1) return 'node-active';
    return 'node-completed';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const itemVariants = {
    initial: { scale: 0.9, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.9, opacity: 0 }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
          {stage === 0 ? "Initial Mesh" : stage === 1 ? "Stage 1: Row Shift" : "Stage 2: Final Result"}
        </h2>
        <p className="text-gray-500 text-xs mt-1 font-bold">GRID TOPOLOGY: {s} × {s} NODES</p>
      </div>

      <motion.div 
        style={gridStyle}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`${stage}-${p}`}
        className="relative z-10"
      >
        {nodes.map((node) => (
          <motion.div
            key={`${node.id}-${stage}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-[72px] h-[72px] rounded-2xl flex flex-col items-center justify-center relative shadow-lg border border-white/10 ${getNodeColorClass(node)}`}
          >
            {/* Node ID Label */}
            <span className="absolute top-2 left-2 text-[8px] font-black text-white/30 uppercase">
              ID {node.id}
            </span>

            {/* Data Value */}
            <span className="text-2xl font-bold text-white drop-shadow-md">
              {node.data}
            </span>

            {/* Stage indicator dot */}
            {stage > 0 && (
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MeshGrid;
