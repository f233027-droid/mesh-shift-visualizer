# Mesh Circular Shift Visualizer

## 🚀 Live Demo
[Live URL — https://mesh-shift-visualizer-eta.vercel.app/]

## 📋 Overview
The **Mesh Circular Shift Visualizer** is an educational tool designed to demonstrate the efficiency of 2D mesh topologies in parallel computing. It visualizes the **circular q-shift** operation, where data from node *i* is moved to node *(i + q) mod p*. By decomposing a global shift into structured row and column stages, the mesh topology significantly reduces the total communication hops compared to a simple ring network.

## 🧮 Algorithm
The circular q-shift is implemented in two parallelizable stages:

### Stage 1: Row Shift (Horizontal)
Each node shifts its data right by a specific number of positions within its current row.
- **Formula**: `rowShift = q mod √p`
- **Target Column**: `newCol = (currentCol + rowShift) mod √p`

### Stage 2: Column Shift (Vertical)
Each node shifts the data it received in Stage 1 down by a specific number of positions within its current column.
- **Formula**: `colShift = floor(q / √p)`
- **Target Row**: `newRow = (currentRow + colShift) mod √p`

### Worked Example (p=16, q=5)
- **Parameters**: `p=16` (4x4 mesh), `q=5`
- **Calculations**:
  - `√16 = 4`
  - `rowShift = 5 mod 4 = 1`
  - `colShift = floor(5 / 4) = 1`
- **Node 0's Journey**:
  - Initial: (Row 0, Col 0)
  - After Row Shift: (Row 0, Col 1) -> **Node 1**
  - After Column Shift: (Row 1, Col 1) -> **Node 5** (Final Destination)
  - *Verify*: `(0 + 5) mod 16 = 5`. ✓

## 🏗️ Project Structure
```text
mesh-shift-visualizer/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── MeshGrid.jsx        # Core grid rendering & Framer Motion animations
│   │   ├── ControlPanel.jsx    # User inputs with real-time validation
│   │   └── ComplexityPanel.jsx # Mathematical analysis & Recharts comparison
│   ├── utils/
│   │   └── shiftLogic.js       # Pure JS module for shift algorithms
│   ├── App.jsx             # Main application state & layout orchestration
│   └── main.jsx            # React entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration with Tailwind plugin
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── README.md               # Documentation
└── package.json            # Project dependencies
```

## ⚙️ Local Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/f233027-droid/mesh-shift-visualizer.git
   ```
2. **Navigate to the directory**:
   ```bash
   cd mesh-shift-visualizer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open in browser**:
   Navigate to `http://localhost:5173`

## 🚢 Deployment
To deploy this application to **Vercel**:
1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"New Project"**.
3. Import the repository.
4. Framework Preset: Select **Vite**.
5. Click **Deploy**.

## 📊 Complexity Analysis
Comparison of communication steps between **Ring** and **Mesh** topologies:

| p (Nodes) | q (Shift) | Ring Hops (`min(q, p-q)`) | Mesh Hops (`(q mod √p) + ⌊q/√p⌋`) |
|-----------|-----------|---------------------------|-----------------------------------|
| 16        | 3         | 3                         | 3                                 |
| 16        | 5         | 5                         | 2                                 |
| 16        | 7         | 7                         | 4                                 |
| 64        | 3         | 3                         | 3                                 |
| 64        | 5         | 5                         | 5                                 |
| 64        | 7         | 7                         | 2                                 |

*Note: Mesh topology excels when `q` is large relative to `√p`.*
