
import React, { useState } from 'react';
import { analyzeDownloadUrl } from '../services/geminiService';
import { GoogleGenAI, Type } from "@google/genai";

interface AddDownloadModalProps {
  onClose: () => void;
  onAdd: (url: string, fileName: string, size: string, category: string) => void;
}

const AddDownloadModal: React.FC<AddDownloadModalProps> = ({ onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [batchStep, setBatchStep] = useState<'input' | 'review'>('input');
  const [url, setUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleAnalyzeSingle = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    const result = await analyzeDownloadUrl(url);
    setIsAnalyzing(false);
    if (result) {
      setSuggestion(result);
    }
  };

  const handleConfirmSingle = () => {
    if (suggestion) {
      onAdd(url, suggestion.fileName, suggestion.estimatedSize, suggestion.category);
    } else {
      const name = url.split('/').pop()?.split('?')[0] || 'unknown_file';
      onAdd(url, name, "Unknown", "Programs");
    }
    onClose();
  };

  const getCleanBatchUrls = () => {
    return batchUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
  };

  const handleConfirmBatch = async () => {
    const urls = getCleanBatchUrls();
    if (urls.length === 0) return;

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these URLs and provide file names, sizes, and categories for each. Return a JSON array of objects. URLs: ${urls.join(', ')}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                url: { type: Type.STRING },
                fileName: { type: Type.STRING },
                estimatedSize: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["url", "fileName", "estimatedSize", "category"]
            }
          }
        }
      });

      const results = JSON.parse(response.text);
      results.forEach((res: any) => {
        onAdd(res.url, res.fileName, res.estimatedSize, res.category);
      });
    } catch (error) {
      console.error("Batch Analysis Error:", error);
      urls.forEach(u => {
        const name = u.split('/').pop()?.split('?')[0] || 'batch_file';
        onAdd(u, name, "Unknown", "Programs");
      });
    } finally {
      setIsAnalyzing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f0f0f0] border-2 border-white shadow-2xl rounded w-full max-w-xl overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white p-2 text-sm font-bold flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-500 rounded-sm" />
            <span>{activeTab === 'single' ? 'Enter new address to download' : batchStep === 'input' ? 'Batch Download URLs' : 'Review Batch List'}</span>
          </div>
          <button onClick={onClose} className="hover:bg-red-500 px-2 transition-colors">X</button>
        </div>

        <div className="flex bg-gray-200 border-b border-gray-300">
          <button 
            onClick={() => { setActiveTab('single'); setBatchStep('input'); }}
            className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors ${activeTab === 'single' ? 'bg-[#f0f0f0] border-t-2 border-sky-500 text-sky-700' : 'hover:bg-gray-300 text-gray-600'}`}
          >
            Single URL
          </button>
          <button 
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors ${activeTab === 'batch' ? 'bg-[#f0f0f0] border-t-2 border-sky-500 text-sky-700' : 'hover:bg-gray-300 text-gray-600'}`}
          >
            Batch List
          </button>
        </div>
        
        <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[70vh]">
          {activeTab === 'single' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Address (URL):</label>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 border border-gray-400 p-2 text-sm bg-white focus:outline-none focus:border-sky-500 shadow-inner rounded"
                    placeholder="https://example.com/file.zip"
                  />
                  <button 
                    onClick={handleAnalyzeSingle}
                    disabled={isAnalyzing || !url}
                    className="bg-sky-600 text-white text-[10px] px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50 transition-colors shadow-md active:scale-95 font-bold uppercase"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Ask Hydra AI'}
                  </button>
                </div>
              </div>

              {suggestion && (
                <div className="bg-white border border-sky-200 p-4 rounded text-xs animate-in fade-in slide-in-from-top-2 shadow-sm">
                  <h3 className="font-bold text-sky-700 mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    Hydra Intelligence Suggestion
                  </h3>
                  <div className="grid grid-cols-2 gap-y-1 border-t border-sky-50 pt-2">
                    <span className="text-gray-500">File Name:</span> <span className="font-semibold truncate">{suggestion.fileName}</span>
                    <span className="text-gray-500">Est. Size:</span> <span className="font-semibold">{suggestion.estimatedSize}</span>
                    <span className="text-gray-500">Category:</span> <span className="font-semibold">{suggestion.category}</span>
                  </div>
                  {suggestion.description && (
                    <p className="mt-2 text-gray-500 italic border-t pt-2 border-gray-100">"{suggestion.description}"</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  onClick={handleConfirmSingle}
                  disabled={isAnalyzing || !url}
                  className="bg-white border border-gray-400 px-8 py-2 text-[10px] font-bold hover:bg-sky-50 hover:text-sky-700 active:bg-gray-200 transition-colors shadow-sm text-gray-800 disabled:opacity-50 rounded"
                >
                  OK
                </button>
                <button 
                  onClick={onClose}
                  className="bg-white border border-gray-400 px-8 py-2 text-[10px] font-bold hover:bg-gray-50 transition-colors shadow-sm text-gray-800 rounded"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {batchStep === 'input' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block">Enter URLs (one per line):</label>
                    <textarea 
                      autoFocus
                      value={batchUrls}
                      onChange={(e) => setBatchUrls(e.target.value)}
                      className="w-full h-48 border border-gray-400 p-2 text-sm bg-white focus:outline-none focus:border-sky-500 shadow-inner font-mono resize-none rounded"
                      placeholder="https://example.com/video1.mp4&#10;https://example.com/archive.zip"
                    />
                  </div>
                  <div className="bg-sky-50 p-3 border border-sky-200 rounded text-[10px] text-sky-800 italic">
                    Tip: Entering multiple URLs allows the Hydra AI to pre-segment the files for faster throughput.
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button 
                      onClick={() => setBatchStep('review')}
                      disabled={!batchUrls.trim()}
                      className="bg-sky-600 text-white px-8 py-2 text-[10px] font-bold hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-md uppercase disabled:opacity-50 rounded"
                    >
                      Process Batch
                    </button>
                    <button 
                      onClick={onClose}
                      className="bg-white border border-gray-400 px-8 py-2 text-[10px] font-bold hover:bg-gray-50 transition-colors shadow-sm text-gray-800 rounded"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-700">Confirm {getCleanBatchUrls().length} URLs</h3>
                    <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">Ready for Analysis</span>
                  </div>
                  <div className="border border-gray-300 bg-white rounded-md h-48 overflow-y-auto shadow-inner p-2">
                    <ul className="space-y-1">
                      {getCleanBatchUrls().map((u, i) => (
                        <li key={i} className="text-[11px] text-gray-600 border-b border-gray-50 pb-1 truncate flex items-center gap-2">
                          <span className="text-sky-400 font-mono text-[9px]">{i + 1}.</span> {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[10px] text-gray-500 text-center italic">Hydra AI will now analyze each URL to estimate sizes and optimize multi-head allocation.</p>
                  <div className="flex justify-end gap-2 pt-4">
                    <button 
                      onClick={handleConfirmBatch}
                      disabled={isAnalyzing}
                      className="bg-sky-600 text-white px-8 py-2 text-[10px] font-bold hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-md uppercase disabled:opacity-50 rounded"
                    >
                      {isAnalyzing ? 'Analyzing Batch...' : 'Confirm & Start AI'}
                    </button>
                    <button 
                      onClick={() => setBatchStep('input')}
                      disabled={isAnalyzing}
                      className="bg-white border border-gray-400 px-8 py-2 text-[10px] font-bold hover:bg-gray-50 transition-colors shadow-sm text-gray-800 rounded disabled:opacity-50"
                    >
                      BACK
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 p-2 text-[9px] text-gray-500 border-t border-gray-300 flex justify-center items-center gap-1 uppercase tracking-tighter">
          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
          Hydra Intelligence Engine (Powered by Gemini-3 Flash)
        </div>
      </div>
    </div>
  );
};

export default AddDownloadModal;
