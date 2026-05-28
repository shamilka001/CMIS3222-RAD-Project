"use client"

import { useState } from "react"
import { useSettings } from "@/context/SettingsContext"
import Sidebar from "@/app/admin/components/Sidebar"
import Header from "@/app/admin/components/Header"
import MetricsGrid from "@/app/admin/components/MetricsGrid"
import ChartsSection from "@/app/admin/components/ChartsSection"
import BookingLedger from "@/app/admin/components/BookingLedger"
import ActivityAside from "@/app/admin/components/ActivityAside"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { visibleComponents } = useSettings()

  return (
    // FIXED: Changed bg-[var(--bg-app)] and text-[var(--text-main)] to standard fluid classes
    <div className="min-h-screen bg-background text-foreground flex p-3 gap-4 font-sans transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-4 max-h-[97vh] overflow-y-auto custom-scrollbar">
        
        <main className="xl:col-span-3 space-y-4">
          <Header activeTab={activeTab} />

          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Conditional Visibility Guards */}
              {visibleComponents.metrics && <MetricsGrid />}
              {visibleComponents.charts && <ChartsSection />}
              {visibleComponents.ledger && <BookingLedger />}
            </div>
          )}
        </main>

        {/* Live Active Feed Sidebar */}
        {visibleComponents.aside && <ActivityAside />}

      </div>
    </div>
  )
}