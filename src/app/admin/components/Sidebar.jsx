// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Users, Film, BarChart3, Settings, LogOut, Armchair, Ticket } from "lucide-react"

// export default function Sidebar({ activeTab, setActiveTab }) {
//   const pathname = usePathname()

//   // Internal overview views
//   const menuItems = [
//     { id: 'overview', label: 'Overview', icon: BarChart3, type: 'tab' },
//     { id: 'movies', label: 'Movies', icon: Film, type: 'tab' },
//     { id: 'users', label: 'Users', icon: Users, type: 'tab' },
//     { id: 'seating', label: 'Seating', icon: Armchair, type: 'tab' },
//     { id: 'cashier', label: 'Cashier', icon: Ticket, type: 'tab' }, // <-- Added to Sidebar Array Matrix
//     { id: 'settings', label: 'Settings', icon: Settings, type: 'link', path: '/admin/settings' },
//   ]

//   // Detect if the user is currently looking at the standalone settings path
//   const isSettingsRoute = pathname === "/admin/settings"

//   return (
//     <aside className="w-64 h-[95vh] sticky top-[2.5vh] ml-4 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] rounded-[3rem] flex flex-col p-6 z-50 transition-colors duration-200 shadow-xs">

//       {/* Brand Node */}
//       <div className="mb-12 px-4">
//         <Link href="/admin" className="focus:outline-none group">
//           <span className="font-black italic uppercase tracking-tighter text-2xl text-brand-lime block transition-transform group-hover:scale-[1.02]">
//             MaxLight
//           </span>
//         </Link>
//         <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold mt-0.5">Admin Portal</p>
//       </div>

//       {/* Navigation Layer */}
//       <nav className="flex-1 space-y-2">
//         {menuItems.map((item) => {
//           const Icon = item.icon

//           // Determine active layout highlights dynamically based on state or path
//           const isActive = item.type === 'link'
//             ? isSettingsRoute
//             : (activeTab === item.id && !isSettingsRoute)

//           const activeClasses = "bg-brand-lime text-black font-black shadow-md shadow-brand-lime/10"
//           const inactiveClasses = "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"

//           // If it's a structural link button (like settings page), route with Next Link
//           if (item.type === 'link') {
//             return (
//               <Link
//                 key={item.id}
//                 href={item.path}
//                 className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
//               >
//                 <Icon size={20} className={isActive ? "text-black" : "text-muted-foreground/80"} />
//                 <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
//               </Link>
//             )
//           }

//           // Otherwise use standard react state setter for inner main-dashboard tabs
//           return (
//             <Link
//               key={item.id}
//               href="/admin"
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
//             >
//               <Icon size={20} className={isActive ? "text-black" : "text-muted-foreground/80"} />
//               <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Logout Structural Trigger */}
//       <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-auto">
//         <LogOut size={20} />
//         <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
//       </button>
//     </aside>
//   )
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Film,
  BarChart3,
  Settings,
  LogOut,
  Armchair,
  Ticket,
  BrainCircuit, // <-- Imported for the AI Predictor icon
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const pathname = usePathname();

  // Internal overview views
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3, type: "tab" },
    { id: "predict", label: "AI Prediction", icon: BrainCircuit, type: "tab" }, // <-- Added your new AI tab here
    { id: "movies", label: "Movies", icon: Film, type: "tab" },
    { id: "users", label: "Users", icon: Users, type: "tab" },
    { id: "seating", label: "Seating", icon: Armchair, type: "tab" },
    { id: "cashier", label: "Cashier", icon: Ticket, type: "tab" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      type: "link",
      path: "/admin/settings",
    },
  ];

  // Detect if the user is currently looking at the standalone settings path
  const isSettingsRoute = pathname === "/admin/settings";

  return (
    <aside className="w-64 h-[95vh] sticky top-[2.5vh] ml-4 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] rounded-[3rem] flex flex-col p-6 z-50 transition-colors duration-200 shadow-xs">
      {/* Brand Node */}
      <div className="mb-12 px-4">
        <Link href="/admin" className="focus:outline-none group">
          <span className="font-black italic uppercase tracking-tighter text-2xl text-brand-lime block transition-transform group-hover:scale-[1.02]">
            MaxLight
          </span>
        </Link>
        <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold mt-0.5">
          Admin Portal
        </p>
      </div>

      {/* Navigation Layer */}
      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;

          // Determine active layout highlights dynamically based on state or path
          const isActive =
            item.type === "link"
              ? isSettingsRoute
              : activeTab === item.id && !isSettingsRoute;

          const activeClasses =
            "bg-brand-lime text-black font-black shadow-md shadow-brand-lime/10";
          const inactiveClasses =
            "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground";

          // If it's a structural link button (like settings page), route with Next Link
          if (item.type === "link") {
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
              >
                <Icon
                  size={20}
                  className={
                    isActive ? "text-black" : "text-muted-foreground/80"
                  }
                />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </Link>
            );
          }

          // Otherwise use standard react state setter for inner main-dashboard tabs
          return (
            <Link
              key={item.id}
              href="/admin"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
            >
              <Icon
                size={20}
                className={isActive ? "text-black" : "text-muted-foreground/80"}
              />
              <span className="text-sm font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Structural Trigger */}
      <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-auto">
        <LogOut size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">
          Logout
        </span>
      </button>
    </aside>
  );
}
