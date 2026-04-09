export default function ContainerList({ containers }) {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl shadow-lg">
      <h3 className="mb-3 text-lg font-semibold">🐳 Containers</h3>

      <div className="space-y-2">
        {containers.map((c, i) => (
          <div
            key={i}
            className="flex justify-between bg-gray-800 p-3 rounded-lg"
          >
            <span>{c.container_name}</span>
            <span
              className={
                c.status === "running"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}