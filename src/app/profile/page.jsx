
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { authFetch } from "@/lib/api";
// import { motion } from "framer-motion";

// export default function ProfilePage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       try {
//         let userId;
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));
//           userId = payload.id;
//         } catch (e) {
//           throw new Error("token_malformed");
//         }

//         if (!userId) throw new Error("token_missing_id");

//         // 1. Fetch User Profile Details
//         const userRes = await authFetch(
//           `http://localhost:5000/user/get-by-id/${userId}`,
//         );
//         const contentType = userRes.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           throw new Error("server_error_not_json");
//         }

//         const responseData = await userRes.json();

//         if (userRes.ok && responseData && responseData.data) {
//           const userData = responseData.data;
//           setUser({
//             firstName: userData.first_name || "",
//             lastName: userData.last_name || "",
//             email: userData.email || "",
//             phoneNumber: userData.phone_number || "",
//             status: userData.status || "Active",
//             id: userData.user_id,
//           });
//         } else {
//           const fallbackMsg =
//             responseData?.message ||
//             responseData?.error ||
//             "Failed to load profile configuration metrics.";
//           throw new Error(fallbackMsg);
//         }

//         // 2. Fetch User Purchased Booking History
//         const bookingRes = await authFetch(
//           `http://localhost:5000/user/booking/${userId}`,
//         );
//         const bContentType = bookingRes.headers.get("content-type");

//         if (
//           bookingRes.ok &&
//           bContentType &&
//           bContentType.includes("application/json")
//         ) {
//           const bookingResult = await bookingRes.json();

//           if (bookingResult && bookingResult.data) {
//             setBookings(
//               Array.isArray(bookingResult.data) ? bookingResult.data : [],
//             );
//           } else {
//             setBookings(Array.isArray(bookingResult) ? bookingResult : []);
//           }
//         }
//       } catch (err) {
//         console.error("Profile fetch error caught cleanly:", err);

//         if (
//           err.message === "token_malformed" ||
//           err.message === "token_missing_id"
//         ) {
//           setError("Session expired or invalid. Please login again.");
//           localStorage.removeItem("token");
//           router.push("/login");
//         } else if (err.message === "server_error_not_json") {
//           setError(
//             "The server returned an invalid response format. Please contact engineering support.",
//           );
//         } else {
//           setError(err.message || "Unable to load account dataset metrics.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   // --- SORT BOOKINGS CHRONOLOGICALLY DESCENDING (MOST RECENT FIRST) ---
//   const sortedBookings = [...bookings].sort((a, b) => {
//     // Attempt parsing by specific booking date dimensions
//     const dateA = a.date ? new Date(a.date).getTime() : 0;
//     const dateB = b.date ? new Date(b.date).getTime() : 0;

//     // If both dates map cleanly, perform numeric timestamp sorting evaluation
//     if (dateA && dateB && dateA !== dateB) {
//       return dateB - dateA;
//     }

//     // Fallback: If date string values are identical or unparseable, arrange by booking identifier descending
//     return String(b.id || "").localeCompare(String(a.id || ""));
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-zinc-500 font-black tracking-[0.5em] animate-pulse uppercase">
//           Syncing Data...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
//       <Navbar />

//       <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-900/5 blur-[150px] -z-10" />

//       <motion.main
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-6xl mx-auto px-6 pt-32 pb-20"
//       >
//         {/* Header Block Section */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
//           <div>
//             <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
//               Your <span className="text-cyan-500">Account</span>
//             </h1>
//             <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
//               Dashboard / User Profile / {user?.firstName} {user?.lastName}
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               window.dispatchEvent(new Event("auth-change"));
//               router.push("/login");
//             }}
//             className="px-8 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all self-start"
//           >
//             Secure Logout
//           </button>
//         </div>

//         {error && (
//           <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs uppercase font-bold tracking-wider">
//             ⚠️ {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
//           {/* Left Sidebar Info Card */}
//           <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
//             <div className="bg-zinc-950/50 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
//               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-8">
//                 Personal Details
//               </h2>

//               <div className="space-y-8">
//                 <div>
//                   <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
//                     Full Name
//                   </label>
//                   <p className="text-xl font-black uppercase italic">
//                     {user?.firstName || user?.lastName
//                       ? `${user?.firstName} ${user?.lastName}`
//                       : "Unnamed Operator"}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
//                     Email Address
//                   </label>
//                   <p className="text-lg font-bold truncate">
//                     {user?.email || "Missing Dataset Entry"}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
//                     Phone Number
//                   </label>
//                   <p className="text-lg font-bold">
//                     {user?.phoneNumber || "Not Provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
//                     Account Status
//                   </label>
//                   <span className="inline-block mt-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest">
//                     {user?.status || "Active"}
//                   </span>
//                 </div>
//               </div>

//               {/* <button className="w-full mt-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
//                 Edit Information
//               </button> */}
//             </div>
//           </div>

//           {/* Right Main History Display Area */}
//           <div className="lg:col-span-8">
//             <div className="bg-zinc-950/50 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">
//                   Booking History
//                 </h2>
//                 <span className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md">
//                   {sortedBookings.length} Total Receipts
//                 </span>
//               </div>

//               {sortedBookings.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
//                   <div className="text-4xl mb-4">🎟️</div>
//                   <p className="text-xs font-black uppercase tracking-widest">
//                     No previous bookings found
//                   </p>
//                   <button
//                     onClick={() => router.push("/")}
//                     className="mt-6 text-cyan-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
//                   >
//                     Explore Now →
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
//                   {sortedBookings.map((booking) => (
//                     <div
//                       key={booking.id || Math.random().toString()}
//                       className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all backdrop-blur-md"
//                     >
//                       <div className="flex items-center gap-6">
//                         <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
//                           {booking.moviePoster ? (
//                             <img
//                               src={booking.moviePoster}
//                               alt={booking.movieTitle || "Movie Poster"}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <span className="text-2xl opacity-60">🎬</span>
//                           )}
//                         </div>

//                         <div>
//                           <p className="text-lg font-black uppercase italic group-hover:text-cyan-500 transition-colors line-clamp-1">
//                             {booking.movieTitle || "Unknown Feature Title"}
//                           </p>
//                           <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
//                             📅 {booking.date || "TBD"} • 🕒{" "}
//                             {booking.time
//                               ? booking.time.split(".")[0]
//                               : "00:00"}
//                           </p>
//                           <p className="text-[9px] text-cyan-500/70 font-black uppercase tracking-wider mt-1">
//                             Building:{" "}
//                             {booking.theaterName || "Standard Hall Complex"}
//                           </p>
//                           <p className="text-[8px] text-zinc-600 font-mono tracking-tighter mt-1 truncate max-w-[250px]">
//                             ID: {booking.id || "N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-2 border-t border-white/5 sm:border-none pt-4 sm:pt-0">
//                         <div>
//                           <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block sm:mb-1">
//                             Seats Assigned
//                           </span>
//                           <p className="text-xs font-black uppercase tracking-widest text-cyan-400 font-mono bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-1 rounded-lg">
//                             {Array.isArray(booking.seats) &&
//                             booking.seats.length > 0
//                               ? [...booking.seats].sort().join(", ")
//                               : "—"}
//                           </p>
//                         </div>
//                         <span
//                           className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
//                             booking.status === "CONFIRMED" ||
//                             booking.status === "PENDING"
//                               ? "bg-green-500/10 text-green-400 border border-green-500/20"
//                               : "bg-zinc-800 text-zinc-400"
//                           }`}
//                         >
//                           {booking.status || "UNKNOWN"}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.main>

//       <Footer />
//     </div>
//   );
// }






"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { authFetch } from "@/lib/api";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        let userId;
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id;
        } catch (e) {
          throw new Error("token_malformed");
        }

        if (!userId) throw new Error("token_missing_id");

        // 1. Fetch User Profile Details
        const userRes = await authFetch(
          `http://localhost:5000/user/get-by-id/${userId}`,
        );
        const contentType = userRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("server_error_not_json");
        }

        const responseData = await userRes.json();

        if (userRes.ok && responseData && responseData.data) {
          const userData = responseData.data;
          setUser({
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            email: userData.email || "",
            phoneNumber: userData.phone_number || "",
            status: userData.status || "Active",
            id: userData.user_id,
          });
        } else {
          const fallbackMsg =
            responseData?.message ||
            responseData?.error ||
            "Failed to load profile configuration metrics.";
          throw new Error(fallbackMsg);
        }

        // 2. Fetch User Purchased Booking History
        const bookingRes = await authFetch(
          `http://localhost:5000/user/booking/${userId}`,
        );
        const bContentType = bookingRes.headers.get("content-type");

        if (
          bookingRes.ok &&
          bContentType &&
          bContentType.includes("application/json")
        ) {
          const bookingResult = await bookingRes.json();

          if (bookingResult && bookingResult.data) {
            setBookings(
              Array.isArray(bookingResult.data) ? bookingResult.data : [],
            );
          } else {
            setBookings(Array.isArray(bookingResult) ? bookingResult : []);
          }
        }
      } catch (err) {
        console.error("Profile fetch error caught cleanly:", err);

        const normalizedErrorMessage = err.message ? err.message.toLowerCase() : "";

        // Frontend Interceptor Fix: Catches native malformed strings AND backend auth rejections
        if (
          err.message === "token_malformed" ||
          err.message === "token_missing_id" ||
          normalizedErrorMessage.includes("expired") ||
          normalizedErrorMessage.includes("invalid token") ||
          normalizedErrorMessage.includes("unauthorized")
        ) {
          setError("Session expired or invalid. Please login again.");
          localStorage.removeItem("token");
          // Dispatch event to update navbar/global states if necessary
          window.dispatchEvent(new Event("auth-change"));
          router.push("/login");
        } else if (err.message === "server_error_not_json") {
          setError(
            "The server returned an invalid response format. Please contact engineering support.",
          );
        } else {
          setError(err.message || "Unable to load account dataset metrics.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- SORT BOOKINGS CHRONOLOGICALLY DESCENDING (MOST RECENT FIRST) ---
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;

    if (dateA && dateB && dateA !== dateB) {
      return dateB - dateA;
    }

    return String(b.id || "").localeCompare(String(a.id || ""));
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 font-black tracking-[0.5em] animate-pulse uppercase">
          Syncing Data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-900/5 blur-[150px] -z-10" />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 pt-32 pb-20"
      >
        {/* Header Block Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Your <span className="text-cyan-500">Account</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
              Dashboard / User Profile / {user?.firstName} {user?.lastName}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.dispatchEvent(new Event("auth-change"));
              router.push("/login");
            }}
            className="px-8 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all self-start"
          >
            Secure Logout
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs uppercase font-bold tracking-wider">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Sidebar Info Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-8">
                Personal Details
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
                    Full Name
                  </label>
                  <p className="text-xl font-black uppercase italic">
                    {user?.firstName || user?.lastName
                      ? `${user?.firstName} ${user?.lastName}`
                      : "Unnamed Operator"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
                    Email Address
                  </label>
                  <p className="text-lg font-bold truncate">
                    {user?.email || "Missing Dataset Entry"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg font-bold">
                    {user?.phoneNumber || "Not Provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">
                    Account Status
                  </label>
                  <span className="inline-block mt-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest">
                    {user?.status || "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main History Display Area */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">
                  Booking History
                </h2>
                <span className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md">
                  {sortedBookings.length} Total Receipts
                </span>
              </div>

              {sortedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="text-4xl mb-4">🎟️</div>
                  <p className="text-xs font-black uppercase tracking-widest">
                    No previous bookings found
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-6 text-cyan-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    Explore Now →
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {sortedBookings.map((booking) => (
                    <div
                      key={booking.id || Math.random().toString()}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all backdrop-blur-md"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {booking.moviePoster ? (
                            <img
                              src={booking.moviePoster}
                              alt={booking.movieTitle || "Movie Poster"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl opacity-60">🎬</span>
                          )}
                        </div>

                        <div>
                          <p className="text-lg font-black uppercase italic group-hover:text-cyan-500 transition-colors line-clamp-1">
                            {booking.movieTitle || "Unknown Feature Title"}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            📅 {booking.date || "TBD"} • 🕒{" "}
                            {booking.time
                              ? booking.time.split(".")[0]
                              : "00:00"}
                          </p>
                          <p className="text-[9px] text-cyan-500/70 font-black uppercase tracking-wider mt-1">
                            Building:{" "}
                            {booking.theaterName || "Standard Hall Complex"}
                          </p>
                          <p className="text-[8px] text-zinc-600 font-mono tracking-tighter mt-1 truncate max-w-[250px]">
                            ID: {booking.id || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-2 border-t border-white/5 sm:border-none pt-4 sm:pt-0">
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block sm:mb-1">
                            Seats Assigned
                          </span>
                          <p className="text-xs font-black uppercase tracking-widest text-cyan-400 font-mono bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-1 rounded-lg">
                            {Array.isArray(booking.seats) &&
                            booking.seats.length > 0
                              ? [...booking.seats].sort().join(", ")
                              : "—"}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                            booking.status === "CONFIRMED" ||
                            booking.status === "PENDING"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {booking.status || "UNKNOWN"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}