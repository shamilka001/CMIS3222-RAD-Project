"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { authFetch } from '@/lib/api'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Safe token decoding
        let userId;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id; 
        } catch (e) {
          throw new Error("token_malformed");
        }

        if (!userId) throw new Error("token_missing_id");

        // 1. Fetch User Profile
        const userRes = await authFetch(`http://localhost:5000/user/${userId}`)
        
        // Check if response is JSON
        const contentType = userRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("server_error_not_json");
        }

        const responseData = await userRes.json()

        if (userRes.ok && responseData.data) {
          const userData = responseData.data;
          setUser({
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            phoneNumber: userData.phone_number,
            status: userData.status,
            id: userData.user_id
          });
        } else {
          throw new Error(responseData.message || 'Failed to load profile')
        }

        // 2. Fetch User Bookings
        const bookingRes = await authFetch('http://localhost:5000/booking/user')
        const bContentType = bookingRes.headers.get("content-type");
        
        if (bookingRes.ok && bContentType && bContentType.includes("application/json")) {
          const bookingData = await bookingRes.json()
          setBookings(Array.isArray(bookingData) ? bookingData : [])
        }

      } catch (err) {
        console.error('Profile fetch error:', err)
        
        if (err.message === "token_malformed" || err.message === "token_missing_id") {
          setError('Session expired or invalid. Please login again.')
          localStorage.removeItem('token')
          router.push('/login')
        } else if (err.message === "server_error_not_json") {
          setError('The server returned an invalid response. Please contact support.')
        } else {
          setError('Unable to load account data. Please try again.')
        }

        if (err.message.includes('401') || err.message.includes('403')) {
           localStorage.removeItem('token')
           router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 font-black tracking-[0.5em] animate-pulse uppercase">Syncing Data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-900/5 blur-[150px] -z-10" />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 pt-32 pb-20"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Your <span className="text-cyan-500">Account</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
              Dashboard / User Profile / {user?.firstName} {user?.lastName}
            </p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              window.dispatchEvent(new Event('auth-change'))
              router.push('/login')
            }}
            className="px-8 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all self-start"
          >
            Secure Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar: User Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-8">Personal Details</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Full Name</label>
                  <p className="text-xl font-black uppercase italic">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Email Address</label>
                  <p className="text-lg font-bold">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Phone Number</label>
                  <p className="text-lg font-bold">{user?.phoneNumber || 'Not Provided'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Account Status</label>
                  <span className="inline-block mt-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest">
                    {user?.status || 'Active'}
                  </span>
                </div>
              </div>

              <button className="w-full mt-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Edit Information
              </button>
            </div>
          </div>

          {/* Main Content: Booking History */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl h-full">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-8">Booking History</h2>
              
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="text-4xl mb-4">🎟️</div>
                  <p className="text-xs font-black uppercase tracking-widest">No previous bookings found</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="mt-6 text-cyan-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    Explore Now →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                          {booking.moviePoster ? (
                            <img src={booking.moviePoster} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">🎬</span>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-black uppercase italic group-hover:text-cyan-500 transition-colors">{booking.movieTitle}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            {booking.date} • {booking.time} • {booking.theaterName || 'K-Zone Moratuwa'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-widest mb-1">{booking.seats?.join(', ')}</p>
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg ${
                          booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.main>

      <Footer />
    </div>
  )
}
