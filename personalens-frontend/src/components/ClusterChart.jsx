import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ClusterChart({ clusters }) {
  const data = Object.keys(clusters).map((key) => ({
    name: key,
    value: clusters[key],
  }));

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
      <h2 className="text-white text-lg mb-4">Skill Clusters</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
