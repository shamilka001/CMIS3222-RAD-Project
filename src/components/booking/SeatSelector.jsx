"use client"

import { useState } from "react"

export default function SeatSelector({ seatCount }) {
  const [selectedSeats, setSelectedSeats] = useState([])
  const seats = Array.from({ length: 60 }, (_, i) => i + 1)

  function toggleSeat(seat) {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat))
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const isComplete = selectedSeats.length === seatCount

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl mb-12">
        <div className="w-full h-1 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,1)]" />
        <p className="text-center text-[10px] tracking-[0.5em] text-white/30 uppercase mt-4">Screen</p>
      </div>

      <div className="grid grid-cols-10 gap-3 mb-10">
        {seats.map(seat => {
          const isSelected = selectedSeats.includes(seat)
          const isDisabled = !isSelected && selectedSeats.length >= seatCount
          return (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              disabled={isDisabled}
              className={`w-10 h-10 rounded-t-xl text-[10px] font-bold transition-all ${
                isSelected
                  ? "bg-cyan-500 text-black border-t-2 border-white"
                  : isDisabled
                  ? "bg-white/5 text-white/10"
                  : "bg-white/10 text-white/40 border-t-2 border-white/10 hover:bg-white/20"
              }`}
            >
              {seat}
            </button>
          )
        })}
      </div>

      <div className="w-full flex items-center justify-between p-8 bg-black/60 backdrop-blur-xl rounded-[40px] border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Seats</span>
          <span className="text-xl font-black text-white">{selectedSeats.length > 0 ? selectedSeats.sort((a,b)=>a-b).join(", ") : "—"}</span>
        </div>
        <button
          disabled={!isComplete}
          className={`px-10 py-4 rounded-2xl font-black transition-all ${
            isComplete ? "bg-white text-black hover:bg-cyan-500" : "bg-white/10 text-white/20"
          }`}
        >
          {isComplete ? "PROCEED TO PAYMENT" : `SELECT ${seatCount - selectedSeats.length} MORE`}
        </button>
      </div>
    </div>
  )
}