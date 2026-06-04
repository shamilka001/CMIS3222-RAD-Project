"use client"

import { useState } from "react"
import { useSettings } from "@/context/SettingsContext"
import Sidebar from "@/app/admin/components/Sidebar"
import Header from "@/app/admin/components/Header"
import MetricsGrid from "@/app/admin/components/MetricsGrid"
import ChartsSection from "@/app/admin/components/ChartsSection"
import BookingLedger from "@/app/admin/components/BookingLedger"
import ActivityAside from "@/app/admin/components/ActivityAside"
import MovieManagement from "@/app/admin/components/MovieManagement"
import UserManagement from "@/app/admin/components/UserManagement"
import SeatingManagement from "@/app/admin/components/SeatingManagement"
import CashierTerminal from "@/app/admin/components/CashierTerminal"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { visibleComponents } = useSettings()

  // Only show the right-hand live activity feed log when tracking the overview dashboard
  const showAsideLog = visibleComponents.aside && activeTab === 'overview'

  return (
    <div className="min-h-screen bg-background text-foreground flex p-3 gap-4 font-sans transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-4 max-h-[97vh] overflow-y-auto custom-scrollbar">
        
        {/* Workspace Container balances columns depending on whether the sidebar feed is open */}
        <main className={`${showAsideLog ? 'xl:col-span-3' : 'xl:col-span-4'} space-y-4`}>
          <Header activeTab={activeTab} />

          {/* SECTION A: MAIN METRICS OVERVIEW MODULE */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {visibleComponents.metrics && <MetricsGrid />}
              {visibleComponents.charts && <ChartsSection />}
              {visibleComponents.ledger && <BookingLedger />}
            </div>
          )}

          {/* SECTION B: CATALOG MOVIE & SHOWTIME DATA KERNEL */}
          {activeTab === 'movies' && (
            <MovieManagement />
          )}

          {/* SECTION C: CUSTOMER ACCOUNT PROFILE & STAFF REGISTRY HUB */}
          {activeTab === 'users' && (
            <UserManagement />
          )}

          {/* SECTION D: INTERACTIVE CINEMA AUDITORIUM LAYOUT SEATING MANAGER */}
          {activeTab === 'seating' && (
            <SeatingManagement />
          )}

          {/* SECTION E: ON-SITE CASHIER COUNTER POINT OF SALE TERMINAL */}
          {activeTab === 'cashier' && ( // <-- MOUNT TERMINAL VIEWS CONTAINER
            <CashierTerminal />
          )}
        </main>

        {/* Live Active Feed Sidebar */}
        {showAsideLog && <ActivityAside />}

      </div>
    </div>
  )
}