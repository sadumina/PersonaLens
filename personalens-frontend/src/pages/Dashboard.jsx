import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Activity, Brain, Sparkles, TrendingUp, Target } from 'lucide-react';

export default function PersonaLens() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock data for visualization
  const mockData = {
    technicalScore: 87,
    confidenceIndex: 92,
    clusters: [
      { name: 'Frontend', value: 85 },
      { name: 'Backend', value: 72 },
      { name: 'DevOps', value: 65 },
      { name: 'AI/ML', value: 78 },
      { name: 'Design', value: 68 }
    ],
    personality: [
      { trait: 'Leadership', value: 88 },
      { trait: 'Innovation', value: 92 },
      { trait: 'Collaboration', value: 85 },
      { trait: 'Technical', value: 90 },
      { trait: 'Communication', value: 82 }
    ]
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      processFile(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (uploadedFile) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50"
        ></motion.div>
      </div>

      {/* Animated Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.3
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Animated Dotted Pattern */}
      <motion.div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></motion.div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer"
              whileHover={{ 
                scale: 1.1, 
                rotate: 10,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(59, 130, 246, 0.2)",
                  "0 10px 40px rgba(59, 130, 246, 0.4)",
                  "0 10px 30px rgba(59, 130, 246, 0.2)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Brain className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              PersonaLens
            </h1>
          </div>
          
          <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
            AI Intelligence Dashboard
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            Advanced CV analysis powered by artificial intelligence. Upload your resume to unlock 
            deep insights into your technical capabilities, skill distribution, and personality signals 
            through multi-dimensional visualization.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative bg-white rounded-2xl border-2 transition-all duration-300 shadow-xl overflow-hidden group ${
              isDragging 
                ? 'border-blue-400 bg-blue-50/50 shadow-blue-200' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"></div>
            <div className="p-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className={`p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-200 transition-all duration-300 ${
                  isDragging ? 'scale-110 animate-bounce' : 'group-hover:scale-105 group-hover:animate-pulse group-hover:border-blue-300 group-hover:shadow-lg group-hover:shadow-blue-500/30'
                }`}>
                  <Upload className="w-12 h-12 text-blue-600" strokeWidth={2} />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {file ? file.name : 'Upload Your CV'}
                  </h3>
                  <p className="text-gray-500">
                    Drag and drop your PDF here, or click to browse
                  </p>
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    <span className="relative z-10">Select File</span>
                  </div>
                </label>

                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-blue-600 font-medium"
                  >
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Analyzing your CV with AI...</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* KPI Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-blue-200 group-hover:shadow-md group-hover:shadow-blue-500/30 cursor-pointer">
                        <Target className="w-6 h-6 text-blue-600 group-hover:animate-pulse" strokeWidth={2} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Technical Score</h3>
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      {mockData.technicalScore}%
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-purple-200 group-hover:shadow-md group-hover:shadow-purple-500/30 cursor-pointer">
                        <TrendingUp className="w-6 h-6 text-purple-600 group-hover:animate-pulse" strokeWidth={2} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Confidence Index</h3>
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      {mockData.confidenceIndex}%
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                </motion.div>
              </div>

              {/* Skill Clusters Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="w-6 h-6 text-blue-600" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Skill Clusters</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {mockData.clusters.map((cluster, index) => (
                      <motion.div
                        key={cluster.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700 font-medium">{cluster.name}</span>
                          <span className="text-blue-600 font-semibold">{cluster.value}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cluster.value}%` }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Personality Radar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Personality Signals</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {mockData.personality.map((trait, index) => (
                        <motion.div
                          key={trait.trait}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg"
                        >
                          <span className="text-gray-700 font-medium">{trait.trait}</span>
                          <span className="text-purple-600 font-semibold">{trait.value}%</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {/* Radar Chart Visualization */}
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          {/* Background circles */}
                          {[20, 40, 60, 80, 100].map((r) => (
                            <circle
                              key={r}
                              cx="100"
                              cy="100"
                              r={r}
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          ))}
                          
                          {/* Axis lines */}
                          {mockData.personality.map((_, index) => {
                            const angle = (index * 72 - 90) * (Math.PI / 180);
                            const x = 100 + 100 * Math.cos(angle);
                            const y = 100 + 100 * Math.sin(angle);
                            return (
                              <line
                                key={index}
                                x1="100"
                                y1="100"
                                x2={x}
                                y2={y}
                                stroke="#d1d5db"
                                strokeWidth="1"
                              />
                            );
                          })}
                          
                          {/* Data polygon */}
                          <motion.polygon
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            points={mockData.personality.map((trait, index) => {
                              const angle = (index * 72 - 90) * (Math.PI / 180);
                              const value = trait.value;
                              const x = 100 + value * Math.cos(angle);
                              const y = 100 + value * Math.sin(angle);
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="rgba(168, 85, 247, 0.15)"
                            stroke="#a855f7"
                            strokeWidth="3"
                          />
                          
                          {/* Data points */}
                          {mockData.personality.map((trait, index) => {
                            const angle = (index * 72 - 90) * (Math.PI / 180);
                            const value = trait.value;
                            const x = 100 + value * Math.cos(angle);
                            const y = 100 + value * Math.sin(angle);
                            return (
                              <motion.circle
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.3 + index * 0.05 }}
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#a855f7"
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3D Skill Universe */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Sparkles className="w-6 h-6 text-cyan-600" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">3D Skill Universe</h2>
                  </div>
                  
                  <div className="h-96 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 rounded-xl border-2 border-blue-100 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for 3D Canvas */}
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">3D visualization renders here</p>
                      <p className="text-gray-400 text-sm mt-2">Interactive skill sphere mapping</p>
                    </div>
                    
                    {/* Animated particles */}
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        initial={{
                          x: Math.random() * 100 + '%',
                          y: Math.random() * 100 + '%',
                        }}
                        animate={{
                          y: [null, Math.random() * 100 + '%'],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}