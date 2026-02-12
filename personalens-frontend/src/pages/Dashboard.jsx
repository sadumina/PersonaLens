import { useState } from "react";
import UploadPanel from "../components/UploadPanel";
import KpiCard from "../components/KpiCard";
import ClusterChart from "../components/ClusterChart";
import PersonalityRadar from "../components/PersonalityRadar";
import SkillUniverse from "../components/SkillUniverse";

/**
 * PersonaLens Main Dashboard
 *
 * Responsibilities:
 * - Manage analyzed CV data state
 * - Render analytics components
 * - Provide premium AI SaaS UI structure
 */
export default function Dashboard() {
  const [data, setData] = useState(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#020617] p-10 overflow-hidden">

      {/* Animated Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-5xl font-extrabold text-white mb-12 tracking-tight">
          PersonaLens
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent ml-3">
            AI Intelligence Dashboard
          </span>
        </h1>

        {/* Upload Panel */}
        <UploadPanel setData={setData} />

        {/* Render analytics only after upload */}
        {data && (
          <div className="mt-12 space-y-10">

            {/* KPI Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <KpiCard
                title="Technical Score"
                value={`${data.total_score}%`}
              />
              <KpiCard
                title="Confidence Index"
                value={`${data.personality.confidence}%`}
              />
            </div>

            {/* Skill Cluster Bar Chart */}
            <ClusterChart clusters={data.clusters} />

            {/* Personality Radar */}
            <PersonalityRadar personality={data.personality} />

            {/* 3D Skill Universe */}
            <SkillUniverse clusters={data.clusters} />
          </div>
        )}
      </div>
    </div>
  );
}
