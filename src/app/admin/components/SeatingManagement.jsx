"use client"

import { useState } from "react"
import { 
  Armchair, PlusCircle, ArrowUpCircle, ArrowDownCircle, 
  Wrench, ShieldCheck, Gem, LayoutGrid, Save, Layers, Tv
} from "lucide-react"

export default function SeatingManagement() {
  // 1. Initial High-Density Configuration Matrix State for Active Screens
  const [activeScreen, setActiveScreen] = useState("Screen 01")
  
  // Custom Abstract Layout Topology Matrix state
  const [layout, setLayout] = useState({
    rows: ["A", "B", "C", "D"], // Front to Back
    seatsByRow: {
      A: Array.from({ length: 8 }, (_, i) => ({ id: `A${i+1}`, type: "Normal", status: "Operational" })),
      B: Array.from({ length: 10 }, (_, i) => ({ id: `B${i+1}`, type: "Normal", status: "Operational" })),
      C: Array.from({ length: 10 }, (_, i) => ({ id: `C${i+1}`, type: "VIP Recliner", status: "Operational" })),
      D: Array.from({ length: 10 }, (_, i) => ({ id: `D${i+1}`, type: "VIP Recliner", status: "Damaged" }))
    }
  })

  // Selected tool modifier configuration state
  const [selectedTool, setSelectedTool] = useState("toggle-damaged") // toggle-damaged, toggle-vip

  // --- SEAT MATRIX MODIFICATION FUNCTIONS ---
  const handleSeatClick = (row, index) => {
    const updatedSeats = [...layout.seatsByRow[row]]
    const targetSeat = { ...updatedSeats[index] }

    if (selectedTool === "toggle-damaged") {
      targetSeat.status = targetSeat.status === "Operational" ? "Damaged" : "Operational"
    } else if (selectedTool === "toggle-vip") {
      targetSeat.type = targetSeat.type === "Normal" ? "VIP Recliner" : "Normal"
    }

    updatedSeats[index] = targetSeat
    setLayout({
      ...layout,
      seatsByRow: { ...layout.seatsByRow, [row]: updatedSeats }
    })
  }

  // Add individual seat node to specific row layout string bounds
  const appendSeatToRow = (row) => {
    const nextNumber = layout.seatsByRow[row].length + 1
    const newSeat = {
      id: `${row}${nextNumber}`,
      type: "Normal",
      status: "Operational"
    }
    setLayout({
      ...layout,
      seatsByRow: {
        ...layout.seatsByRow,
        [row]: [...layout.seatsByRow[row], newSeat]
      }
    })
  }

  // Inject a complete new row vector to either the FRONT or BACK of layout stack
  const addWholeNewRow = (position) => {
    const availableLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    let nextLetter = "A"

    if (position === "front") {
      // Find a letter before the first current row letter
      const firstActiveChar = layout.rows[0]
      const index = availableLetters.indexOf(firstActiveChar)
      nextLetter = index > 0 ? availableLetters[index - 1] : `Z${Date.now().toString().slice(-2)}`
    } else {
      // Find a letter after the last current row letter
      const lastActiveChar = layout.rows[layout.rows.length - 1]
      const index = availableLetters.indexOf(lastActiveChar)
      nextLetter = index < 25 ? availableLetters[index + 1] : `X${Date.now().toString().slice(-2)}`
    }

    // Default configuration template row layout
    const newRowSeats = Array.from({ length: 8 }, (_, i) => ({
      id: `${nextLetter}${i+1}`,
      type: "Normal",
      status: "Operational"
    }))

    const newRowsOrder = position === "front" 
      ? [nextLetter, ...layout.rows]
      : [...layout.rows, nextLetter]

    setLayout({
      rows: newRowsOrder,
      seatsByRow: {
        ...layout.seatsByRow,
        [nextLetter]: newRowSeats
      }
    })
  }

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      
      {/* Topology Header Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        
        {/* Left: Active Screen Picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Auditorium Screen Matrix</label>
          <div className="flex gap-1.5 bg-input p-1 rounded-xl border border-border">
            {["Screen 01", "Screen 02", "Screen 03"].map((screen) => (
              <button
                key={screen}
                onClick={() => setActiveScreen(screen)}
                className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeScreen === screen 
                    ? "bg-brand-lime text-black font-black" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {screen.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Tool Brush Selection Toggles */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Interactive Modification Tool</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTool("toggle-damaged")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                selectedTool === "toggle-damaged"
                  ? "bg-red-500/10 border-red-500/40 text-red-400"
                  : "bg-input border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wrench size={13} /> Edit Health Status
            </button>
            <button
              onClick={() => setSelectedTool("toggle-vip")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                selectedTool === "toggle-vip"
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                  : "bg-input border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gem size={13} /> Edit Tier Tiering
            </button>
          </div>
        </div>

        {/* Right: Abstract Global Structural Appending Actions */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Global Row Operations</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addWholeNewRow("front")}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-input hover:bg-foreground/[0.04] border border-border text-xs font-bold rounded-xl text-foreground transition-all"
            >
              <ArrowUpCircle size={13} className="text-brand-lime" /> + Row Front
            </button>
            <button
              onClick={() => addWholeNewRow("back")}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-input hover:bg-foreground/[0.04] border border-border text-xs font-bold rounded-xl text-foreground transition-all"
            >
              <ArrowDownCircle size={13} className="text-brand-lime" /> + Row Back
            </button>
          </div>
        </div>

      </div>

      {/* AUDITORIUM MAP INTERACTIVE WORKSPACE CANVAS */}
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-xs">
        
        {/* Curvaceous Silver Screen Layout Marker */}
        <div className="relative w-full max-w-lg mx-auto text-center pb-8">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-brand-lime/30 to-transparent rounded-full blur-xs" />
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-1" />
          <span className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/30 block mt-2">Projection Screen Layout Alignment Focus</span>
        </div>

        {/* High-Fidelity Alphanumeric Auditorium Matrix Map Loop */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {layout.rows.map((rowName) => (
            <div key={rowName} className="flex items-center justify-between gap-4 p-2 bg-input/20 border border-border/40 rounded-xl hover:border-border/90 transition-all group">
              
              {/* Left Identity Handle Label Node */}
              <div className="flex items-center gap-2 w-10 select-none">
                <span className="text-xs font-black font-mono text-muted-foreground">{rowName}</span>
                <span className="text-[9px] font-mono px-1 bg-input rounded text-muted-foreground/50 border border-border/60">
                  {layout.seatsByRow[rowName]?.length}
                </span>
              </div>

              {/* Dynamic Interactive Seat Button Grid Row Node */}
              <div className="flex-1 flex flex-wrap gap-1.5 items-center justify-start px-2">
                {layout.seatsByRow[rowName]?.map((seat, idx) => {
                  const isDamaged = seat.status === "Damaged"
                  const isVip = seat.type === "VIP Recliner"
                  
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(rowName, idx)}
                      className={`h-8 w-8 rounded-lg text-[9px] font-mono font-bold flex flex-col items-center justify-center border transition-all shadow-xs relative group/seat ${
                        isDamaged
                          ? "bg-red-500/20 border-red-500/50 text-red-400 font-black animate-pulse"
                          : isVip
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-black"
                          : "bg-input border-border text-foreground hover:border-brand-lime/40"
                      }`}
                      title={`Seat ID: ${seat.id} | Type: ${seat.type} | Status: ${seat.status}`}
                    >
                      <Armchair size={10} className={isDamaged ? "text-red-400" : isVip ? "text-amber-400" : "text-muted-foreground/40"} />
                      <span className="text-[8px] mt-0.5 leading-none">{idx + 1}</span>
                    </button>
                  )
                })}
              </div>

              {/* Append Column Action Trigger Node per row */}
              <button
                onClick={() => appendSeatToRow(rowName)}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-brand-lime hover:underline font-black uppercase tracking-wider transition-opacity whitespace-nowrap pr-2"
                title={`Append trailing seat node onto execution layout row ${rowName}`}
              >
                <PlusCircle size={12} /> + Seat
              </button>

            </div>
          ))}
        </div>

        {/* Map Topology Classification Color Coding Guide Grid Footer */}
        <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[10px] font-semibold text-muted-foreground font-mono select-none">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-input border border-border block" />
              <span>Normal Standard Seat (Operational)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center"><Gem size={8}/></span>
              <span>VIP Recliner Seat ($ Premium Tier)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50 block animate-pulse" />
              <span className="text-red-400 font-bold">Damaged Node (Offline / Red)</span>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-brand-lime block">
            Click seats to edit based on active modification tool selection profile
          </span>
        </div>

      </div>
    </div>
  )
}