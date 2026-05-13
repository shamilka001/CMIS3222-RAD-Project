"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // Static credentials for development
  const STATIC_USER = {
    email: "shamilkapeiris@gmail.com",
    password: "123"
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (formData.email === STATIC_USER.email && formData.password === STATIC_USER.password) {
      // Success: Redirect to the booking dashboard
      router.push('/booking')
    } else {
      // Failure
      setError('Invalid email or password. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-900/10 blur-[150px] -z-10" />

      <div className="w-full max-w-md">
        <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-white/40 text-sm">Log in to manage your movie bookings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-white/20"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2 px-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-white"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] mt-4 shadow-lg shadow-blue-600/20"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/30">
              Don't have an account? <Link href="/contact" className="text-blue-500 hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials Helper */}
        <div className="mt-6 p-4 border border-white/5 bg-white/5 rounded-2xl text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">Demo Access</p>
          <p className="text-xs text-white/40 mt-1">user@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}