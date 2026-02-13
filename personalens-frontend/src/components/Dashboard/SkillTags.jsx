/**
 * SkillTags Component
 * Tag cloud of detected skills
 */
import React from 'react';
import { motion } from 'framer-motion';

const SkillTags = ({ skills }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {});
  
  // Color mapping for categories
  const categoryColors = {
    technical: 'bg-blue-100 text-blue-700 border-blue-300',
    soft_skills: 'bg-purple-100 text-purple-700 border-purple-300',
    languages: 'bg-green-100 text-green-700 border-green-300',
    tools: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    certifications: 'bg-pink-100 text-pink-700 border-pink-300',
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
            {category.replace('_', ' ')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 hover:scale-110 hover:shadow-md ${
                  categoryColors[category] || 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillTags;
