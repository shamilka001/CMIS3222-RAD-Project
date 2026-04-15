import "./globals.css"
import Navbar from "../components/Navbar"
import Navdok from "../components/Navdok"

export const metadata = {
  title: "Cinema Management System",
  description: "Online Cinema Booking System",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen text-white">

        {/* 🎬 CINEMA BACKGROUND */}
        <div className="fixed inset-0 -z-10">
          <img
            src="/images/cinema-bg.jpg"
            alt="background"
            className="w-full h-full object-cover opacity-50"
          />

          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* top fade */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent" />

          {/* bottom fade */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
          <Navbar />
        </div>

        {/* PAGE CONTENT */}
        <main className="relative z-10 p-6 pt-24 pb-24">
          {children}
        </main>

        {/* MOBILE NAVBAR */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%]">
          <Navdok />
        </div>

      </body>
    </html>
  )
}