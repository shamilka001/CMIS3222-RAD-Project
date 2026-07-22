import { useEffect } from "react";

export default function Tickets({ selectedMovie, selectedShowtime, selectedSeats }) {
  useEffect(() => {
    // Automatically trigger browser print dialog when component mounts
    const timer = setTimeout(() => {
      window.print();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Resolve movie image across common naming conventions (poster, image, banner, etc.)
  const movieImage =
    selectedMovie?.image ||
    selectedMovie?.poster ||
    selectedMovie?.poster_url ||
    selectedMovie?.imageUrl ||
    selectedMovie?.banner ||
    "";

  const movieTitle =
    selectedMovie?.film_name ||
    selectedMovie?.title ||
    "FEATURE PRESENTATION";

  const screenName = selectedShowtime?.screen_name || "MAIN SCREEN";
  const showTime = selectedShowtime?.start_time || selectedShowtime?.time || "TBA";
  const showDate = selectedShowtime?.show_date
    ? new Date(selectedShowtime.show_date).toLocaleDateString()
    : "";

  return (
    <div className="w-full bg-black text-white min-h-screen p-6 md:p-12 flex flex-col items-center justify-start print:bg-white print:text-black print:p-0">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        
        .ticket-font {
          font-family: 'Share Tech Mono', monospace;
        }

        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .ticket-page {
            break-after: page;
            page-break-after: always;
            box-shadow: none !important;
            border: 2px dashed #000 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Screen action controls hidden during actual print */}
      <div className="no-print mb-8 text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-mono block">
          Full Screen Admission View & Passes Generated
        </span>
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]"
        >
          Print Passes Now
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {selectedSeats.map((seat, index) => {
          const seatCode = seat.id || `${seat.row_label || ""}${seat.seat_number || ""}`;
          const seatType = seat.type || seat.seat_type || "STANDARD";
          const seatPrice = typeof seat.price === "number" ? seat.price : 12.50;

          return (
            <div
              key={seat.seat_id || index}
              className="ticket-page ticket-font bg-zinc-900/90 border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl print:bg-white print:text-black print:border-black/20"
            >
              {/* Full Screen Header Banner with Movie Artwork */}
              <div className="relative w-full h-48 md:h-64 overflow-hidden border-b border-white/10 print:h-36">
                {movieImage ? (
                  <img
                    src={movieImage}
                    alt={movieTitle}
                    className="w-full h-full object-cover opacity-60 print:opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-cyan-950 via-zinc-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent print:hidden" />
                
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] text-cyan-400 uppercase font-bold print:text-zinc-600 block mb-1">
                      CINEMA NET VIP PASS
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-white print:text-black">
                      {movieTitle}
                    </h2>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono text-zinc-400 print:text-zinc-600 block">
                      PASS {index + 1} / {selectedSeats.length}
                    </span>
                    <span className="text-lg font-black font-mono text-cyan-400 print:text-black">
                      ${seatPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Information Grid */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
                  <div>
                    <span className="text-white/40 print:text-zinc-500 uppercase block text-[9px] mb-1">Theater Screen</span>
                    <span className="font-bold text-sm tracking-wide text-white print:text-black">{screenName}</span>
                  </div>
                  <div>
                    <span className="text-white/40 print:text-zinc-500 uppercase block text-[9px] mb-1">Showtime</span>
                    <span className="font-bold text-sm tracking-wide text-white print:text-black">
                      {showTime} {showDate && <span className="block text-[10px] text-cyan-400 print:text-zinc-700">{showDate}</span>}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 print:text-zinc-500 uppercase block text-[9px] mb-1">Seat Class</span>
                    <span className="font-bold text-sm tracking-wide uppercase text-white print:text-black">{seatType}</span>
                  </div>
                  <div>
                    <span className="text-white/40 print:text-zinc-500 uppercase block text-[9px] mb-1">Pricing Rate</span>
                    <span className="font-bold text-sm tracking-wide text-cyan-400 print:text-black">${seatPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Assigned Seat Callout & Barcode Footer */}
                <div className="border-t border-dashed border-white/20 pt-6 flex items-center justify-between print:border-black/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 print:text-zinc-500 block mb-1">
                      Assigned Seat Location
                    </span>
                    <span className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-cyan-400 print:text-black">
                      {seatCode}
                    </span>
                  </div>
                  
                  {/* Simulated Security Barcode */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-[2px] h-12 bg-white p-1.5 rounded-lg shadow-inner">
                      <div className="w-[2px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                      <div className="w-[3px] h-full bg-black"></div>
                      <div className="w-[2px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                      <div className="w-[4px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                      <div className="w-[3px] h-full bg-black"></div>
                      <div className="w-[2px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                    </div>
                    <span className="text-[9px] font-mono text-white/40 print:text-zinc-500 mt-1.5 tracking-wider">
                      REF-CN-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}