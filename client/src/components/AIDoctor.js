import React, { useState } from 'react';
import axios from 'axios';
import { 
  Upload, Loader2, CheckCircle, AlertTriangle, MapPin, Info,
  Microscope, Stethoscope, Shield, Calendar, Leaf, Activity, Brain,
  FileText, ChevronRight, Coffee, Flame
} from 'lucide-react';

const AI_API = process.env.REACT_APP_AI_URL || 'http://localhost:8000';

const AIDoctor = ({ lang, user }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [showGradCam, setShowGradCam] = useState(false);
  const [cropType, setCropType] = useState('rice'); // 'rice', 'tea', or 'chili'

  const t = {
    en: {
      title: "Govi Isuru",
      sectionTitle: "🌾 AI Crop Diagnosis",
      subtitle: "The smart AI solution for farming",
      uploadTitle: "Upload Leaf Photo",
      uploadDesc: "Take a clear photo of the affected crop leaf for instant AI diagnosis.",
      analyzeBtn: "Analyze Crop",
      analyzing: "Analyzing...",
      results: "Diagnosis Report",
      treatment: "Recommended Treatment",
      footer: "Empowering Sri Lankan Farmers",
      steps: ["Uploading image...", "Running AI analysis...", "Generating diagnosis..."],
      diseaseDetected: "Disease Detected",
      confidence: "AI Confidence",
      whyDiagnosis: "Why this diagnosis?",
      gradcamExplain: "Red/yellow areas show where the AI model focused to identify the disease.",
      gradcamTrust: "This visual proof helps ensure the diagnosis is reliable.",
      viewAnalysis: "View AI Analysis",
      hide: "Hide",
      show: "Show",
      description: "Description",
      context: "Diagnosis Context",

      selectCrop: "Select Crop Type",
      rice: "Rice",
      tea: "Tea",
      chili: "Chili",
      riceDesc: "Analyze rice leaf diseases",
      teaDesc: "Analyze tea leaf diseases",
      chiliDesc: "Analyze chili plant diseases"
    },
    si: {
      title: "ගොවි ඉසුරු",
      sectionTitle: "🌾 AI බෝග රෝග විනිශ්චය",
      subtitle: "ගොවිතැනට සුහුරු AI විසඳුම",
      uploadTitle: "පත්‍ර ඡායාරූපය උඩුගත කරන්න",
      uploadDesc: "ක්ෂණික AI විශ්ලේෂණය සඳහා බලපෑමට ලක් වූ බෝග පත්‍රයේ පැහැදිලි ඡායාරූපයක් ගන්න.",
      analyzeBtn: "පරීක්ෂා කරන්න",
      analyzing: "විශ්ලේෂණය කරමින්...",
      results: "රෝග විනිශ්චය වාර්තාව",
      treatment: "නිර්දේශිත ප්‍රතිකාර",
      footer: "ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම",
      steps: ["පින්තූරය උඩුගත කරමින්...", "AI විශ්ලේෂණය ක්‍රියාත්මක කරමින්...", "විශ්ලේෂණය ජනනය කරමින්..."],
      diseaseDetected: "හඳුනාගත් රෝගය",
      confidence: "AI විශ්වාසනීයත්වය",
      whyDiagnosis: "මෙම විනිශ්චය ඇයි?",
      gradcamExplain: "රතු/කහ ප්‍රදේශ AI ආකෘතිය රෝගය හඳුනා ගැනීමට අවධානය යොමු කළ ස්ථාන පෙන්වයි.",
      gradcamTrust: "මෙම දෘශ්‍ය සාක්ෂිය විශ්ලේෂණය විශ්වසනීය බව සහතික කරයි.",
      viewAnalysis: "AI විශ්ලේෂණය බලන්න",
      hide: "සඟවන්න",
      show: "පෙන්වන්න",
      description: "විස්තරය",
      context: "විශ්ලේෂණ සන්දර්භය",

      selectCrop: "බෝග වර්ගය තෝරන්න",
      rice: "වී",
      tea: "තේ",
      chili: "මිරිස්",
      riceDesc: "වී පත්‍ර රෝග විශ්ලේෂණය",
      teaDesc: "තේ පත්‍ර රෝග විශ්ලේෂණය",
      chiliDesc: "මිරිස් ශාක රෝග විශ්ලේෂණය"
    }
  };

  const text = t[lang] || t.en;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setAnalysisStep(0);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setShowGradCam(false);
    setAnalysisStep(1);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate step progression for UX
      setTimeout(() => setAnalysisStep(2), 800);
      setTimeout(() => setAnalysisStep(3), 1600);

      // Use crop-specific endpoint
      const response = await axios.post(`${AI_API}/predict/${cropType}`, formData);
      const data = response.data;
      
      const mappedResult = {
        disease: data.prediction,
        si_name: data.si_name,
        confidence: data.confidence,
        treatment: Array.isArray(data.treatment) ? data.treatment.join('\n• ') : data.treatment,
        treatment_list: data.treatment,
        description: data.description,
        severity: data.severity,
        all_predictions: data.all_predictions,
        gradcam: data.gradcam,
        crop_type: data.crop_type
      };
      
      setResult(mappedResult);
      
      // Process prediction result
    } catch (error) {
      console.error("Error connecting to AI service", error);
      alert(lang === 'en' 
        ? "Unable to connect to AI service. Please try again." 
        : "AI සේවාවට සම්බන්ධ විය නොහැක. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
      setAnalysisStep(0);
    }
  };

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'high': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-500' };
      case 'medium': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-500' };
      case 'none': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-500' };
      default: return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-500' };
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <Stethoscope className="h-7 w-7" />
          {text.sectionTitle}
        </h2>
        <p className="text-gray-500 mt-1">{text.subtitle}</p>
      </div>

      {/* Crop Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">{text.selectCrop}</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => { setCropType('rice'); setResult(null); }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              cropType === 'rice' 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
            }`}
          >
            <div className={`p-2 rounded-lg ${cropType === 'rice' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Leaf className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className={`font-semibold ${cropType === 'rice' ? 'text-green-700' : 'text-gray-700'}`}>
                🌾 {text.rice}
              </div>
              <div className="text-xs text-gray-500">{text.riceDesc}</div>
            </div>
          </button>
          
          <button
            onClick={() => { setCropType('tea'); setResult(null); }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              cropType === 'tea' 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
            }`}
          >
            <div className={`p-2 rounded-lg ${cropType === 'tea' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Coffee className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className={`font-semibold ${cropType === 'tea' ? 'text-green-700' : 'text-gray-700'}`}>
                🍵 {text.tea}
              </div>
              <div className="text-xs text-gray-500">{text.teaDesc}</div>
            </div>
          </button>

          <button
            onClick={() => { setCropType('chili'); setResult(null); }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              cropType === 'chili' 
                ? 'border-red-500 bg-red-50 shadow-md' 
                : 'border-gray-200 hover:border-red-300 hover:bg-red-50/30'
            }`}
          >
            <div className={`p-2 rounded-lg ${cropType === 'chili' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Flame className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className={`font-semibold ${cropType === 'chili' ? 'text-red-700' : 'text-gray-700'}`}>
                🌶️ {text.chili}
              </div>
              <div className="text-xs text-gray-500">{text.chiliDesc}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          {/* Upload Area */}
          <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
            preview ? 'border-green-400 bg-green-50/50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/30'
          }`}>
            <div className="flex flex-col items-center gap-4">
              {preview ? (
                <div className="relative w-full">
                  <img 
                    src={preview} 
                    alt="Crop preview" 
                    className="w-full h-56 object-cover rounded-xl shadow-md" 
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Ready
                  </div>
                </div>
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex flex-col items-center justify-center">
                  <div className="p-4 bg-white rounded-full shadow-md mb-3">
                    <Upload className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{text.uploadTitle}</p>
                  <p className="text-xs text-gray-400 mt-1 text-center px-4">{text.uploadDesc}</p>
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2.5 file:px-5 
                  file:rounded-full file:border-0 
                  file:text-sm file:font-bold
                  file:bg-green-100 file:text-green-700 
                  hover:file:bg-green-200 file:cursor-pointer
                  file:transition-all file:duration-200"
              />
            </div>
          </div>

          {/* Analyze Button with Progress */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`w-full mt-5 py-4 rounded-xl font-bold text-white flex flex-col items-center justify-center gap-1 shadow-lg transition-all duration-300 ${
              !file ? 'bg-gray-300 cursor-not-allowed' : loading ? 'bg-green-600' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>{text.analyzing}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-200 mt-1">
                  {analysisStep > 0 && (
                    <>
                      <Activity className="h-3 w-3" />
                      <span>{text.steps[analysisStep - 1]}</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Microscope className="h-5 w-5" />
                <span>{text.analyzeBtn}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      {result && <hr className="my-8 border-green-100" />}

      {/* Results - Medical Report Style */}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
          {/* Report Header */}
          <div className={`px-6 py-4 border-b-2 ${getSeverityStyle(result.severity).bg} ${getSeverityStyle(result.severity).border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.severity === 'none' ? (
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className={`p-2 ${getSeverityStyle(result.severity).badge} rounded-lg`}>
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    {text.results}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">AI-Powered Analysis • Govi Isuru</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getSeverityStyle(result.severity).badge}`}>
                {result.severity === 'none' ? '✓ Healthy' : result.severity === 'high' ? '⚠ High Risk' : '⚡ Moderate'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Farmer Context Box */}
            {user && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{text.context}</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{user.gnDivision || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Leaf className="h-4 w-4 text-slate-400" />
                    <span>Rice</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{formatDate()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Disease Detection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🦠</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{text.diseaseDetected}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{result.disease}</p>
              {result.si_name && result.si_name !== result.disease && (
                <p className="text-base text-gray-500">{result.si_name}</p>
              )}
            </div>

            {/* Confidence Meter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{text.confidence}</span>
                <span className="ml-auto text-lg font-bold text-gray-900">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.confidence > 0.75 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                    result.confidence > 0.5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Description */}
            {result.description && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{text.description}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{result.description}</p>
              </div>
            )}

            {/* Grad-CAM Visualization - Enhanced */}
            {result.gradcam && (
              <div className="border border-purple-200 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50">
                <button
                  onClick={() => setShowGradCam(!showGradCam)}
                  className="w-full p-4 flex items-center justify-between text-sm font-bold text-purple-700 hover:bg-purple-100/50 transition"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    <span>🧠 {text.whyDiagnosis}</span>
                  </span>
                  <span className="text-xs bg-purple-200 px-3 py-1 rounded-full">
                    {showGradCam ? text.hide : text.show}
                  </span>
                </button>
                {showGradCam && (
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-xs text-purple-600 text-center bg-purple-100 rounded-lg p-2">
                      💡 {text.gradcamExplain}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-500 mb-2">Original</p>
                        <img src={preview} alt="Original" className="w-full h-36 object-cover rounded-xl shadow-md" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-500 mb-2">AI Focus</p>
                        <img 
                          src={`data:image/png;base64,${result.gradcam.overlay}`} 
                          alt="Grad-CAM" 
                          className="w-full h-36 object-cover rounded-xl shadow-md"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 italic flex items-center justify-center gap-1">
                      <Shield className="h-3 w-3" /> {text.gradcamTrust}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Treatment */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💊</span>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{text.treatment}</span>
              </div>
              {result.treatment_list ? (
                <ul className="space-y-2">
                  {result.treatment_list.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 text-sm">{result.treatment}</p>
              )}
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default AIDoctor;
