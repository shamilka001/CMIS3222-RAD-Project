// "use client"

// import { useState } from "react"
// import {
//   Users, ShieldAlert, Search, Trash2, Edit2, X,
//   DollarSign, Film, ShieldCheck, Mail, Tag, Key
// } from "lucide-react"

// export default function UserManagement() {
//   // 1. Core State View Anchors
//   const [activeSubTab, setActiveSubTab] = useState("customers") // customers | staff
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)

//   // 2. High-Density Mock Data Store Matrices
//   const [customers, setCustomers] = useState([
//     {
//       id: "usr_1", name: "Alex Mercer", email: "alex.m@gmail.com",
//       bookedMovies: ["Dune: Part Two", "Interstellar"],
//       favGenres: ["Sci-Fi", "Adventure"], totalSpend: 45.00
//     },
//     {
//       id: "usr_2", name: "Elena Rostova", email: "elena.r@outlook.com",
//       bookedMovies: ["Everything Everywhere All at Once"],
//       favGenres: ["Action", "Sci-Fi"], totalSpend: 12.50
//     },
//     {
//       id: "usr_3", name: "Marcus Vance", email: "vance.m@tech.io",
//       bookedMovies: ["Dune: Part Two", "Spider-Man"],
//       favGenres: ["Sci-Fi", "Action"], totalSpend: 30.00
//     }
//   ])

//   const [staff, setStaff] = useState([
//     {
//       id: "stf_1", name: "Sarah Connor", email: "sarah.c@maxlight.com",
//       role: "System Administrator", accessLevel: "Full Root Control"
//     },
//     {
//       id: "stf_2", name: "James Holden", email: "j.holden@maxlight.com",
//       role: "Floor Manager", accessLevel: "Schedules & Box Office"
//     }
//   ])

//   // Form Field Binder Trays
//   const [editForm, setEditForm] = useState({ name: "", email: "", extra: "" })

//   // --- CRUD DISPATCH IMPLEMENTATIONS ---
//   const openEditModal = (user) => {
//     setSelectedUser(user)
//     setEditForm({
//       name: user.name,
//       email: user.email,
//       extra: activeSubTab === "customers" ? user.favGenres.join(", ") : user.role
//     })
//     setIsEditModalOpen(true)
//   }

//   const handleEditSubmit = (e) => {
//     e.preventDefault()
//     if (activeSubTab === "customers") {
//       setCustomers(prev => prev.map(c => c.id === selectedUser.id ? {
//         ...c,
//         name: editForm.name,
//         email: editForm.email,
//         favGenres: editForm.extra.split(",").map(g => g.trim())
//       } : c))
//     } else {
//       setStaff(prev => prev.map(s => s.id === selectedUser.id ? {
//         ...s,
//         name: editForm.name,
//         email: editForm.email,
//         role: editForm.extra
//       } : s))
//     }
//     setIsEditModalOpen(false)
//   }

//   const handleDeleteTrace = (id, name) => {
//     if (confirm(`Are you absolutely sure you want to permanently purge ${name} from the database?`)) {
//       if (activeSubTab === "customers") {
//         setCustomers(prev => prev.filter(c => c.id !== id))
//       } else {
//         setStaff(prev => prev.filter(s => s.id !== id))
//       }
//     }
//   }

//   // Linear parsing loop modifiers
//   const filteredCustomers = customers.filter(c =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   const filteredStaff = staff.filter(s =>
//     s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   return (
//     <div className="w-full space-y-4 animate-fadeIn">

//       {/* Segment Navigation & Global Operational Search Bar Control Matrix */}
//       <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">

//         {/* Toggle Controls */}
//         <div className="flex gap-1.5 bg-input p-1 rounded-xl border border-border/80 w-full md:w-auto">
//           <button
//             onClick={() => { setActiveSubTab("customers"); setSearchQuery(""); }}
//             className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all w-full md:w-auto justify-center ${
//               activeSubTab === "customers" ? "bg-brand-lime text-black font-black" : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             <Users size={14} /> Registered Customers ({customers.length})
//           </button>
//           <button
//             onClick={() => { setActiveSubTab("staff"); setSearchQuery(""); }}
//             className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all w-full md:w-auto justify-center ${
//               activeSubTab === "staff" ? "bg-brand-lime text-black font-black" : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             <ShieldAlert size={14} /> Internal Staff Registry ({staff.length})
//           </button>
//         </div>

//         {/* Search Parameter Inputs */}
//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
//           <input
//             type="text"
//             placeholder={activeSubTab === "customers" ? "Search customer names or emails..." : "Search staff identifiers..."}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-input border border-border text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
//           />
//         </div>
//       </div>

//       {/* RENDER TRACK A: CUSTOMERS MASTER DATA ARCHITECTURE TABLE */}
//       {activeSubTab === "customers" && (
//         <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
//           <div className="w-full overflow-x-auto custom-scrollbar">
//             <table className="w-full border-collapse text-left">
//               <thead>
//                 <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
//                   <th className="p-4 pl-6 w-[25%]">Customer Profile</th>
//                   <th className="p-4 w-[25%]">Active Booked Features</th>
//                   <th className="p-4 w-[20%]">Favorite Genre Matrix</th>
//                   <th className="p-4 w-[15%]">Lifetime Revenue</th>
//                   <th className="p-4 pr-6 text-right w-[15%]">Actions Matrix</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
//                 {filteredCustomers.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="p-8 text-center text-muted-foreground/60 italic">No customer profiles found matching criteria.</td>
//                   </tr>
//                 ) : (
//                   filteredCustomers.map((user) => (
//                     <tr key={user.id} className="hover:bg-foreground/[0.01] transition-colors group">
//                       <td className="p-4 pl-6">
//                         <div className="space-y-0.5">
//                           <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150">{user.name}</span>
//                           <span className="text-[10px] text-muted-foreground/70 block flex items-center gap-1"><Mail size={10} /> {user.email}</span>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         {user.bookedMovies.length === 0 ? (
//                           <span className="text-[10px] text-muted-foreground/40 italic">No bookings logged</span>
//                         ) : (
//                           <div className="flex flex-col gap-0.5 max-w-[200px]">
//                             {user.bookedMovies.map((movie, idx) => (
//                               <span key={idx} className="text-[11px] text-foreground truncate flex items-center gap-1 font-semibold">
//                                 <Film size={10} className="text-brand-lime" /> {movie}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex flex-wrap gap-1 max-w-[180px]">
//                           {user.favGenres.map((genre, idx) => (
//                             <span key={idx} className="px-2 py-0.5 bg-input border border-border rounded text-[9px] font-bold tracking-tight text-muted-foreground">
//                               {genre}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="p-4 font-mono font-bold text-brand-lime dark:text-brand-lime/90">
//                         ${user.totalSpend.toFixed(2)}
//                       </td>
//                       <td className="p-4 pr-6 text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           <button
//                             onClick={() => openEditModal(user)}
//                             className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] border border-transparent hover:border-border transition-all"
//                             title="Modify Account Records"
//                           >
//                             <Edit2 size={13} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTrace(user.id, user.name)}
//                             className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
//                             title="Purge Profile"
//                           >
//                             <Trash2 size={13} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* RENDER TRACK B: STAFF REGISTRY CONTROL MATRIX DATA TABLE */}
//       {activeSubTab === "staff" && (
//         <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
//           <div className="w-full overflow-x-auto custom-scrollbar">
//             <table className="w-full border-collapse text-left">
//               <thead>
//                 <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
//                   <th className="p-4 pl-6 w-[35%]">Staff Operator Identity</th>
//                   <th className="p-4 w-[25%]">Assigned Functional Role</th>
//                   <th className="p-4 w-[25%]">Security Clearance Protocol</th>
//                   <th className="p-4 pr-6 text-right w-[15%]">Actions Matrix</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
//                 {filteredStaff.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="p-8 text-center text-muted-foreground/60 italic">No operations staff records located.</td>
//                   </tr>
//                 ) : (
//                   filteredStaff.map((member) => (
//                     <tr key={member.id} className="hover:bg-foreground/[0.01] transition-colors group">
//                       <td className="p-4 pl-6">
//                         <div className="space-y-0.5">
//                           <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150">{member.name}</span>
//                           <span className="text-[10px] text-muted-foreground/70 block flex items-center gap-1"><Mail size={10} /> {member.email}</span>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/[0.03] border border-border text-foreground font-semibold text-[11px]">
//                           <Key size={10} className="text-muted-foreground/60" /> {member.role}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded">
//                           {member.accessLevel}
//                         </span>
//                       </td>
//                       <td className="p-4 pr-6 text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           <button
//                             onClick={() => openEditModal(member)}
//                             className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] border border-transparent hover:border-border transition-all"
//                             title="Modify Operator Parameters"
//                           >
//                             <Edit2 size={13} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTrace(member.id, member.name)}
//                             className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
//                             title="Revoke Clearances & Purge"
//                           >
//                             <Trash2 size={13} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- FLOATING DIALOG OVERLAY INTERMEDIARY MODAL: DATA RECONCILIATION EDIT FORM --- */}
//       {isEditModalOpen && selectedUser && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
//                 <ShieldCheck size={16} className="text-brand-lime" /> Update Account File Context
//               </h3>
//               <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
//             </div>

//             <form onSubmit={handleEditSubmit} className="space-y-4">
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Legal Full Name</label>
//                 <input
//                   type="text" required
//                   value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-semibold"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Email Communication Endpoint</label>
//                 <input
//                   type="email" required
//                   value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                   {activeSubTab === "customers" ? "Preferred Genres (Comma Separated)" : "Assigned Staff Duty Title"}
//                 </label>
//                 <input
//                   type="text" required
//                   value={editForm.extra} onChange={e => setEditForm({...editForm, extra: e.target.value})}
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-medium"
//                 />
//               </div>
//               <button type="submit" className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm">
//                 Commit Reconciliation Adjustments
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  Search,
  Trash2,
  Edit2,
  X,
  Mail,
  Key,
  UserPlus,
} from "lucide-react";

export default function UserManagement() {
  // 1. Unified API Data Store State
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("customers"); // customers | staff
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Forms Visibility Flags
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form Value Binders (CamelCase matching Express req.body requirements)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    status: "ACTIVE",
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "STAFF",
    status: "ACTIVE",
  });

  // 2. Fetch Live Datastream from API Gateway
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/user/");
      if (response.ok) {
        const result = await response.json();
        setAllUsers(result.data || []);
      } else {
        console.error("Server returned an error status while syncing data.");
      }
    } catch (error) {
      console.error("Failed syncing master registry state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. Dynamic Filtering Matrices based on Backend Roles
  const customers = allUsers.filter(
    (u) => u.role === "USER" || u.role === "CUSTOMER",
  );
  const staff = allUsers.filter((u) => u.role === "STAFF");

  const filteredCustomers = customers.filter(
    (c) =>
      `${c.first_name} ${c.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredStaff = staff.filter(
    (s) =>
      `${s.first_name} ${s.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 4. Operational CRUD Dispatch Handlers
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number || "",
      status: user.status || "ACTIVE",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/user/update/${selectedUser.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            email: editForm.email,
            phoneNumber: editForm.phoneNumber,
            status: editForm.status,
            role: "STAFF", // Strictly preserving staff profile scope explicitly
          }),
        },
      );

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchUsers(); // Hot reload runtime tracking metrics
      } else {
        alert("Failed to submit account adjustments parameters.");
      }
    } catch (error) {
      console.error("Failed submitting account reconciliation patch:", error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      if (response.ok) {
        setIsRegisterModalOpen(false);
        // Reset state mapping defaults safely
        setRegisterForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          role: "STAFF",
          status: "ACTIVE",
        });
        fetchUsers();
      } else {
        alert("Failed to declare and register new staff parameters.");
      }
    } catch (error) {
      console.error("Failed deploying administrative record:", error);
    }
  };

  const handleDeleteTrace = async (id, name) => {
    if (
      confirm(
        `Are you absolutely sure you want to permanently purge staff operator ${name}?`,
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/delete/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          fetchUsers();
        } else {
          alert("Unauthorized or failed dropped trace operation.");
        }
      } catch (error) {
        console.error("Failed execution on tracking drop pipeline:", error);
      }
    }
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* Segment Navigation & Global Search Control Block */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap gap-1.5 bg-input p-1 rounded-xl border border-border/80 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("customers");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all w-full md:w-auto justify-center ${
              activeSubTab === "customers"
                ? "bg-brand-lime text-black font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={14} /> Registered Customers ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("staff");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all w-full md:w-auto justify-center ${
              activeSubTab === "staff"
                ? "bg-brand-lime text-black font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldAlert size={14} /> Internal Staff Registry ({staff.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              size={14}
            />
            <input
              type="text"
              placeholder={
                activeSubTab === "customers"
                  ? "Search customer names or emails..."
                  : "Search staff identifiers..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-input border border-border text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
            />
          </div>

          {/* Action Trigger for deploying internal Staff Only */}
          {activeSubTab === "staff" && (
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-lime text-black font-black text-xs rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
            >
              <UserPlus size={14} /> Add Staff
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-muted-foreground animate-pulse font-mono">
          Syncing master database clusters...
        </div>
      ) : (
        <>
          {/* TRACK A: CUSTOMERS DATA TABLE */}
          {activeSubTab === "customers" && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                      <th className="p-4 pl-6 w-[40%]">Customer Profile</th>
                      <th className="p-4 w-[30%]">Phone Number</th>
                      <th className="p-4 w-[15%]">Status Flags</th>
                      <th className="p-4 pr-6 text-right w-[15%]">
                        Actions Context
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-muted-foreground/60 italic"
                        >
                          No customer profiles found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((user) => (
                        <tr
                          key={user.user_id}
                          className="hover:bg-foreground/[0.01] transition-colors group"
                        >
                          <td className="p-4 pl-6">
                            <div className="space-y-0.5">
                              <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150">
                                {user.first_name} {user.last_name}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                                <Mail size={10} /> {user.email}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-muted-foreground">
                            {user.phone_number || "N/A"}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                user.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-rose-500/10 text-rose-400"
                              }`}
                            >
                              {user.status || "ACTIVE"}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right text-[10px] text-muted-foreground/40 italic select-none">
                            System Immutable
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TRACK B: STAFF REGISTRY CONTROL MATRIX */}
          {activeSubTab === "staff" && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                      <th className="p-4 pl-6 w-[35%]">
                        Staff Operator Identity
                      </th>
                      <th className="p-4 w-[25%]">Assigned Functional Role</th>
                      <th className="p-4 w-[25%]">Operational Status</th>
                      <th className="p-4 pr-6 text-right w-[15%]">
                        Actions Matrix
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
                    {filteredStaff.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-muted-foreground/60 italic"
                        >
                          No operations staff records located.
                        </td>
                      </tr>
                    ) : (
                      filteredStaff.map((member) => (
                        <tr
                          key={member.user_id}
                          className="hover:bg-foreground/[0.01] transition-colors group"
                        >
                          <td className="p-4 pl-6">
                            <div className="space-y-0.5">
                              <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150">
                                {member.first_name} {member.last_name}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                                <Mail size={10} /> {member.email}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/[0.03] border border-border text-foreground font-semibold text-[11px]">
                              <Key
                                size={10}
                                className="text-muted-foreground/60"
                              />{" "}
                              {member.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded ${
                                member.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {member.status || "ACTIVE"}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(member)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] border border-transparent hover:border-border transition-all"
                                title="Modify Operator Parameters"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteTrace(
                                    member.user_id,
                                    `${member.first_name} ${member.last_name}`,
                                  )
                                }
                                className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
                                title="Revoke Clearances & Purge"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- MODAL 1: EDIT STAFF PROFILE --- */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                Update Staff File Context
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Email Endpoint
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Account Status Protocol
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-semibold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-brand-lime text-black font-black uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm"
              >
                Commit Operations Patch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: REGISTER NEW STAFF --- */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                Deploy New Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.firstName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.lastName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Email Endpoint
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.phoneNumber}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Security Access Key (Password)
                </label>
                <input
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none text-foreground font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-brand-lime text-black font-black uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm"
              >
                Authorize Registry Deployment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
