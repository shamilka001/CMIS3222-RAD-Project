"use client"

import Image from "next/image"

export default function Navdok({ onContactClick, onHomeClick }) {
  return (
    <nav className="md:hidden bg-black/30 px-4 py-6 flex justify-center rounded-full shadow-lg backdrop-blur-md border border-white/20 backdrop-contrast-150 backdrop-brightness-80">
      
      <div className="flex items-center justify-between w-full max-w-md px-6 gap-8">

        {/* Home Trigger */}
        <button onClick={onHomeClick} title="Home" className="outline-none">
          <Image
            src="/icons/hom.png"
            alt="Home"
            width={28}
            height={28}
            className="hover:scale-110 transition opacity-70 hover:opacity-100"
          />
        </button>

        {/* Contact Trigger (Cinematic Transition) */}
        <button onClick={onContactClick} title="Contact Us" className="outline-none">
          <Image
            src="/icons/com.png"
            alt="Contact"
            width={28}
            height={28}
            className="hover:scale-110 transition opacity-70 hover:opacity-100"
          />
        </button>

        {/* Account / Booking */}
        <button title="My Bookings" className="outline-none">
          <Image
            src="/icons/prf.png"
            alt="Account"
            width={28}
            height={28}
            className="hover:scale-110 transition opacity-70 hover:opacity-100"
          />
        </button>

      </div>
    </nav>
  )
}