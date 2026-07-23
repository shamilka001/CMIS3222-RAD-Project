
// "use client";

// import { useEffect, useState } from "react";
// import { MessageSquare, Ticket, Loader2 } from "lucide-react";

// const TICKET_PRICE_ESTIMATE = 12.0; // Adjust this if your API passes seat prices later

// export default function BookingLedger() {
//   const [topCustomers, setTopCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/booking/get");
//         if (!response.ok) {
//           throw new Error("Failed to fetch bookings data");
//         }

//         const json = await response.json();
//         const rawData = json.data || [];

//         // Aggregate raw booking records by unique user_id
//         const customerMap = {};

//         rawData.forEach((booking) => {
//           // Only process successful payments
//           if (booking.status !== "PAID") return;

//           const userId = booking.user_id;
//           const fullName =
//             `${booking.first_name || ""} ${booking.last_name || ""}`.trim();

//           // Count total seats booked across their orders
//           const seatCount = booking.seats?.length || booking.total_seats || 0;
//           const costForBooking = seatCount * TICKET_PRICE_ESTIMATE;

//           if (!customerMap[userId]) {
//             customerMap[userId] = {
//               id: userId,
//               name: fullName || "Unknown Customer",
//               email: booking.email,
//               moviesBooked: 1, // Number of separate screenings/bookings
//               totalSpent: costForBooking,
//             };
//           } else {
//             customerMap[userId].moviesBooked += 1;
//             customerMap[userId].totalSpent += costForBooking;
//           }
//         });

//         // Convert map to array, sort by total revenue descending, and take top 10
//         const sortedCustomers = Object.values(customerMap)
//           .sort((a, b) => b.totalSpent - a.totalSpent)
//           .slice(0, 10);

//         setTopCustomers(sortedCustomers);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleMessageRedirect = (customerId) => {
//     window.location.href = `/admin/messages?user=${customerId}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center p-10 bg-card text-card-foreground border border-border rounded-2xl min-h-[300px]">
//         <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//         <p className="text-xs text-muted-foreground mt-2">
//           Loading top customers...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-5 bg-card text-destructive border border-destructive/20 rounded-2xl text-xs text-center">
//         Error loading ledger data: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-xs transition-colors duration-200">
//       <div className="flex justify-between items-center mb-5">
//         <div>
//           <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//             Top 10 Customers
//           </h3>
//           <p className="text-[11px] text-muted-foreground/80 mt-0.5">
//             Ranked by total ticket booking volume and revenue
//           </p>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         {topCustomers.length === 0 ? (
//           <div className="text-center py-8 text-xs text-muted-foreground">
//             No booking records found.
//           </div>
//         ) : (
//           <table className="w-full text-left text-xs">
//             <thead>
//               <tr className="text-muted-foreground font-bold border-b border-border">
//                 <th className="pb-3 px-3">Customer Account</th>
//                 <th className="pb-3 px-3">Movies Booked</th>
//                 <th className="pb-3 px-3">Total Revenue</th>
//                 <th className="pb-3 px-3 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topCustomers.map((user, idx) => (
//                 <tr
//                   key={user.id}
//                   className="border-b border-border/50 hover:bg-foreground/[0.02] transition-colors group"
//                 >
//                   {/* Name / Profile */}
//                   <td className="py-3 px-3">
//                     <div className="flex items-center gap-2.5">
//                       <span className="text-[10px] text-muted-foreground/60 font-mono w-4">
//                         {idx + 1}.
//                       </span>
//                       <div>
//                         <div className="font-bold text-foreground group-hover:text-brand-lime transition-colors">
//                           {user.name}
//                         </div>
//                         <div className="text-[10px] text-muted-foreground">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Total tickets/movies counter */}
//                   <td className="py-3 px-3 text-muted-foreground font-mono">
//                     <div className="flex items-center gap-1.5">
//                       <Ticket size={12} className="text-muted-foreground/60" />
//                       <span className="font-medium">
//                         {user.moviesBooked} screenings
//                       </span>
//                     </div>
//                   </td>

//                   {/* Accumulated Money */}
//                   <td className="py-3 px-3 font-bold text-foreground font-mono">
//                     ${user.totalSpent.toFixed(2)}
//                   </td>

//                   {/* Message Hub Trigger */}
//                   <td className="py-3 px-3 text-right">
//                     <button
//                       onClick={() => handleMessageRedirect(user.id)}
//                       className="p-2 rounded-xl bg-foreground/[0.02] border border-border text-muted-foreground hover:text-black hover:bg-brand-lime hover:border-brand-lime transition-all duration-200 shadow-xs group/btn"
//                       title={`Message ${user.name}`}
//                     >
//                       <MessageSquare
//                         size={13}
//                         className="group-hover/btn:scale-110 transition-transform"
//                       />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Ticket, Loader2, Calendar, Clock, Phone, Mail, Film } from "lucide-react";

export default function BookingLedger() {
  const [showtimeGroups, setShowtimeGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowtimeBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/showtime-bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch customer booking ledger");
        }

        const json = await response.json();
        setShowtimeGroups(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeBookings();
  }, []);

  const handleMessageRedirect = (userId) => {
    window.location.href = `/admin/messages?user=${userId}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-card text-card-foreground border border-border rounded-2xl min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-2">Loading showtime ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-card text-destructive border border-destructive/20 rounded-2xl text-xs text-center">
        Error loading ledger data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showtimeGroups.length === 0 ? (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
          No showtime booking records found.
        </div>
      ) : (
        showtimeGroups.map((group) => (
          <div
            key={group.showtimeId}
            className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-xs transition-colors duration-200"
          >
            {/* Showtime Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-lime/10 text-brand-lime rounded-xl shrink-0">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    {group.filmName}
                    <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded-full font-mono text-muted-foreground">
                      {group.showtimeId}
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-brand-lime" />
                      {formatDate(group.showDate)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-brand-lime" />
                      {group.startTime ? group.startTime.substring(0, 5) : "00:00"}
                    </span>
                    <span>•</span>
                    <span>{group.screenName}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground font-mono self-start sm:self-auto bg-foreground/[0.03] px-3 py-1.5 rounded-xl border border-border">
                Total Customers: <span className="font-bold text-foreground">{group.customers.length}</span>
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-muted-foreground font-bold border-b border-border/50">
                    <th className="pb-2 px-3">#</th>
                    <th className="pb-2 px-3">Customer Name</th>
                    <th className="pb-2 px-3">Email & Contact</th>
                    <th className="pb-2 px-3">Seats Booked</th>
                    <th className="pb-2 px-3">Amount Paid</th>
                    <th className="pb-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {group.customers.map((cust, idx) => (
                    <tr
                      key={cust.bookingId}
                      className="border-b border-border/30 hover:bg-foreground/[0.02] transition-colors group"
                    >
                      <td className="py-3 px-3 text-[10px] text-muted-foreground/60 font-mono">
                        {idx + 1}.
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-foreground group-hover:text-brand-lime transition-colors">
                          {cust.name}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Mail size={11} className="text-muted-foreground/60" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80 mt-0.5">
                          <Phone size={10} className="text-muted-foreground/60" />
                          <span>{cust.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Ticket size={12} className="text-muted-foreground/60" />
                          <span className="font-medium text-foreground">{cust.seatsBooked} seats</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                        {formatCurrency(cust.paidAmount)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleMessageRedirect(cust.userId)}
                          className="p-1.5 rounded-xl bg-foreground/[0.02] border border-border text-muted-foreground hover:text-black hover:bg-brand-lime hover:border-brand-lime transition-all duration-200 shadow-xs group/btn"
                          title={`Message ${cust.name}`}
                        >
                          {/* <MessageSquare
                            size={13}
                            className="group-hover/btn:scale-110 transition-transform"
                          /> */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}