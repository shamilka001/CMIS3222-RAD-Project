"use client"

import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="bg-black/30 px-4 py-8 flex justify-center rounded-full shadow-lg backdrop-blur-md border border-white/20 backdrop-contrast-150 backdrop-brightness-80">
      
      {/* Inner container controls spacing */}
      <div className="flex items-center justify-between w-full max-w-md px-6 gap-8">

        {/* Home */}
        <Link href="/" title="Home">
          <Image
            src="/icons/hom.png"
            alt="Home"
            width={28}
            height={28}
            className="hover:scale-110 transition opacity-70 hover:opacity-100"
          />
        </Link>

        {/* Contact Us - Now connected to /contact */}
        <Link href="/contact" title="Contact Us">
          <Image
            src="/icons/com.png" // This is your contact icon
            alt="Contact"
            width={28}
            height={28}
            className="hover:scale-110 transition opacity-70 hover:opacity-100"
          />
        </Link>

        {/* Booking / Account */}
        <Link href="/booking" title="My Bookings">
          <Image
            src="/icons/prf.png"
            alt="Account"
            width={28}
            height={28}
            className="hover:scale-110 transition opacity-70 hover:opacity-100"
          />
        </Link>

      </div>
    </nav>
  )
}