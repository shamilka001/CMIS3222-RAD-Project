"use client"

import { MessageSquare, Ticket } from "lucide-react"

export default function BookingLedger() {
  // Mock data representing top high-value moviegoers
  const topCustomers = [
    { id: "usr_1", name: "Danny Liu", email: "danny@gmail.com", moviesBooked: 42, totalSpent: 630.50 },
    { id: "usr_2", name: "Bella Deviant", email: "bella@gmail.com", moviesBooked: 38, totalSpent: 570.25 },
    { id: "usr_3", name: "Darrell Steward", email: "darrel@gmail.com", moviesBooked: 31, totalSpent: 495.00 },
    { id: "usr_4", name: "Cameron Williamson", email: "cam@gmail.com", moviesBooked: 29, totalSpent: 435.10 },
    { id: "usr_5", name: "Esther Howard", email: "esther.h@gmail.com", moviesBooked: 27, totalSpent: 410.00 },
    { id: "usr_6", name: "Jane Cooper", email: "jane.c@gmail.com", moviesBooked: 25, totalSpent: 380.50 },
    { id: "usr_7", name: "Robert Fox", email: "robert.f@gmail.com", moviesBooked: 24, totalSpent: 360.00 },
    { id: "usr_8", name: "Albert Flores", email: "albert.f@gmail.com", moviesBooked: 22, totalSpent: 330.00 },
    { id: "usr_9", name: "Kristin Watson", email: "kristin.w@gmail.com", moviesBooked: 19, totalSpent: 285.50 },
    { id: "usr_10", name: "Leslie Alexander", email: "leslie.a@gmail.com", moviesBooked: 18, totalSpent: 270.00 }
  ]

  const handleMessageRedirect = (customerId) => {
    window.location.href = `/admin/messages?user=${customerId}`
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-xs transition-colors duration-200">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top 10 Customers</h3>
          <p className="text-[11px] text-muted-foreground/80 mt-0.5">Ranked by total ticket booking volume and revenue</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-muted-foreground font-bold border-b border-border">
              <th className="pb-3 px-3">Customer Account</th>
              <th className="pb-3 px-3">Movies Booked</th>
              <th className="pb-3 px-3">Total Revenue</th>
              <th className="pb-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((user, idx) => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-foreground/[0.02] transition-colors group">
                {/* Name / Profile */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-muted-foreground/60 font-mono w-4">{idx + 1}.</span>
                    <div>
                      <div className="font-bold text-foreground group-hover:text-brand-lime transition-colors">{user.name}</div>
                      <div className="text-[10px] text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                
                {/* Total tickets/movies counter */}
                <td className="py-3 px-3 text-muted-foreground font-mono">
                  <div className="flex items-center gap-1.5">
                    <Ticket size={12} className="text-muted-foreground/60" />
                    <span className="font-medium">{user.moviesBooked} screenings</span>
                  </div>
                </td>
                
                {/* Accumulated Money */}
                <td className="py-3 px-3 font-bold text-foreground font-mono">
                  ${user.totalSpent.toFixed(2)}
                </td>
                
                {/* Message Hub Trigger */}
                <td className="py-3 px-3 text-right">
                  <button 
                    onClick={() => handleMessageRedirect(user.id)}
                    className="p-2 rounded-xl bg-foreground/[0.02] border border-border text-muted-foreground hover:text-black hover:bg-brand-lime hover:border-brand-lime transition-all duration-200 shadow-xs group/btn"
                    title={`Message ${user.name}`}
                  >
                    <MessageSquare size={13} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
