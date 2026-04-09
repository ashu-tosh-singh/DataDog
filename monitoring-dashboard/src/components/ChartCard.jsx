import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartCard({ title, dataKey, data, color, chartType }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      </div>

      {/* CHART */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <XAxis hide dataKey="created_at" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "none",
                  borderRadius: "10px",
                }}
              />
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
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
                stroke={color}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}