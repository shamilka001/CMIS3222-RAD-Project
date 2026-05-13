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
      <body className="bg-black text-white antialiased selection:bg-cyan-500/30">
        
        {/* 1. THE GLOBAL BACKGROUND (Hidden if a page handles its own bg) */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src="/images/cinema-bg.jpg"
            alt="background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* 2. NAVIGATION (Desktop) */}
        <div className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-6xl pointer-events-auto">
          <Navbar />
        </div>

        {/* 3. PAGE CONTENT */}
        {/* Removed the fixed padding so the video component can go edge-to-edge */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* 4. NAVIGATION (Mobile) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] pointer-events-auto">
          <Navdok />
        </div>

      </body>
    </html>
  )
}