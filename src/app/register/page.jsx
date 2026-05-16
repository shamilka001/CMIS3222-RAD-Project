"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'USER',
    status: 'ACTIVE'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("The server returned an invalid response. Registration failed.");
      }

      const data = await response.json();

      if (response.ok) {
        // Success: Redirect to login
        router.push('/login');
      } else {
        // Failure
        setError(data.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Connection to auth server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-900/10 blur-[150px] -z-10" />

      <div className="w-full max-w-lg">
        <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Join <span className="text-cyan-500">MaxLite</span></h1>
            <p className="text-white/40 text-sm">Create an account to start booking movies</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl text-center animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/10"
                  placeholder="Nimansith"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/10"
                  placeholder="Dinu"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/10"
                placeholder="dinu@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="tel" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/10"
                placeholder="+94771234567"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-cyan-500 hover:bg-white text-black font-black py-5 rounded-2xl transition-all active:scale-[0.98] mt-4 shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Already have an account? <Link href="/login" className="text-cyan-500 hover:text-white transition-colors">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
