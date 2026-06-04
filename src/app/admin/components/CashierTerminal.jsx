"use client"

import { useState, useEffect } from "react"
import { Film, Calendar, Armchair, Ticket, Printer, X, ArrowRight, CheckCircle2 } from "lucide-react"

// ==========================================================
// HIGH-PERFORMANCE HALFTONE PROCESSING ENGINE (HOOK)
// ==========================================================
function useHalftoneImage(imageUrl) {
  const [halftoneDataUrl, setHalftoneDataUrl] = useState("")

  useEffect(() => {
    if (!imageUrl) {
      setHalftoneDataUrl("")
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      
      const targetWidth = 600
      const scaleFactor = targetWidth / img.width
      const targetHeight = img.height * scaleFactor

      canvas.width = targetWidth
      canvas.height = targetHeight

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      
      try {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight)
        const pixels = imgData.data

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, targetWidth, targetHeight)
        ctx.fillStyle = "#000000"

        const dotSpacing = 5

        for (let y = 0; y < targetHeight; y += dotSpacing) {
          for (let x = 0; x < targetWidth; x += dotSpacing) {
            const index = (y * targetWidth + x) * 4
            const r = pixels[index]
            const g = pixels[index + 1]
            const b = pixels[index + 2]

            const brightness = 0.299 * r + 0.587 * g + 0.114 * b
            const darknessRatio = 1 - brightness / 255

            if (darknessRatio > 0.05) {
              const maxRadius = dotSpacing * 0.7
              const radius = maxRadius * darknessRatio

              ctx.beginPath()
              ctx.arc(x + dotSpacing / 2, y + dotSpacing / 2, radius, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }

        setHalftoneDataUrl(canvas.toDataURL("image/png"))
      } catch (error) {
        console.error("Halftone computation failed: Falling back to standard image layout.", error)
        setHalftoneDataUrl(imageUrl)
      }
    }

    img.onerror = () => {
      console.error("Could not load image source framework.")
    }
  }, [imageUrl])

  return halftoneDataUrl
}

export default function CashierTerminal() {
  // 1. Step Workflow Engine State
  const [step, setStep] = useState(1) 
  const [isPrinting, setIsPrinting] = useState(false) 
  
  // 2. Selection Trackers
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  // 3. Mock Database Store Matrices
  const movies = [
    { 
      id: "m1", 
      title: "Dune: Part Two", 
      genre: "Sci-Fi", 
      duration: "166 min", 
      poster: "🎬",
      dbCoverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80" 
    },
    { 
      id: "m2", 
      title: "Interstellar", 
      genre: "Sci-Fi", 
      duration: "169 min", 
      poster: "🚀",
      dbCoverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" 
    },
    { 
      id: "m3", 
      title: "Everything Everywhere All at Once", 
      genre: "Action", 
      duration: "139 min", 
      poster: "🌀",
      dbCoverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80" 
    }
  ]

  const showtimes = [
    { id: "s1", time: "02:30 PM", screen: "Screen 01", priceNormal: 12.00, priceVip: 20.00 },
    { id: "s2", time: "06:00 PM", screen: "Screen 01", priceNormal: 14.00, priceVip: 22.00 },
    { id: "s3", time: "09:30 PM", screen: "Screen 02", priceNormal: 15.00, priceVip: 25.00 }
  ]

  const seatingLayout = {
    rows: ["A", "B", "C", "D"],
    seatsByRow: {
      A: Array.from({ length: 8 }, (_, i) => ({ id: `A${i+1}`, type: "Normal", status: "Operational" })),
      B: Array.from({ length: 10 }, (_, i) => ({ id: `B${i+1}`, type: "Normal", status: "Operational" })),
      C: Array.from({ length: 10 }, (_, i) => ({ id: `C${i+1}`, type: "VIP Recliner", status: "Operational" })),
      D: Array.from({ length: 10 }, (_, i) => ({ id: `D${i+1}`, type: "VIP Recliner", status: "Damaged" }))
    }
  }

  // Bind dynamic halftone engine to current background selection
  const finalHalftoneCover = useHalftoneImage(selectedMovie?.dbCoverUrl)

  // --- BUSINESS LOGIC FUNCTIONS ---
  const toggleSeatSelection = (seat) => {
    if (seat.status === "Damaged") return
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))
    } else {
      const seatPrice = seat.type === "VIP Recliner" ? selectedShowtime.priceVip : selectedShowtime.priceNormal
      setSelectedSeats([...selectedSeats, { ...seat, price: seatPrice }])
    }
  }

  const calculateTotalCost = () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  const triggerSystemPrint = () => {
    setIsPrinting(true)
    setTimeout(() => { window.print() }, 250)
  }

  const resetTerminal = () => {
    setSelectedMovie(null)
    setSelectedShowtime(null)
    setSelectedSeats([])
    setStep(1)
    setIsPrinting(false)
  }

  // Pure clean-up listener for print execution lifecycle states
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false)
    }
    window.addEventListener("afterprint", handleAfterPrint)
    return () => window.removeEventListener("afterprint", handleAfterPrint)
  }, [])

  // ==========================================================
  // HARDWARE CRITICAL: ISOLATED RATIO OVERRIDE RENDER PORTAL
  // ==========================================================
  if (isPrinting && selectedMovie && selectedShowtime && selectedSeats.length > 0) {
    return (
      <div className="absolute inset-0 bg-white text-black min-h-screen w-full z-[999999] p-0 m-0 print-portal-root">
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{__html: `
          @page { 
            margin: 0; 
            size: 115mm 297mm; 
          }

          @media print {
            body * {
              visibility: hidden !important;
            }
            .print-portal-root, .print-portal-root * {
              visibility: visible !important;
            }
            .print-portal-root {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: #ffffff !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }

          html, body { 
            background: #ffffff !important; 
            color: #000000 !important; 
            overflow: visible !important; 
            height: auto !important; 
            margin: 0 !important;
            padding: 0 !important;
          }

          .ticket-page-break { 
            page-break-after: always !important; 
            break-after: page !important; 
            display: flex !important; 
          }
          
          .boarding-canvas, .boarding-canvas * {
            font-family: 'Share Tech Mono', monospace !important;
            text-transform: uppercase !important;
            box-sizing: border-box;
            letter-spacing: 0.02em;
          }
        `}} />

        {selectedSeats.map((seat, index) => {
          const uniquePassToken = `ML-${selectedShowtime.id}-${seat.id}`
          const currentDateStr = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })

          return (
            <div 
              key={seat.id} 
              className="ticket-page-break bg-white text-black mx-auto select-none boarding-canvas flex-col items-stretch border-[2px] border-black"
              style={{ width: "115mm", height: "297mm", backgroundColor: "#f2f2f2" }}
            >
              {/* 1. TOP SECTION: SOLID SPINE BLACK BANNER + COMPUTED HALFTONE PHOTO */}
              <div className="h-[28%] bg-black text-white relative flex flex-col justify-between p-4 border-b-2 border-black overflow-hidden">
                {finalHalftoneCover && (
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={finalHalftoneCover} 
                      alt="Halftone Manifest" 
                      className="w-full h-full object-cover mix-blend-lighten"
                      style={{ opacity: 0.85 }}
                    />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-5" />

                <div className="relative z-10 flex justify-between items-center text-[11px] tracking-wider text-zinc-300 font-bold">
                  <div>MAXLIGHT CINEMAS // FILMPASS</div>
                  <div>NO. {index + 1}/{selectedSeats.length}</div>
                </div>

                <div className="relative z-10 bg-black/80 p-2 border-l-4 border-white mt-auto">
                  <h2 className="text-xl tracking-wide leading-none font-bold text-white">{selectedMovie.title}</h2>
                  <span className="text-[9px] text-zinc-400 block mt-1 tracking-widest">ADMISSION FRAMEWORK DIRECTIVE</span>
                </div>
              </div>

              {/* 2. MIDDLE SECTION: MAIN HIGH-CONTRAST MANIFEST DATA */}
              <div className="h-[44%] p-5 flex flex-col justify-between border-b-2 border-dashed border-zinc-400 relative">
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">THEATER VENUE</span>
                    <span className="text-sm font-bold text-black">{selectedShowtime.screen}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">CATALOG TOKEN</span>
                    <span className="text-sm font-bold text-black">{uniquePassToken}</span>
                  </div>
                </div>

                <div className="my-auto space-y-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 tracking-wider block">ASSIGNED POSITION</span>
                    <h1 className="text-6xl font-black tracking-tighter text-black leading-none">{seat.id}</h1>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 tracking-wider block">SHOWTIME INITIATION</span>
                    <h1 className="text-4xl font-black tracking-tight text-black leading-none">{selectedShowtime.time}</h1>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">VALIDATION DATE</span>
                    <span className="text-sm font-bold text-black">{currentDateStr}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">TIER SCALE</span>
                    <span className="text-sm font-bold text-black">{seat.type}</span>
                  </div>
                </div>
              </div>

              {/* 3. BOTTOM SECTION: COMPACT STUB GATEWAY SHEET */}
              <div className="h-[28%] p-5 flex flex-col justify-between bg-zinc-100/80">
                
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <span className="text-[9px] text-zinc-500 block">FEATURE STUB</span>
                    <h3 className="text-xs font-bold text-black truncate leading-tight">{selectedMovie.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block">PRICE DEBIT</span>
                    <span className="text-xs font-bold text-black">${seat.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="w-full flex flex-col items-center space-y-1">
                  <div className="w-full h-10 bg-white border border-zinc-300 p-1 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-8 bg-repeat-x opacity-90" style={{ backgroundImage: "linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 7px, #000 7px, #000 10px)" }} />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 tracking-widest">{uniquePassToken}-{seat.id}</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[9px] text-zinc-500 block">SEAT ID</span>
                    <span className="text-sm font-bold text-black">{seat.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block">DEPARTS TIME</span>
                    <span className="text-sm font-bold text-black">{selectedShowtime.time}</span>
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ==========================================================
  // STANDARD OPERATION WORKSPACE VIEW CONTAINER
  // ==========================================================
  return (
    <div className="w-full space-y-4">
      {/* Action Header Banner */}
      <div className="flex justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Ticket size={16} className="text-brand-lime" /> Counter POS Cashier Terminal
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Walk-in physical ticketing module desk setup</p>
        </div>
        {step > 1 && (
          <button onClick={resetTerminal} className="flex items-center gap-1.5 py-1.5 px-3 bg-input hover:bg-foreground/[0.04] border border-border text-xs font-bold rounded-xl text-red-400">
            <X size={13} /> Cancel Order
          </button>
        )}
      </div>

      {/* STEP DISPLAY FLOW RAIL */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">
        <div className={`p-3 rounded-xl border ${step === 1 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}>1. Session Selection</div>
        <div className={`p-3 rounded-xl border ${step === 2 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}>2. Manifest Seat Map</div>
        <div className={`p-3 rounded-xl border ${step === 3 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}>3. Dispatch & Print</div>
      </div>

      {/* STAGE 1: MOVIE AND SHOWTIME SELECTOR */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Film size={13}/> Select Catalog Feature</h3>
            <div className="space-y-2">
              {movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => { setSelectedMovie(movie); setSelectedShowtime(null); }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
                    selectedMovie?.id === movie.id ? "bg-brand-lime/10 border-brand-lime text-foreground" : "bg-input/50 border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-2xl p-2 bg-input rounded-xl border border-border/80">{movie.poster}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black tracking-wide truncate text-foreground">{movie.title}</h4>
                    <p className="text-[10px] font-medium mt-0.5">{movie.genre} • {movie.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Calendar size={13}/> Available Showtimes</h3>
            {selectedMovie ? (
              <div className="space-y-2">
                {showtimes.map((showtime) => (
                  <button
                    key={showtime.id}
                    onClick={() => setSelectedShowtime(showtime)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      selectedShowtime?.id === showtime.id ? "bg-brand-lime/10 border-brand-lime text-foreground" : "bg-input/50 border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div>
                      <span className="text-sm font-black text-foreground">{showtime.time}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-input border border-border/80 rounded ml-2 text-muted-foreground">{showtime.screen}</span>
                    </div>
                    <div className="text-right text-[10px] font-mono font-bold space-y-0.5">
                      <div className="text-foreground">Normal: ${showtime.priceNormal.toFixed(2)}</div>
                      <div className="text-amber-400">VIP: ${showtime.priceVip.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
                
                <button
                  disabled={!selectedShowtime}
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 bg-brand-lime disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  Configure Seating Layout <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-muted-foreground/60 italic border border-dashed border-border/60 rounded-xl">
                Please select a movie framework from the left panel first
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 2: LIVE AUDITORIUM MAP RESERVATIONS */}
      {step === 2 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="relative w-full max-w-md mx-auto text-center pb-4">
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/20 to-transparent rounded-full blur-xs" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-1">PROJECTION STAGE</span>
          </div>

          <div className="space-y-2.5 max-w-xl mx-auto">
            {seatingLayout.rows.map((rowName) => (
              <div key={rowName} className="flex items-center gap-3">
                <span className="w-6 text-xs font-black font-mono text-muted-foreground text-center">{rowName}</span>
                <div className="flex-1 flex flex-wrap gap-1 items-center justify-start">
                  {seatingLayout.seatsByRow[rowName].map((seat) => {
                    const isDamaged = seat.status === "Damaged"
                    const isVip = seat.type === "VIP Recliner"
                    const isSelected = selectedSeats.some(s => s.id === seat.id)
                    
                    return (
                      <button
                        key={seat.id}
                        disabled={isDamaged}
                        onClick={() => toggleSeatSelection(seat)}
                        className={`h-7 w-7 rounded-md text-[9px] font-mono font-bold flex flex-col items-center justify-center border transition-all ${
                          isDamaged
                            ? "bg-red-500/10 border-red-500/30 text-red-500/40 cursor-not-allowed"
                            : isSelected
                            ? "bg-brand-lime text-black border-transparent font-black scale-105 shadow-sm shadow-brand-lime/20"
                            : isVip
                            ? "bg-amber-500/5 border-amber-500/20 text-amber-400"
                            : "bg-input border-border text-foreground hover:border-brand-lime/40"
                        }`}
                      >
                        <Armchair size={9} className={isSelected ? "text-black" : isDamaged ? "text-red-500/20" : isVip ? "text-amber-400/60" : "text-muted-foreground/30"} />
                        <span className="leading-none mt-0.5">{seat.id.slice(1)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Selected Seats Allocation</div>
              <div className="text-xs font-black text-foreground">
                {selectedSeats.length === 0 ? "None Selected" : selectedSeats.map(s => s.id).join(", ")}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Cash Due Amount</span>
                <span className="text-lg font-mono font-black text-brand-lime">${calculateTotalCost().toFixed(2)}</span>
              </div>
              <button
                disabled={selectedSeats.length === 0}
                onClick={() => setStep(3)}
                className="py-2.5 px-6 bg-brand-lime disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
              >
                Issue Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: DISPATCH GATEWAY & PREVIEW CONTAINER */}
      {step === 3 && (
        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-brand-lime/10 border border-brand-lime/30 text-brand-lime flex items-center justify-center mx-auto text-xl font-bold">✓</div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Order Successfully Authorized</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Ready to output hard-copy receipts and admission tokens</p>
          </div>

          <div className="bg-input/50 border border-border p-4 rounded-xl text-left text-xs font-semibold space-y-2 font-mono">
            <div><span className="text-muted-foreground">Feature:</span> {selectedMovie.title}</div>
            <div><span className="text-muted-foreground">Showtime:</span> {selectedShowtime.time} ({selectedShowtime.screen})</div>
            <div><span className="text-muted-foreground">Total Paid:</span> ${calculateTotalCost().toFixed(2)}</div>
            <div><span className="text-muted-foreground">Tickets Count:</span> {selectedSeats.length} units</div>
          </div>

          {/* Double Action Workspace Buttons */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 border border-border hover:bg-foreground/[0.02] text-foreground font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Back
              </button>
              <button
                onClick={triggerSystemPrint}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-input hover:bg-foreground/[0.04] border border-border text-foreground font-black text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                <Printer size={14} /> Print PDF Sheets
              </button>
            </div>

            {/* Separate, dedicated final order gateway reset layout trigger */}
            <button
              onClick={resetTerminal}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-lime/10"
            >
              <CheckCircle2 size={15} /> Confirm Sale & Next Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}