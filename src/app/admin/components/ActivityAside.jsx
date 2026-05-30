"use client"

import { Bell, MessageSquare, ChevronRight } from "lucide-react"

export default function ActivityAside() {
  const systemNotifications = [
    { text: "56 New guests registered on portal", time: "Just now", highlight: true },
    { text: "Batch automation: 132 tickets finalized", time: "59 mins ago", highlight: false }
  ]

  const customerMessages = [
    { id: "msg_1", user: "Danny Liu", text: "Can I upgrade my seating arrangement for the Dune screening tonight?", time: "3 mins ago", unread: true },
    { id: "msg_2", user: "Robert Fox", text: "The transaction failed but my card was charged for booking A1..", time: "44 mins ago", unread: false },
    { id: "msg_3", user: "Esther Howard", text: "Do you offer group buyouts or concessions packages for corporate events?", time: "2 hours ago", unread: false }
  ]

  const networkManagers = [
    { name: "Daniel Craig", role: "Database Admin", status: "idle" },
    { name: "Nataniel Donowan", role: "System Operations", status: "active" }
  ]

  const routeToChat = (msgId) => {
    window.location.href = `/admin/messages?chat=${msgId}`
  }

  return (
    <aside className="space-y-4">
      {/* System Notifications Block */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
          <Bell size={14} className="text-brand-lime" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Alerts</h3>
        </div>
        <div className="space-y-3.5">
          {systemNotifications.map((notif, idx) => (
            <div key={idx} className="text-xs flex gap-3 items-start">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${notif.highlight ? 'bg-brand-lime animate-pulse' : 'bg-muted-foreground/30'}`} />
              <div>
                <p className="text-foreground leading-snug font-medium">{notif.text}</p>
                <span className="text-[10px] text-muted-foreground block mt-0.5">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSFORMED: Customer Messages Live Center */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
          <MessageSquare size={14} className="text-brand-lime" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer Messages</h3>
        </div>
        
        <div className="space-y-2.5">
          {customerMessages.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => routeToChat(msg.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start group relative ${
                msg.unread 
                  ? 'bg-brand-lime/[0.06] border-brand-lime/30 hover:border-brand-lime/50' 
                  : 'bg-foreground/[0.01] border-border hover:bg-foreground/[0.03] hover:border-muted-foreground/30'
              }`}
            >
              {/* Unread pulsing marker indicator */}
              {msg.unread && (
                <span className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
              )}
              
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground group-hover:text-brand-lime transition-colors">
                    {msg.user}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-medium">• {msg.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed tracking-wide">
                  "{msg.text}"
                </p>
              </div>
              
              <ChevronRight size={12} className="text-muted-foreground self-center ml-auto shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Network Managers */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Assigned Network Managers</h3>
        <div className="space-y-3">
          {networkManagers.map((mgr, idx) => (
            <div key={idx} className={`p-2 rounded-xl flex justify-between items-center transition-all ${mgr.status === 'active' ? 'bg-brand-lime/[0.08] border border-brand-lime/20' : 'bg-transparent border border-transparent'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center font-bold text-[10px] uppercase border border-border">
                  {mgr.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">{mgr.name}</span>
                  <span className="text-[10px] text-muted-foreground block">{mgr.role}</span>
                </div>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${mgr.status === 'active' ? 'bg-brand-lime' : 'bg-muted-foreground/30'}`} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}