

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Imported to securely verify role on mount

import { useSettings } from "@/context/SettingsContext";
import Sidebar from "@/app/admin/components/Sidebar";
import Header from "@/app/admin/components/Header";
import MetricsGrid from "@/app/admin/components/MetricsGrid";
import ChartsSection from "@/app/admin/components/ChartsSection";
import BookingLedger from "@/app/admin/components/BookingLedger";
import ActivityAside from "@/app/admin/components/ActivityAside";
import MovieManagement from "@/app/admin/components/MovieManagement";
import UserManagement from "@/app/admin/components/UserManagement";
import SeatingManagement from "@/app/admin/components/SeatingManagement";
import CashierTerminal from "@/app/admin/components/CashierTerminal";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { visibleComponents } = useSettings();

  useEffect(() => {
    // 1. Look for the correct token key used in your LoginPage
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Adjust path fallback cleanly
      return;
    }

    try {
      // 2. Extra Security: Verify the user role is indeed STAFF
      const decoded = jwtDecode(token);

      if (decoded.role !== "STAFF") {
        console.error("Access denied: Not a staff member.");
        router.push("/profile"); // Kick regular users to their profile page
        return;
      }

      // If token exists and user is STAFF, allow access
      setLoading(false);
    } catch (error) {
      console.error("Invalid token found:", error);
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading Admin Terminal...
      </div>
    );
  }

  const showAsideLog = visibleComponents.aside && activeTab === "overview";

  return (
    <div className="min-h-screen bg-background text-foreground flex p-3 gap-4 font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-4 max-h-[97vh] overflow-y-auto custom-scrollbar">
        <main
          className={`${showAsideLog ? "xl:col-span-3" : "xl:col-span-4"} space-y-4`}
        >
          <Header activeTab={activeTab} />

          {activeTab === "overview" && (
            <div className="space-y-4">
              {visibleComponents.metrics && <MetricsGrid />}
              {visibleComponents.charts && <ChartsSection />}
              {visibleComponents.ledger && <BookingLedger />}
            </div>
          )}

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
