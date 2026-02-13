/**
 * Upload Page
 * CV upload and analysis page
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI } from '../config/api';
import Navbar from '../components/Layout/Navbar';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    
    if (!selectedFile) return;
    
    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 10MB limit');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const response = await analysisAPI.analyzeCV(file);
      setSuccess(true);
      
      // Wait for animation then navigate to dashboard
      setTimeout(() => {
        navigate(`/dashboard/${response.data.analysis_id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Upload Your CV
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your resume to get AI-powered insights and analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-12 transition-all duration-300 ${
                isDragging ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className={`p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-200 transition-all duration-300 ${
                  isDragging ? 'scale-110 animate-bounce' : file ? 'scale-105' : ''
                }`}>
                  {success ? (
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  ) : file ? (
                    <FileText className="w-12 h-12 text-blue-600" />
                  ) : (
                    <Upload className="w-12 h-12 text-blue-600" />
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {success ? 'Analysis Complete!' : file ? file.name : 'Drop your CV here'}
                  </h3>
                  <p className="text-gray-500">
                    {success 
                      ? 'Redirecting to dashboard...' 
                      : file 
                      ? `${(file.size / 1024).toFixed(2)} KB` 
                      : 'PDF files only, max 10MB'}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 bg-red-50 border-2 border-red-200 rounded-lg p-4 w-full"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-600">{error}</p>
                  </motion.div>
                )}

                {!file && !success && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button>
                      Select File
                    </Button>
                  </label>
                )}

                {file && !uploading && !success && (
                  <div className="flex gap-4">
                    <Button onClick={handleUpload}>
                      Analyze CV
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setFile(null);
                        setError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {uploading && (
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
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
