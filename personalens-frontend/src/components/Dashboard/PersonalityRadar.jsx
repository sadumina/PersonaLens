/**
 * PersonalityRadar Component
 * Radar chart for personality traits
 */
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const PersonalityRadar = ({ personality }) => {
  // Convert personality object to array
  const data = Object.entries(personality).map(([name, value]) => ({
    trait: name.charAt(0).toUpperCase() + name.slice(1),
    value: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="trait" 
          style={{ fontSize: '14px', fontWeight: 500 }}
          stroke="#6b7280"
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]}
          stroke="#6b7280"
        />
        <Radar
          name="Personality"
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.3}
          strokeWidth={2}
          animationDuration={1000}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PersonalityRadar;
