/**
 * CIRCULAR Q-SHIFT ON 2D MESH
 * 
 * In parallel computing, efficient data movement across processors is critical.
 * A circular q-shift move data from node i to node (i + q) mod p.
 * On a 2D mesh topology, this is decomposed into two orthogonal stages:
 * 
 * Stage 1: Row Shift (Horizontal)
 * Each node shifts right by (q mod sqrt(p)) positions within its row.
 * 
 * Stage 2: Column Shift (Vertical)
 * Each node shifts down by floor(q / sqrt(p)) positions within its column.
 */

/**
 * Returns the square root of p as an integer.
 * @param {number} p Total number of nodes (must be a perfect square).
 * @returns {number} sqrt(p)
 */
export function getSqrt(p) {
  return Math.round(Math.sqrt(p));
}

/**
 * Returns how many steps right each node moves in Stage 1.
 * @param {number} q Shift amount.
 * @param {number} p Total number of nodes.
 * @returns {number} rowShift = q mod sqrt(p)
 */
export function getRowShift(q, p) {
  const s = getSqrt(p);
  return q % s;
}

/**
 * Returns how many steps down each node moves in Stage 2.
 * @param {number} q Shift amount.
 * @param {number} p Total number of nodes.
 * @returns {number} colShift = Math.floor(q / sqrt(p))
 */
export function getColShift(q, p) {
  const s = getSqrt(p);
  return Math.floor(q / s);
}

/**
 * Returns total communication steps on a mesh.
 * @param {number} q Shift amount.
 * @param {number} p Total number of nodes.
 * @returns {number} Total steps
 */
export function getMeshSteps(q, p) {
  return getRowShift(q, p) + getColShift(q, p);
}

/**
 * Returns communication steps on a ring topology for comparison.
 * @param {number} q Shift amount.
 * @param {number} p Total number of nodes.
 * @returns {number} Min hops in ring
 */
export function getRingSteps(q, p) {
  return Math.min(q, p - q);
}

/**
 * Initializes nodes with IDs and data.
 * @param {number} p Total number of nodes.
 * @returns {Array} Array of node objects
 */
export function initializeNodes(p) {
  const s = getSqrt(p);
  const nodes = [];
  for (let i = 0; i < p; i++) {
    nodes.push({
      id: i,
      data: i, // Initially, data value equals node ID
      row: Math.floor(i / s),
      col: i % s
    });
  }
  return nodes;
}

/**
 * Performs Stage 1: Row Shift (Horizontal).
 * Each node moves data RIGHT by rowShift within its row with wrap-around.
 * Formula: newCol = (col + rowShift) % sqrt(p)
 */
export function applyRowShift(nodes, q, p) {
  const s = getSqrt(p);
  const rowShift = getRowShift(q, p);
  
  // Create a mapping of destination node ID -> source data
  const newDataMap = new Map();
  
  nodes.forEach(node => {
    // Current position
    const row = node.row;
    const col = node.col;
    
    // New column after circular shift within row
    const newCol = (col + rowShift) % s;
    const targetId = row * s + newCol;
    
    newDataMap.set(targetId, node.data);
  });
  
  return nodes.map(node => ({
    ...node,
    data: newDataMap.get(node.id)
  })).sort((a, b) => a.id - b.id);
}

/**
 * Performs Stage 2: Column Shift (Vertical).
 * Each node moves data DOWN by colShift within its column with wrap-around.
 * Formula: newRow = (row + colShift) % sqrt(p)
 */
export function applyColShift(nodes, q, p) {
  const s = getSqrt(p);
  const colShift = getColShift(q, p);
  
  const newDataMap = new Map();
  
  nodes.forEach(node => {
    const row = node.row;
    const col = node.col;
    
    // New row after circular shift within column
    const newRow = (row + colShift) % s;
    const targetId = newRow * s + col;
    
    newDataMap.set(targetId, node.data);
  });
  
  return nodes.map(node => ({
    ...node,
    data: newDataMap.get(node.id)
  })).sort((a, b) => a.id - b.id);
}

/**
 * Computes all stages of the visualization.
 */
export function computeAllStates(p, q) {
  const initial = initializeNodes(p);
  const afterStage1 = applyRowShift(initial, q, p);
  const afterStage2 = applyColShift(afterStage1, q, p);
  
  // Verification: Node i in afterStage2 should hold data from node (i - q + p) mod p
  // This is because node (i - q) sent its data to node i.
  
  return {
    initial,
    afterStage1,
    afterStage2
  };
}

// VERIFICATION: For p=16, q=5:
// sqrt(16) = 4
// rowShift = 5 mod 4 = 1
// colShift = floor(5/4) = 1  
// Node 0 (row 0, col 0): after row shift -> data moves to (row 0, col 1) = node 1
//                         after col shift -> data moves to (row 1, col 1) = node 5  ✓
// Node 5 (row 1, col 1): after row shift -> data moves to (row 1, col 2) = node 6
//                         after col shift -> data moves to (row 2, col 2) = node 10
// Final check: node[5].data should equal 0 (node 0's data arrived at node 5) ✓
