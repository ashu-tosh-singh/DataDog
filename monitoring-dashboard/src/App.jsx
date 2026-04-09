import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import ChartCard from "./components/ChartCard";

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    const { data } = await supabase
      .from("metrics")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50);

    if (data) setMetrics(data);
  }

  const latest = metrics[metrics.length - 1] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-6 text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          🚀 DevOps Monitoring
        </h1>

        {/* GLOBAL TOGGLE */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setChartType("line")}
            className={`px-4 py-1 text-sm rounded-md transition ${
              chartType === "line"
                ? "bg-purple-500 text-white"
                : "text-gray-400"
            }`}
          >
            Line
          </button>

          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-1 text-sm rounded-md transition ${
              chartType === "bar"
                ? "bg-purple-500 text-white"
                : "text-gray-400"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard title="CPU Usage" value={latest.cpu_usage} color="text-purple-400" />
        <StatCard title="Memory Usage" value={latest.memory_usage} color="text-green-400" />
        <StatCard title="Disk Usage" value={latest.disk_usage} color="text-orange-400" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-3 gap-6">
        <ChartCard
          title="CPU"
          data={metrics}
          dataKey="cpu_usage"
          color="#a855f7"
          chartType={chartType}
        />

        <ChartCard
          title="Memory"
          data={metrics}
          dataKey="memory_usage"
          color="#22c55e"
          chartType={chartType}
        />

        <ChartCard
          title="Disk"
          data={metrics}
          dataKey="disk_usage"
          color="#f97316"
          chartType={chartType}
        />
      </div>
    </div>
  );
}

// 🔥 STAT CARD
function StatCard({ title, value = 0, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-4xl font-bold mt-2 ${color}`}>
        {Number(value || 0).toFixed(2)}%
      </h2>
    </div>
  );
}