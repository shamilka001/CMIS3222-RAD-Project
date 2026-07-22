"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useSettings } from "@/context/SettingsContext";
import Sidebar from "@/app/admin/components/Sidebar";
import Header from "@/app/admin/components/Header";
import MetricsGrid from "@/app/admin/components/MetricsGrid";
import RevenueAnalytics from "@/app/admin/components/RevenueAnalytics"; // <-- Imported here
import BookingLedger from "@/app/admin/components/BookingLedger";
import ActivityAside from "@/app/admin/components/ActivityAside";
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

  // Protect Admin Route
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
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  const showAsideLog = visibleComponents.aside && activeTab === "overview";

  return (
    <div className="min-h-screen bg-background text-foreground flex p-3 gap-4 font-sans transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-4 max-h-[97vh] overflow-y-auto custom-scrollbar">
        <main
          className={
            `${showAsideLog 
              ? "xl:col-span-3" 
              : "xl:col-span-4"
            } space-y-4`
          }
        >
          <Header activeTab={activeTab} />

          {activeTab === "overview" && (
            <div className="space-y-6">
              {visibleComponents.metrics && <MetricsGrid />}

              {/* Replaced ChartsSection with Revenue Analytics module */}
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

        {showAsideLog && <ActivityAside />}
      </div>
    </div>
  );
}