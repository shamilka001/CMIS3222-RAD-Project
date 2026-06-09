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

const AVAILABLE_GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
];
const AVAILABLE_TIMES = [
  { label: "2 AM", value: 2 },
  { label: "6 AM", value: 6 },
  { label: "10 AM", value: 10 },
  { label: "2 PM", value: 14 },
  { label: "6 PM", value: 18 },
  { label: "10 PM", value: 22 },
];

// Clean Default Export
export default function RevenuePrediction() {
  const [genre, setGenre] = useState("Action");
  const [selectedTimes, setSelectedTimes] = useState([2, 6, 10]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ genre, times: selectedTimes }),
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
      setData(result);
    } catch (err) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          AI Revenue Predictor
        </h2>
        <p className="text-sm text-muted-foreground">
          Predict potential profits based on movie genre and scheduled
          showtimes.
        </p>
      </div>

      <form
        onSubmit={handlePredict}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Select Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            {AVAILABLE_GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Times</label>
          <div className="flex flex-wrap gap-2 p-1 border border-border rounded-lg bg-background">
            {AVAILABLE_TIMES.map((t) => (
              <label
                key={t.value}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  selectedTimes.includes(t.value)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
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
        </div>

        <button
          type="submit"
          disabled={loading || selectedTimes.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? "Calculating..." : "Generate Predictions"}
        </button>
      </form>

      {error && (
        <div className="text-destructive bg-destructive/10 p-3 rounded-lg text-sm border border-destructive/20 break-words">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
          <div className="bg-background p-4 rounded-xl border border-border">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
              Profit Comparison (Bar)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
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
                    dataKey="profit"
                    name="Projected Profit ($)"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background p-4 rounded-xl border border-border">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
              Profit Trend (Line)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
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
                    dataKey="profit"
                    name="Projected Profit ($)"
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
