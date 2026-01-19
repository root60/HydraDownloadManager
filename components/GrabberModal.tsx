
import React, { useState, useEffect } from 'react';

interface GrabberModalProps {
  onClose: () => void;
  onAddBatch: (url: string, name: string, size: string, category: string) => void;
}

const GrabberModal: React.FC<GrabberModalProps> = ({ onClose, onAddBatch }) => {
  const [step, setStep] = useState(1);
  const [site, setSite] = useState('');
  const [template, setTemplate] = useState('All images from the website');
  const [isCrawling, setIsCrawling] = useState(false);
  const [foundFiles, setFoundFiles] = useState<any[]>([]);

  const steps = [
    "Start Page",
    "Explore Settings",
    "Filter Settings",
    "Site Survey"
  ];

  useEffect(() => {
    if (step === 4 && site && !isCrawling && foundFiles.length === 0) {
      setIsCrawling(true);
      setTimeout(() => {
        const mockFiles = [
          { url: site + 'image1.jpg', name: 'image1.jpg', size: '1.2 MB', category: 'Compressed' },
          { url: site + 'hero_banner.png', name: 'hero_banner.png', size: '2.4 MB', category: 'Compressed' },
          { url: site + 'logo_vector.svg', name: 'logo_vector.svg', size: '45 KB', category: 'Documents' },
          { url: site + 'intro_video.mp4', name: 'intro_video.mp4', size: '142 MB', category: 'Video' },
        ].filter(f => {
          if (template.includes('images')) return f.name.match(/\.(jpg|png|svg)$/);
          if (template.includes('video')) return f.name.match(/\.(mp4)$/);
          return true;
        });
        setFoundFiles(mockFiles);
        setIsCrawling(false);
      }, 3000);
    }
  }, [step, site, template, isCrawling, foundFiles.length]);

  const handleFinish = () => {
    foundFiles.forEach(f => onAddBatch(f.url, f.name, f.size, f.category));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[130] p-4 font-sans text-xs">
      <div className="bg-[#f0f0f0] border-2 border-white shadow-2xl rounded w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white p-2 text-sm font-bold flex justify-between items-center select-none">
          <span>Hydra Site Grabber Wizard</span>
          <button onClick={onClose} className="hover:bg-red-500 px-2">✕</button>
        </div>

        <div className="flex flex-1 min-h-[450px]">
          <div className="w-48 bg-slate-200 border-r border-slate-300 p-4 space-y-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-2 transition-all ${step === i + 1 ? 'font-bold text-sky-800 translate-x-1' : 'text-slate-500'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${step === i + 1 ? 'bg-sky-600 border-sky-800 text-white' : 'bg-white border-slate-400'}`}>
                  {i + 1}
                </div>
                <span>{s}</span>
              </div>
            ))}
            <div className="pt-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center border-4 border-sky-200">
                <svg className="w-10 h-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <p className="text-[10px] text-sky-800 mt-2 font-bold italic">Hydra Scout</p>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 bg-white overflow-y-auto">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-sm font-bold text-slate-800">Step 1: Set the start page</h3>
                <p className="text-slate-600">Please enter the URL of the website you want to explore or grab files from.</p>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Page / Address:</label>
                  <input 
                    type="text" 
                    value={site} 
                    onChange={(e) => setSite(e.target.value)} 
                    placeholder="http://www.example.com/"
                    className="w-full border border-slate-300 p-2 bg-slate-50 rounded outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Project Template:</label>
                  <select 
                    className="w-full border border-slate-300 p-1.5 bg-slate-50 rounded outline-none"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option>All images from the website</option>
                    <option>All audio files from the website</option>
                    <option>All video files from the website</option>
                    <option>Whole website (mirrors)</option>
                    <option>Custom settings...</option>
                  </select>
                </div>
                <div className="bg-sky-50 p-3 border border-sky-100 rounded-lg italic text-sky-800 shadow-sm">
                  Tip: Use the Site Grabber to download specific content like galleries or video playlists from entire websites at once.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-sm font-bold text-slate-800">Step 2: Explore Settings</h3>
                <p className="text-slate-600">Configure how deep the Hydra Scout should delve into the site architecture.</p>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-sky-600" />
                    Explore all links on the start page
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-sky-600" />
                    Follow external links (off-site)
                  </label>
                  <div className="flex items-center gap-3">
                    <span>Crawl Depth:</span>
                    <input type="number" defaultValue={2} className="w-16 border border-slate-300 p-1 rounded" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-sm font-bold text-slate-800">Step 3: Filter Settings</h3>
                <p className="text-slate-600">Only capture files that match these specific extensions or patterns.</p>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Include Files Matching:</label>
                  <input 
                    type="text" 
                    defaultValue="*.jpg; *.png; *.gif; *.mp4"
                    className="w-full border border-slate-300 p-2 bg-slate-50 rounded outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Exclude Patterns:</label>
                  <input 
                    type="text" 
                    placeholder="ads.*; banner.*"
                    className="w-full border border-slate-300 p-2 bg-slate-50 rounded outline-none"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 h-full flex flex-col">
                <h3 className="text-sm font-bold text-slate-800">Step 4: Site Survey</h3>
                {isCrawling ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sky-700 font-bold animate-pulse">Hydra Scout is traversing the DOM...</p>
                    <div className="text-[10px] text-slate-400 font-mono">Requesting: {site}index.html</div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <p className="text-slate-600 mb-2">The survey is complete. {foundFiles.length} files were discovered.</p>
                    <div className="flex-1 border border-slate-200 rounded-lg overflow-auto bg-slate-50 shadow-inner">
                      <table className="w-full text-[10px]">
                        <thead className="sticky top-0 bg-slate-200">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Size</th>
                            <th className="p-2 text-left">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {foundFiles.map((f, i) => (
                            <tr key={i} className="border-b border-slate-100 hover:bg-sky-50 transition-colors">
                              <td className="p-2 truncate max-w-[200px]">{f.name}</td>
                              <td className="p-2">{f.size}</td>
                              <td className="p-2">{f.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-100 border-t border-slate-300 flex justify-end gap-2">
          <button 
            disabled={step === 1}
            onClick={() => setStep(s => s - 1)}
            className="bg-white border border-slate-400 px-8 py-1.5 hover:bg-slate-50 active:bg-slate-200 shadow-sm disabled:opacity-50 transition-all rounded-md"
          >
            &lt; Back
          </button>
          {step < 4 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              disabled={!site && step === 1}
              className="bg-sky-600 text-white border border-sky-700 px-8 py-1.5 hover:bg-sky-500 active:bg-sky-700 shadow-md font-bold rounded-md disabled:opacity-50 transition-all"
            >
              Next >
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              disabled={isCrawling || foundFiles.length === 0}
              className="bg-emerald-600 text-white border border-emerald-700 px-8 py-1.5 hover:bg-emerald-500 active:bg-emerald-700 shadow-md font-bold rounded-md disabled:opacity-50 transition-all"
            >
              Grab Selected
            </button>
          )}
          <button 
            onClick={onClose}
            className="bg-white border border-slate-400 px-8 py-1.5 hover:bg-slate-50 active:bg-slate-200 shadow-sm ml-4 rounded-md transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrabberModal;
