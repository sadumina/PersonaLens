/**
 * History Page
 * Shows list of past CV analyses
 * Accessible without login, but shows user-specific data when logged in
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History as HistoryIcon, FileText, Calendar, TrendingUp, LogIn, UserPlus, Upload as UploadIcon } from 'lucide-react';
import { analysisAPI } from '../config/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Layout/Navbar';
import Card from '../components/Common/Card';
import Loader from '../components/Common/Loader';

const History = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchHistory();
    }
  }, [isAuthenticated, authLoading]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await analysisAPI.getHistory();
      setAnalyses(response.data.analyses);
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader text="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <HistoryIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {isAuthenticated ? 'Your Analysis History' : 'Welcome to PersonaLens'}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {isAuthenticated 
              ? 'View your past CV analyses and track your progress' 
              : 'AI-powered CV analysis platform - Login to view your analysis history'}
          </p>
        </motion.div>

        {/* Not Authenticated - Welcome Screen */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
                    <HistoryIcon className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Unlock Your CV Analysis History
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  PersonaLens uses advanced AI to analyze your CV, providing insights into:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-blue-600 font-semibold mb-2">📊 Skill Analysis</div>
                    <p className="text-sm text-gray-600">Detailed breakdown of your technical and soft skills</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-purple-600 font-semibold mb-2">🧠 Personality Insights</div>
                    <p className="text-sm text-gray-600">Understanding your professional traits and strengths</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-green-600 font-semibold mb-2">📈 Score Tracking</div>
                    <p className="text-sm text-gray-600">Monitor your progress over time</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up Free</span>
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  Already have analyses? Login to see your complete history
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Authenticated - Show History */
          <>
            {error && (
              <div className="mb-8">
                <Card className="p-6 border-red-200">
                  <p className="text-red-600">{error}</p>
                </Card>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader text="Loading history..." />
              </div>
            ) : analyses.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <UploadIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No analyses yet</h3>
                  <p className="text-gray-500 mb-6">Upload your first CV to get started</p>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Upload CV
                  </button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6">
                {analyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.analysis_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      hover
                      onClick={() => navigate(`/dashboard/${analysis.analysis_id}`)}
                      className="p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {analysis.filename}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{new Date(analysis.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-gray-400" />
                              <span className={`text-2xl font-bold ${getScoreColor(analysis.total_score)}`}>
                                {Math.round(analysis.total_score)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Score</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
