/**
 * History Page
 * Shows list of past CV analyses
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History as HistoryIcon, FileText, Calendar, TrendingUp } from 'lucide-react';
import { analysisAPI } from '../config/api';
import Navbar from '../components/Layout/Navbar';
import Card from '../components/Common/Card';
import Loader from '../components/Common/Loader';

const History = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader text="Loading history..." />
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
              Analysis History
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            View your past CV analyses
          </p>
        </motion.div>

        {error && (
          <div className="mb-8">
            <Card className="p-6 border-red-200">
              <p className="text-red-600">{error}</p>
            </Card>
          </div>
        )}

        {analyses.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
      </div>
    </div>
  );
};

export default History;
