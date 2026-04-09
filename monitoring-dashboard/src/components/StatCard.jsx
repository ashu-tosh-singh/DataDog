export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl shadow-lg flex flex-col">
      <span className="text-gray-400 text-sm">{title}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}%</span>
    </div>
  );
}