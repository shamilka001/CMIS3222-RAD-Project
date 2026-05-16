"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Navdok({ onContactClick, onHomeClick }) {
  const router = useRouter();
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

        {/* About Trigger */}
        <button onClick={() => router.push("/about")} title="About Us" className="outline-none">
          <div className="w-[28px] h-[28px] rounded-full border-2 border-white/40 flex items-center justify-center text-[10px] font-black text-white/70 hover:border-white hover:text-white transition-all">
            i
          </div>
        </button>

        {/* Account / Booking */}
        <button onClick={() => router.push('/profile')} title="My Bookings" className="outline-none">
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