
import React, { useState } from 'react';

interface BrowserIntegrationModalProps {
  onClose: () => void;
}

const BrowserIntegrationModal: React.FC<BrowserIntegrationModalProps> = ({ onClose }) => {
  const [integrated, setIntegrated] = useState({
    chrome: true,
    firefox: true,
    edge: true,
    opera: false
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[150] p-4 font-sans text-xs">
      <div className="bg-[#f0f0f0] border-2 border-white shadow-2xl rounded w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-blue-800 text-white p-2 text-sm font-bold flex justify-between items-center select-none">
          <span>IDM Browser Integration Panel</span>
          <button onClick={onClose} className="hover:bg-red-500 px-2 transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <p className="font-bold text-gray-700">Check browsers to integrate IDM with:</p>
          
          <div className="space-y-3 bg-white border border-gray-400 p-4 rounded shadow-inner">
            {Object.entries(integrated).map(([browser, isChecked]) => (
              <label key={browser} className="flex items-center justify-between p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-300 font-bold uppercase text-[10px]`}>
                    {browser[0]}
                  </div>
                  <span className="capitalize font-semibold text-gray-700">{browser}</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => setIntegrated(prev => ({ ...prev, [browser]: !isChecked }))}
                  className="w-4 h-4"
                />
              </label>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-[10px] text-yellow-800 italic">
            Note: If the extension does not appear automatically in your browser, please visit the official store and search for "IDM Integration Module".
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={() => { alert("Integration settings saved and pushed to browser hooks."); onClose(); }}
              className="bg-gray-200 border border-gray-500 px-6 py-1.5 hover:bg-white active:bg-gray-300 shadow-sm font-bold text-gray-800"
            >
              Update Integration
            </button>
            <button 
              onClick={onClose}
              className="bg-gray-200 border border-gray-500 px-6 py-1.5 hover:bg-white active:bg-gray-300 shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserIntegrationModal;
