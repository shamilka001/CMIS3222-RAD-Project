"use client"

import { useState } from "react"

export default function SeatSelector() {

  const [selectedSeats, setSelectedSeats] = useState([])

  const seats = Array.from({ length: 40 }, (_, i) => i + 1)

  function toggleSeat(seat) {

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(
        selectedSeats.filter(s => s !== seat)
      )
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }

  }

  return (

    <div>

      <h2 className="text-xl mb-4">
        Select Seats
      </h2>

      <div className="grid grid-cols-8 gap-2">

        {seats.map(seat => (

          <button
            key={seat}
            onClick={() => toggleSeat(seat)}
            className={`p-2 rounded ${
              selectedSeats.includes(seat)
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          >
            {seat}
          </button>

        ))}

      </div>

    </div>

  )
}