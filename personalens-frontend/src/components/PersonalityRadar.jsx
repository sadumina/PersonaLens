import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function PersonalityRadar({ personality }) {
  const data = Object.keys(personality).map((key) => ({
    trait: key,
    value: personality[key],
  }));

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
      <h2 className="text-white text-lg mb-4">Personality Signals</h2>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="trait" stroke="#fff" />
          <PolarRadiusAxis />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
