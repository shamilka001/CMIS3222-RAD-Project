"use client"

import Link from "next/link"
import Image from "next/image"

export default function Navbar() {

  return (

    <nav className="bg-black/30 px-4 py-8 flex justify-center rounded-full shadow-lg backdrop-blur-xxs border border-white/20 backdrop-contrast-150 backdrop-brightness-80 ">

      {/* Inner container controls spacing */}
      <div className="flex items-center justify-between w-full max-w-md px-6">

        <Link href="/">
          <Image
            src="/icons/hom.png"
            alt="Home"
            width={28}
            height={28}
            className="hover:scale-110 transition"
          />
        </Link>

        <Link href="/movies">
          <Image
            src="/icons/com.png"
            alt="Contact"
            width={28}
            height={28}
            className="hover:scale-110 transition"
          />
        </Link>

        <Link href="/booking">
          <Image
            src="/icons/prf.png"
            alt="Account"
            width={28}
            height={28}
            className="hover:scale-110 transition"
          />
        </Link>

      </div>

      

    </nav>

  )
}