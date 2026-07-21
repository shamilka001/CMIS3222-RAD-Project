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
        { id: 1, title: "Dune: Part Two", ticketsSold: 12500, ticketPrice: 15.50 },
        { id: 2, title: "Deadpool & Wolverine", ticketsSold: 18200, ticketPrice: 14.00 },
        { id: 3, title: "Furiosa", ticketsSold: 8400, ticketPrice: 16.00 },
        { id: 4, title: "Inside Out 2", ticketsSold: 22000, ticketPrice: 12.50 },
        { id: 5, title: "Civil War", ticketsSold: 6100, ticketPrice: 15.00 },
      ]);
    }, 1200);
  });
};

export default function RevenuePage() {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = movies.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalTickets = movies.reduce((acc, curr) => acc + curr.ticketsSold, 0);
  const topMovie = movies.length > 0 ? movies[0] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-lime" />
        <p className="font-medium tracking-wide uppercase text-sm">Loading Revenue Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-6 md:p-10 text-foreground">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Revenue Analytics</h1>
        <p className="text-muted-foreground mt-2">Real-time box office performance and ticket sales.</p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gross Revenue</p>
              <h3 className="text-3xl font-black mt-1 text-emerald-500">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Tickets Sold</p>
              <h3 className="text-3xl font-black mt-1 text-blue-500">{totalTickets.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Ticket size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Performer</p>
              <h3 className="text-xl font-black mt-1 truncate max-w-[200px]">{topMovie?.title}</h3>
              <p className="text-sm text-brand-lime mt-1">{formatCurrency(topMovie?.revenue || 0)}</p>
            </div>
            <div className="p-3 bg-brand-lime/10 rounded-xl text-brand-lime">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Revenue Comparison</h4>
          <div className="flex-1 w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="title" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {movies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "var(--brand-lime, #84cc16)" : "hsl(var(--primary))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Breakdown</h4>
          <div className="space-y-4">
            {movies.map((movie, index) => (
              <div key={movie.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm leading-none">{movie.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{movie.ticketsSold.toLocaleString()} tickets</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-xs text-muted-foreground">${movie.ticketPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="font-black text-sm">
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