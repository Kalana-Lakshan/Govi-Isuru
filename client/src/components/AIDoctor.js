import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Leaf, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';


const AIDoctor = ({ lang }) => {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const t = {
  en: {
    title: "Govi Isuru",
    subtitle: "The smart AI solution for farming",
    uploadTitle: "Upload Leaf Photo",
    uploadDesc: "Take a clear photo of the affected crop leaf.",
    analyzeBtn: "Analyze Crop",
    analyzing: "Analyzing...",
    results: "Diagnosis Results",
    treatment: "Recommended Treatment",
    footer: "Empowering Sri Lankan Farmers"
  },
  si: {
    title: "ගොවි ඉසුරු",
    subtitle: "ගොවිතැනට සුහුරු AI විසඳුම",
    uploadTitle: "ඡායාරූපය ඇතුලත් කරන්න",
    uploadDesc: "රෝගී ශාක පත්‍රයේ පැහැදිලි ඡායාරූපයක් ගන්න.",
    analyzeBtn: "පරීක්ෂා කරන්න",
    analyzing: "විශ්ලේෂණය කරමින්...",
    results: "රෝග විනිශ්චය",
    treatment: "නිර්දේශිත ප්‍රතිකාර",
    footer: "ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම"
  }
};
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error connecting to AI service", error);
      alert("Error: Is the Python backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 font-sans text-gray-800">
      

      <main className="max-w-md mx-auto mt-8 p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-800">{t[lang].subtitle}</h2>
          <p className="text-gray-600 mt-2">{t[lang].uploadDesc}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-dashed border-green-300 hover:border-green-500 transition-colors">
          <div className="flex flex-col items-center gap-4">
            {preview ? (
              <img src={preview} alt="Crop preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
            ) : (
              <div className="w-full h-32 bg-green-50 rounded-lg flex items-center justify-center">
                <Upload className="h-10 w-10 text-green-400" />
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`w-full mt-6 py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2 shadow-md transition-all ${
              !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? (
              <><Loader2 className="animate-spin h-5 w-5" /> {t[lang].analyzing}</>
            ) : (
              t[lang].analyzeBtn
            )}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
            <div className="bg-green-100 p-4 border-b border-green-200">
              <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                {t[lang].results}
              </h3>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Disease Detected</span>
                <p className="text-xl font-bold text-gray-800 mt-1">{result.disease}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-green-700">{(result.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {t[lang].treatment}
                </span>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                  {lang === 'si' && result.treatment_si ? result.treatment_si : result.treatment}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-gray-400 text-sm py-8">
        © 2024 {t[lang].title} - {t[lang].footer}
      </footer>
    </div>
  );
};

export default AIDoctor;