"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Ticket, DollarSign, TrendingUp, Loader2 } from "lucide-react";

const fetchMovieStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Dune: Part Two", ticketsSold: 12500, ticketPrice: 3500 },
        { id: 2, title: "Deadpool & Wolverine", ticketsSold: 18200, ticketPrice: 3200 },
        { id: 3, title: "Furiosa", ticketsSold: 8400, ticketPrice: 3800 },
        { id: 4, title: "Inside Out 2", ticketsSold: 22000, ticketPrice: 2800 },
        { id: 5, title: "Civil War", ticketsSold: 6100, ticketPrice: 3500 },
      ]);
    }, 1200);
  });
};

export default function RevenueAnalytics() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMovieStats();
        const processedData = data.map(movie => ({
          ...movie,
          revenue: movie.ticketsSold * movie.ticketPrice
        }));
        
        const sortedData = processedData.sort((a, b) => b.revenue - a.revenue);
        setMovies(sortedData);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Format currency dynamically for Sri Lanka (LKR)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = movies.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalTickets = movies.reduce((acc, curr) => acc + curr.ticketsSold, 0);
  const topMovie = movies.length > 0 ? movies[0] : null;

  if (isLoading) {
    return (
      <div className="w-full py-12 bg-background flex flex-col items-center justify-center text-white border border-border rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-lime" />
        <p className="font-medium tracking-wide uppercase text-xs text-white">Loading Revenue Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-white">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Revenue Analytics</h2>
        <p className="text-white/70 text-sm mt-1">Real-time box office performance and ticket sales.</p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Gross Revenue</p>
              <h3 className="text-2xl font-black mt-1 text-emerald-400">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Total Tickets Sold</p>
              <h3 className="text-2xl font-black mt-1 text-blue-400">{totalTickets.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
              <Ticket size={18} />
            </div>
          </div>
        </div>

        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Top Performer</p>
              <h3 className="text-lg font-black mt-1 truncate max-w-[180px] text-white">{topMovie?.title}</h3>
              <p className="text-xs text-brand-lime font-bold mt-0.5">{formatCurrency(topMovie?.revenue || 0)}</p>
            </div>
            <div className="p-2.5 bg-brand-lime/10 rounded-xl text-brand-lime">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-card text-white border border-border rounded-2xl p-5 shadow-sm flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">Revenue Comparison</h4>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="title" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 11 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 11 }}
                  tickFormatter={(val) => `Rs. ${val / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#ffffff' }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {movies.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "var(--brand-lime, #84cc16)" : "#6b7280"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">Breakdown</h4>
          <div className="space-y-3">
            {movies.map((movie, index) => (
              <div key={movie.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm leading-none text-white">{movie.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/70">{movie.ticketsSold.toLocaleString()} tickets</span>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="text-xs text-white/70">{formatCurrency(movie.ticketPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className="font-black text-sm text-white">
                  {formatCurrency(movie.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}