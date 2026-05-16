"use client"

import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: "Total Bookings", value: "1,284", growth: "+12%" },
    { label: "Active Movies", value: "24", growth: "Stable" },
    { label: "Revenue", value: "$12,450", growth: "+8%" },
    { label: "New Users", value: "142", growth: "+18%" }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white flex p-4 gap-8">
      {/* BACKGROUND DECOR */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] -z-10" />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 pt-8 pr-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">System Overview</h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Dashboard / {activeTab}</p>
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-500">
              AD
            </div>
          </div>
        </header>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={stat.label}
              className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
              <span className="text-[10px] text-cyan-500 font-bold">{stat.growth} this month</span>
            </motion.div>
          ))}
        </div>

        {/* ACTIVITY TABLE */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10">
          <h3 className="text-xl font-black uppercase italic mb-8">Recent Bookings</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/20 text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                <th className="pb-6 px-4">User</th>
                <th className="pb-6 px-4">Movie</th>
                <th className="pb-6 px-4">Seats</th>
                <th className="pb-6 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-6 px-4 font-bold text-white/80">User_0{i}@gmail.com</td>
                  <td className="py-6 px-4 text-white/60">Dune: Part Two</td>
                  <td className="py-6 px-4 font-mono text-cyan-500">A1, A2</td>
                  <td className="py-6 px-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase">Confirmed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}