"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("The server returned an invalid response (not JSON). Please check if the backend is running correctly.");
      }

      const data = await response.json();

      if (response.ok) {
        // Success: Save token to localStorage
        localStorage.setItem('token', data.token);
        // Dispatch a custom event to notify Navbar of the login
        window.dispatchEvent(new Event('auth-change'));
        router.push('/profile');
      } else {
        // Failure
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection to auth server failed. Please ensure the backend is running.');
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
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Welcome <span className="text-cyan-500">Back</span></h1>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Log in to manage your movie bookings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl text-center animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/10"
                placeholder="user@example.com"
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
              className="w-full bg-cyan-500 hover:bg-white text-black font-black py-5 rounded-2xl transition-all active:scale-[0.98] mt-4 shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Don't have an account? <Link href="/register" className="text-cyan-500 hover:text-white transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}