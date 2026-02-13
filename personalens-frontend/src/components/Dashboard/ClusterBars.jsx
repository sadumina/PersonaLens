/**
 * ClusterBars Component
 * Bar chart for skill clusters
 */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ClusterBars = ({ clusters }) => {
  // Convert clusters object to array
  const data = Object.entries(clusters).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: value,
  }));
  
  // Color palette
  const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          style={{ fontSize: '14px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '14px' }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Bar 
          dataKey="score" 
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClusterBars;
