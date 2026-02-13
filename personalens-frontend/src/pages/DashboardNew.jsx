/**
 * Dashboard Page (New Version)
 * Displays CV analysis results with visualizations
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, Calendar, FileText } from 'lucide-react';
import { analysisAPI } from '../config/api';
import Navbar from '../components/Layout/Navbar';
import Card from '../components/Common/Card';
import Loader from '../components/Common/Loader';
import ScoreCircle from '../components/Dashboard/ScoreCircle';
import ClusterBars from '../components/Dashboard/ClusterBars';
import PersonalityRadar from '../components/Dashboard/PersonalityRadar';
import SkillTags from '../components/Dashboard/SkillTags';

const DashboardNew = () => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      const response = await analysisAPI.getAnalysisById(analysisId);
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to load analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader text="Loading analysis..." />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="p-8">
            <p className="text-red-600 text-center">{error || 'Analysis not found'}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CV Analysis Results
            </h1>
          </div>
          
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="font-medium">{analysis.filename}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Score Circle - Centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-12">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Overall Score</h2>
              <ScoreCircle score={analysis.total_score} size={250} />
            </div>
          </Card>
        </motion.div>

        {/* Skill Clusters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Skill Clusters</h2>
            </div>
            <ClusterBars clusters={analysis.clusters} />
          </Card>
        </motion.div>

        {/* Personality Traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Personality Analysis</h2>
            </div>
            <PersonalityRadar personality={analysis.personality} />
          </Card>
        </motion.div>

        {/* Detected Skills */}
        {analysis.detected_skills && analysis.detected_skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-cyan-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Detected Skills</h2>
              </div>
              <SkillTags skills={analysis.detected_skills} />
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardNew;
