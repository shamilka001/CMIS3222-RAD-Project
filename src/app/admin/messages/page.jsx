"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, ArrowLeft, MoreVertical, 
  Ticket, Calendar, Send, Compass, CheckCheck 
} from "lucide-react"

export default function MessagingPortal() {
  // Mock conversations for your layout
  const [conversations, setConversations] = useState([
    { id: "msg_1", name: "Danny Liu", email: "danny@gmail.com", text: "Can I upgrade my seating arrangement for the Dune screening tonight?", time: "3 mins ago", unread: true, moviesBooked: 42, totalSpent: 630.50, status: "Premium" },
    { id: "msg_2", name: "Robert Fox", email: "robert.f@gmail.com", text: "The transaction failed but my card was charged for booking A1..", time: "44 mins ago", unread: false, moviesBooked: 24, totalSpent: 360.00, status: "Active" },
    { id: "msg_3", name: "Esther Howard", email: "esther.h@gmail.com", text: "Do you offer group buyouts or concessions packages for corporate events?", time: "2 hours ago", unread: false, moviesBooked: 27, totalSpent: 410.00, status: "Active" }
  ])

  const [activeChat, setActiveChat] = useState(conversations[0])
  const [typedMessage, setTypedMessage] = useState("")
  
  // Simulated thread messages
  const [chatThreads, setChatThreads] = useState({
    msg_1: [
      { id: 1, sender: "customer", text: "Hi, I just bought a couple of standard tickets for Dune: Part Two tonight.", time: "8:12 PM" },
      { id: 2, sender: "customer", text: "Can I upgrade my seating arrangement for the Dune screening tonight? I want to switch to VIP recliners if any are left.", time: "8:13 PM" }
    ],
    msg_2: [
      { id: 1, sender: "customer", text: "The transaction failed but my card was charged for booking A1..", time: "7:30 PM" }
    ],
    msg_3: [
      { id: 1, sender: "customer", text: "Do you offer group buyouts or concessions packages for corporate events?", time: "6:05 PM" }
    ]
  })

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!typedMessage.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: "admin",
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setChatThreads(prev => ({
      ...prev,
      [activeChat.id]: [...prev[activeChat.id], newMessage]
    }))

    // Clear unread indicator if admin replies
    if (activeChat.unread) {
      setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...c, unread: false } : c))
      setActiveChat(prev => ({ ...prev, unread: false }))
    }

    setTypedMessage("")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex p-3 gap-4 font-sans select-none antialiased h-screen overflow-hidden transition-colors duration-200">
      {/* Glow Effect using theme properties */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-lime/[0.03] blur-[150px] -z-10 pointer-events-none" />

      {/* CHAT INTERFACE AREA GRID */}
      <div className="flex-1 bg-card text-card-foreground border border-border rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-full shadow-xs">
        
        {/* LEFT COLUMN: ACTIVE CONVERSATIONS (Spans 4/12) */}
        <section className="lg:col-span-4 border-r border-border flex flex-col h-full bg-card/60">
          {/* Header Action Row */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 rounded-xl bg-foreground/[0.02] border border-border text-muted-foreground hover:text-foreground transition-all">
                <ArrowLeft size={14} />
              </Link>
              <h1 className="text-sm font-bold uppercase tracking-wider text-foreground">Inbox Hub</h1>
            </div>
            <span className="text-[10px] bg-brand-lime/[0.12] border border-brand-lime/30 text-brand-lime dark:text-brand-lime font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
              Live Feed
            </span>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={13} />
              <input 
                type="text" 
                placeholder="Filter conversations..." 
                className="bg-input border border-border text-xs rounded-xl pl-9 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-brand-lime focus:border-brand-lime transition-all text-foreground placeholder:text-muted-foreground/40 font-medium"
              />
            </div>
          </div>

          {/* User Active Selection Directory List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((chat) => {
              const isSelected = activeChat.id === chat.id
              return (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-2 relative ${
                    isSelected 
                      ? 'bg-brand-lime/[0.08] border-brand-lime/30 text-foreground' 
                      : 'bg-transparent border-transparent hover:bg-foreground/[0.02] hover:border-border'
                  }`}
                >
                  <div className="space-y-1 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isSelected ? 'text-brand-lime dark:text-brand-lime' : 'text-foreground'}`}>
                        {chat.name}
                      </span>
                      {chat.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-lime inline-block animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {chatThreads[chat.id]?.[chatThreads[chat.id].length - 1]?.text || chat.text}
                    </p>
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 font-medium shrink-0 pt-0.5">
                    {chat.time}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* MIDDLE COLUMN: LIVE MESSAGE WINDOW FEED (Spans 5/12) */}
        <section className="lg:col-span-5 flex flex-col h-full bg-card">
          {/* Header Context Meta */}
          <div className="p-4 border-b border-border bg-card/40 flex justify-between items-center">
            <div>
              <h2 className="text-xs font-bold text-foreground tracking-wide">{activeChat.name}</h2>
              <span className="text-[10px] text-muted-foreground block">{activeChat.email}</span>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>

          {/* Interactive Chat Scroll Canvas */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatThreads[activeChat.id]?.map((msg) => {
              const isAdmin = msg.sender === "admin"
              return (
                <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isAdmin 
                      ? 'bg-brand-lime text-black font-black rounded-tr-none shadow-xs' 
                      : 'bg-input border border-border text-foreground rounded-tl-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground/60 font-mono px-1">
                    <span>{msg.time}</span>
                    {isAdmin && <CheckCheck size={10} className="text-brand-lime" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Textarea Processing Form Node */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-card/40 flex gap-2 items-center">
            <input 
              type="text" 
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder={`Reply to ${activeChat.name}...`}
              className="bg-input border border-border text-xs rounded-xl px-4 py-2.5 flex-1 focus:outline-none focus:ring-1 focus:ring-brand-lime focus:border-brand-lime transition-all text-foreground placeholder:text-muted-foreground/40 font-medium"
            />
            <button 
              type="submit"
              className="p-2.5 rounded-xl bg-brand-lime text-black font-black hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-xs"
            >
              <Send size={13} />
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN: HIGH-DENSITY CRM DETAILS INSIGHTS PANEL (Spans 3/12) */}
        <section className="lg:col-span-3 bg-card/80 p-4 flex flex-col h-full gap-4 border-l border-border">
          
          {/* Section A: Customer Metrics Summary Profile Card */}
          <div className="bg-input border border-border rounded-xl p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-lime text-black mx-auto flex items-center justify-center font-black text-sm tracking-wider shadow-xs">
              {activeChat.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">{activeChat.name}</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mt-0.5">
                {activeChat.status} Guest Node
              </span>
            </div>
          </div>

          {/* Section B: CRM Operations Activity Data Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border p-3 rounded-xl">
              <span className="text-[9px] text-muted-foreground block font-semibold uppercase tracking-tight">Total Volume</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Ticket size={12} className="text-muted-foreground/60" />
                <span className="text-xs font-bold text-foreground font-mono">{activeChat.moviesBooked} Deals</span>
              </div>
            </div>
            <div className="bg-card border border-border p-3 rounded-xl">
              <span className="text-[9px] text-muted-foreground block font-semibold uppercase tracking-tight">Gross Revenue</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-black text-brand-lime-dark dark:text-brand-lime font-mono">${activeChat.totalSpent.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Section C: Live Screening Context Details Holder */}
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 border-b border-border pb-2 mb-3">
                <Compass size={12} className="text-brand-lime" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Booking Context</h4>
              </div>

              {/* Dynamic screening info matched directly to active user logs */}
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] text-muted-foreground/60 block uppercase font-bold">Selected Film</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">Dune: Part Two (2D IMAX)</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-[9px] text-muted-foreground/60 block uppercase font-bold">Seats Assigned</span>
                    <span className="text-xs font-black text-brand-lime-dark dark:text-brand-lime font-mono mt-0.5 block">A1, A2</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground/60 block uppercase font-bold">Theater Node</span>
                    <span className="text-xs font-bold text-muted-foreground font-mono mt-0.5 block">Screen 04</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <Calendar size={11} className="text-muted-foreground/60" />
                    <span className="text-[11px]">Today at 9:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Action Macro Triggers */}
            <div className="pt-4 space-y-1.5">
              <button className="w-full py-2 px-3 bg-foreground/[0.02] border border-border hover:border-brand-lime/40 hover:bg-brand-lime hover:text-black rounded-xl text-xs font-bold transition-all text-center block shadow-xs duration-200">
                Assign Seat Upgrade
              </button>
              <button className="w-full py-2 px-3 bg-transparent hover:bg-red-500/10 hover:text-red-500 border border-transparent rounded-xl text-xs font-semibold text-muted-foreground/60 transition-all text-center block duration-200">
                Flag Transaction Fraud
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}