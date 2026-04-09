import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [metrics, setMetrics] = useState([]);

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
      <h1 className="text-3xl font-bold mb-6">
        🚀 DevOps Monitoring
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card title="CPU Usage" value={latest.cpu_usage} color="text-purple-400" />
        <Card title="Memory Usage" value={latest.memory_usage} color="text-green-400" />
        <Card title="Disk Usage" value={latest.disk_usage} color="text-orange-400" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-3 gap-6">
        <Chart title="CPU" data={metrics} dataKey="cpu_usage" stroke="#a855f7" />
        <Chart title="Memory" data={metrics} dataKey="memory_usage" stroke="#22c55e" />
        <Chart title="Disk" data={metrics} dataKey="disk_usage" stroke="#f97316" />
      </div>
    </div>
  );
}

// 🔥 STAT CARD
function Card({ title, value = 0, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-4xl font-bold mt-2 ${color}`}>
        {Number(value || 0).toFixed(2)}%
      </h2>
    </div>
  );
}

// 📊 CHART
function Chart({ title, data, dataKey, stroke }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
      <h3 className="mb-3 text-lg text-gray-300">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis hide dataKey="created_at" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "none",
              borderRadius: "10px",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}