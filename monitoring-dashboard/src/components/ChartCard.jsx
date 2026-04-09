import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartCard({ title, dataKey, data, color }) {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl shadow-lg">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis hide dataKey="created_at" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}