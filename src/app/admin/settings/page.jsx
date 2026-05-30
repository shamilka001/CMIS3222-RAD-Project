"use client"

import Link from "next/link"
import { useSettings } from "@/context/SettingsContext"
import { 
  ArrowLeft, Shield, Eye, Sliders, Sun, Moon, 
  Lock, Key, Type, Grid, Layers 
} from "lucide-react"

export default function SettingsPage() {
  const {
    theme, setTheme,
    fontSize, setFontSize,
    twoFactor, setTwoFactor,
    visibleComponents, toggleComponent
  } = useSettings()

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header navigation bar */}
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-main)]">
          <Link href="/admin" className="p-2 rounded-xl bg-white/[0.02] border border-[var(--border-main)] text-zinc-400 hover:text-cyan-400 transition-all">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Control Panel Settings</h1>
            <p className="text-xs text-zinc-500">Manage security clearances, interfaces accessibility, and layout matrices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN SUB-NAV DESCRIPTIONS */}
          <div className="space-y-1 text-xs font-medium text-zinc-400">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] text-cyan-400 border border-[var(--border-main)]">
              <Sliders size={14} /> Master Node Settings
            </div>
          </div>

          {/* MAIN INTERACTIVE FORMS GRID CONTROLS */}
          <div className="md:col-span-2 space-y-6">
            
            {/* MODULE 1: ACCESSIBILITY & THEMES */}
            <section className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
                <Sun size={15} className="text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Accessibility & Interface Display</h3>
              </div>

              {/* Theme Configuration Toggle */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold block">Color Theme Scheme</span>
                  <span className="text-[11px] text-zinc-500">Switch between dark mode and light mode</span>
                </div>
                <div className="bg-[#171A1F] p-1 rounded-xl border border-white/[0.05] flex gap-1">
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${theme === 'dark' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-zinc-500'}`}
                  >
                    <Moon size={12} /> Dark
                  </button>
                  <button 
                    onClick={() => setTheme("light")}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${theme === 'light' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'text-zinc-400'}`}
                  >
                    <Sun size={12} /> Light
                  </button>
                </div>
              </div>

              {/* Font Sizer Config */}
              <div className="flex justify-between items-center text-xs pt-3 border-t border-[var(--border-main)]">
                <div>
                  <span className="font-semibold block">UI Text Scaling font size</span>
                  <span className="text-[11px] text-zinc-500">Adjust text size for microdata visibility reading</span>
                </div>
                <select 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value)}
                  className="bg-[#171A1F] border border-white/[0.05] text-xs rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500/30"
                >
                  <option value="small">Compact (Small)</option>
                  <option value="normal">Standard (Default)</option>
                  <option value="large">Magnified (Large)</option>
                </select>
              </div>
            </section>

            {/* MODULE 2: CUSTOMIZE DASHBOARD COMPONENTS */}
            <section className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
                <Grid size={15} className="text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Modular UI Customizer Matrix</h3>
              </div>
              <p className="text-[11px] text-zinc-500">Select which data modules render inside your main administration dashboard display workspace.</p>
              
              <div className="space-y-2.5 pt-1">
                {[
                  { key: "metrics", label: "Analytics Metrics Cards Overview", desc: "Top 4 data counters summary rows" },
                  { key: "charts", label: "SVG Data Graphic Visual Charts", desc: "Genre rings maps & line tracking elements" },
                  { key: "ledger", label: "Top 10 High Value Consumer Ledger Table", desc: "Active guest lists grid rows with messaging shortcut triggers" },
                  { key: "aside", label: "Operational Logs Right Context Sidebar Panel", desc: "Live user ticket requests messaging alerts stream layout" }
                ].map((comp) => (
                  <label key={comp.key} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-[var(--border-main)] cursor-pointer hover:bg-white/[0.02] transition-all">
                    <div className="text-xs">
                      <span className="font-medium text-zinc-200 block">{comp.label}</span>
                      <span className="text-[10px] text-zinc-500 block">{comp.desc}</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={visibleComponents[comp.key]}
                      onChange={() => toggleComponent(comp.key)}
                      className="w-4 h-4 rounded border-zinc-700 text-cyan-500 bg-zinc-900 focus:ring-cyan-500/20 focus:ring-offset-0"
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* MODULE 3: SECURITY MANAGEMENT PANEL */}
            <section className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
                <Shield size={15} className="text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Account Credentials Security</h3>
              </div>

              {/* Two Factor Authentication Switch */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold block">Two-Factor Authentication (2FA) Security clearance</span>
                  <span className="text-[11px] text-zinc-500">Request phone authentication code confirmation layers at login gates</span>
                </div>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${twoFactor ? 'bg-emerald-500 flex justify-end' : 'bg-zinc-700 flex justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-white block shadow-sm" />
                </button>
              </div>

              {/* Change Pass Button */}
              <div className="flex justify-between items-center text-xs pt-3 border-t border-[var(--border-main)]">
                <div>
                  <span className="font-semibold block">Change Administrator Passwords Session</span>
                  <span className="text-[11px] text-zinc-500">Force cryptographic token security cycling sequences</span>
                </div>
                <button className="px-3 py-2 bg-white/[0.02] border border-[var(--border-main)] hover:border-cyan-500/20 hover:bg-cyan-500/10 text-zinc-300 hover:text-cyan-400 rounded-xl text-[11px] font-semibold transition-all">
                  Update Keys
                </button>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  )
}