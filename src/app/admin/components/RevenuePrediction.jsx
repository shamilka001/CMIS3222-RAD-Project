"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Static genre to encoded index mapping matching your model configurations
const GENRE_MAPPING = [
  { name: "Action", encoded: 0 },
  { name: "Adventure", encoded: 1 },
  { name: "Animation", encoded: 2 },
  { name: "Comedy", encoded: 3 },
  { name: "Crime", encoded: 4 },
  { name: "Drama", encoded: 5 },
  { name: "Fantasy", encoded: 6 },
  { name: "Horror", encoded: 7 },
  { name: "Mystery", encoded: 8 },
  { name: "Romance", encoded: 9 },
  { name: "Sci-Fi", encoded: 10 },
  { name: "Thriller", encoded: 11 },
];

// Sequential continuous showtime array spanning from 10 AM to 7 PM
const AVAILABLE_TIMES = [
  { label: "10 AM", value: 10 },
  { label: "11 AM", value: 11 },
  { label: "12 PM", value: 12 },
  { label: "1 PM", value: 13 },
  { label: "2 PM", value: 14 },
  { label: "3 PM", value: 15 },
  { label: "4 PM", value: 16 },
  { label: "5 PM", value: 17 },
  { label: "6 PM", value: 18 },
  { label: "7 PM", value: 19 },
];

export default function RevenuePrediction() {
  // Input parameter states matching your exact training features
  const [genreEncoded, setGenreEncoded] = useState(10); // Defaults to Sci-Fi (10)
  const [selectedTimes, setSelectedTimes] = useState([]); // Empty by default; populated by user clicks
  const [day, setDay] = useState(5);
  const [ticketPrice, setTicketPrice] = useState(1200);
  const [capacity, setCapacity] = useState(200);
  const [quarter, setQuarter] = useState(3);

  // System states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamically handles checking and unchecking values from user interaction
  const handleTimeChange = (timeValue) => {
    if (selectedTimes.includes(timeValue)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== timeValue));
    } else {
      setSelectedTimes([...selectedTimes, timeValue]);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Dynamic payload compiling only the showtimes clicked by the user
    const payload = {
      genre_encoded: Number(genreEncoded),
      times: selectedTimes, // Dynamically parsed user selected times array
      day: Number(day),
      ticket_price: Number(ticketPrice),
      capacity: Number(capacity),
      quarter: Number(quarter),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const fallbackHtml = await response.text();
        console.error("Flask Backend Error HTML Context:", fallbackHtml);
        throw new Error(
          "Expected JSON from backend but got an HTML page error. Check your Flask terminal logs.",
        );
      }

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.predictions) {
        // Recharts sorts the items according to the array order.
        // Sorting chronologically ensures the trend lines render smoothly.
        const sortedData = result.predictions.sort(
          (a, b) => a.show_time_raw - b.show_time_raw,
        );
        setData(sortedData);
      } else {
        throw new Error("Invalid format received from the prediction service.");
      }
    } catch (err) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          AI Sales Predictor Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure model features and evaluate cross-conditional forecasting
          estimates dynamically.
        </p>
      </div>

      <form
        onSubmit={handlePredict}
        className="space-y-4 bg-background/50 p-5 rounded-lg border border-border"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Genre Column */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Film Genre
            </label>
            <select
              value={genreEncoded}
              onChange={(e) => setGenreEncoded(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            >
              {GENRE_MAPPING.map((g) => (
                <option key={g.encoded} value={g.encoded}>
                  {g.name} (Code: {g.encoded})
                </option>
              ))}
            </select>
          </div>

          {/* Ticket Price Column */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Ticket Price ($)
            </label>
            <input
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* Capacity Column */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Theatre Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* Day of Week Column */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Day of Week (0-6)
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* Quarter Column */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Yearly Quarter (1-4)
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || selectedTimes.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-colors text-sm h-10"
            >
              {loading ? "Calculating..." : "Generate Predictions"}
            </button>
          </div>
        </div>

        {/* Multi-Time Selector Row */}
        <div className="pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Select Target Showtimes <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-2 p-1.5 border border-border rounded-lg bg-background">
            {AVAILABLE_TIMES.map((t) => (
              <label
                key={t.value}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  selectedTimes.includes(t.value)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTimes.includes(t.value)}
                  onChange={() => handleTimeChange(t.value)}
                  className="hidden"
                />
                {t.label}
              </label>
            ))}
          </div>
          {selectedTimes.length === 0 && (
            <p className="text-xs text-amber-500 mt-1">
              Please select at least one showtime block to generate predictions.
            </p>
          )}
        </div>
      </form>

      {error && (
        <div className="text-destructive bg-destructive/10 p-3 rounded-lg text-sm border border-destructive/20 break-words">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
          {/* Bar Chart Visualization Container */}
          <div className="bg-background p-4 rounded-xl border border-border">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
              Model Revenue Estimation (Bar Analysis)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="time_label" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="predicted_sales"
                    name="Projected Total Sales ($)"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart Visualization Container */}
          <div className="bg-background p-4 rounded-xl border border-border">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
              Model Revenue Estimation (Trend Analysis)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="time_label" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="predicted_sales"
                    name="Sales Trend ($)"
                    stroke="#10b981"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
