// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import dynamic from "next/dynamic";

// import { useSettings } from "@/context/SettingsContext";
// import Sidebar from "@/app/admin/components/Sidebar";
// import Header from "@/app/admin/components/Header";
// import MetricsGrid from "@/app/admin/components/MetricsGrid";
// import RevenueAnalytics from "@/app/admin/components/RevenueAnalytics"; // <-- Imported here
// import BookingLedger from "@/app/admin/components/BookingLedger";
// import ActivityAside from "@/app/admin/components/ActivityAside";
// import MovieManagement from "@/app/admin/components/MovieManagement";
// import UserManagement from "@/app/admin/components/UserManagement";
// import SeatingManagement from "@/app/admin/components/SeatingManagement";
// import CashierTerminal from "@/app/admin/components/CashierTerminal";

// const RevenuePrediction = dynamic(
//   () => import("@/app/admin/components/RevenuePrediction"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="p-6 text-muted-foreground animate-pulse">
//         Loading Analytics UI...
//       </div>
//     ),
//   }
// );

// export default function AdminDashboard() {
//   const router = useRouter();

//   const [authorized, setAuthorized] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");

//   const { visibleComponents } = useSettings();

//   // Protect Admin Route
//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         router.replace("/login");
//         return;
//       }

//       try {
//         const res = await fetch("http://localhost:5000/user/me", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           localStorage.removeItem("token");
//           router.replace("/login");
//           return;
//         }

//         setAuthorized(true);
//       } catch (error) {
//         console.error("Authentication error:", error);
//         localStorage.removeItem("token");
//         router.replace("/login");
//       }
//     };

//     verifyToken();
//   }, [router]);

//   if (!authorized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Checking authentication...
//       </div>
//     );
//   }

//   const showAsideLog = visibleComponents.aside && activeTab === "overview";

//   return (
//     <div className="min-h-screen bg-background text-foreground flex p-3 gap-4 font-sans transition-colors duration-300">
//       <Sidebar 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//       />

//       {/* Main Container taking up full width without column splitting */}
//       <div className="flex-1 max-h-[97vh] overflow-y-auto custom-scrollbar">
//         <main className="w-full space-y-4">
//           <Header activeTab={activeTab} />

//           {activeTab === "overview" && (
//             <div className="space-y-6">
//               {visibleComponents.metrics && <MetricsGrid />}

//               {/* Replaced ChartsSection with Revenue Analytics module */}
//               <RevenueAnalytics />

//               {visibleComponents.ledger && <BookingLedger />}
//             </div>
//           )}

//           {activeTab === "predict" && <RevenuePrediction />}
//           {activeTab === "movies" && <MovieManagement />}
//           {activeTab === "users" && <UserManagement />}
//           {activeTab === "seating" && <SeatingManagement />}
//           {activeTab === "cashier" && <CashierTerminal />}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useSettings } from "@/context/SettingsContext";
import Sidebar from "@/app/admin/components/Sidebar";
import Header from "@/app/admin/components/Header";
import MetricsGrid from "@/app/admin/components/MetricsGrid";
import RevenueAnalytics from "@/app/admin/components/RevenueAnalytics";
import BookingLedger from "@/app/admin/components/BookingLedger";
import MovieManagement from "@/app/admin/components/MovieManagement";
import UserManagement from "@/app/admin/components/UserManagement";
import SeatingManagement from "@/app/admin/components/SeatingManagement";
import CashierTerminal from "@/app/admin/components/CashierTerminal";

const RevenuePrediction = dynamic(
  () => import("@/app/admin/components/RevenuePrediction"),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading Analytics UI...
      </div>
    ),
  }
);

export default function AdminDashboard() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { visibleComponents } = useSettings();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    verifyToken();
  }, [router]);

  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        Checking authentication...
      </div>
    );
  }

  return (
    /* 1. Lock root container to exact viewport height and hide window scrollbars */
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex p-3 gap-4 font-sans transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* 2. Single scrollable container with slim modern scrollbar styling */}
      <div className="flex-1 h-full overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-700/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <main className="w-full space-y-4 pb-6">
          <Header activeTab={activeTab} />

          {activeTab === "overview" && (
            <div className="space-y-6">
              {visibleComponents.metrics && <MetricsGrid />}
              <RevenueAnalytics />
              {visibleComponents.ledger && <BookingLedger />}
            </div>
          )}

          {activeTab === "predict" && <RevenuePrediction />}
          {activeTab === "movies" && <MovieManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "seating" && <SeatingManagement />}
          {activeTab === "cashier" && <CashierTerminal />}
        </main>
      </div>
    </div>
  );
}