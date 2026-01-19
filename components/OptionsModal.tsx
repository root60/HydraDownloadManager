
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface OptionsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({ settings, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [localSettings, setLocalSettings] = useState(settings);

  const tabs = ['General', 'Heads (Connections)', 'File Types', 'Save To', 'Proxy', 'AI Tuning', 'Advanced'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
      <div className="bg-[#f0f2f5] border-2 border-white shadow-2xl rounded-lg w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white p-2.5 text-sm font-bold flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-500 rounded-sm" />
            <span>Hydra Download Manager Configuration</span>
          </div>
          <button onClick={onClose} className="hover:bg-red-500 px-2 transition-colors rounded">✕</button>
        </div>

        <div className="flex border-b border-slate-300 bg-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab 
                ? 'bg-[#f0f2f5] border-t-2 border-sky-500 text-sky-700' 
                : 'hover:bg-slate-300 text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 h-[420px] overflow-y-auto bg-[#f0f2f5]">
          {activeTab === 'General' && (
            <div className="space-y-4">
              <fieldset className="border border-slate-300 p-4 rounded-lg bg-white/50">
                <legend className="px-2 text-[10px] font-bold text-slate-500 uppercase">Hydra Integration</legend>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded text-sky-600" checked={localSettings.autoStart} onChange={(e) => setLocalSettings({...localSettings, autoStart: e.target.checked})} />
                    <span className="group-hover:text-sky-700 transition-colors">Summon Hydra on system startup</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded text-sky-600" defaultChecked />
                    <span className="group-hover:text-sky-700 transition-colors">Inject Hydra into all installed browsers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded text-sky-600" defaultChecked />
                    <span className="group-hover:text-sky-700 transition-colors">Watch clipboard for fresh links</span>
                  </label>
                </div>
              </fieldset>

              <fieldset className="border border-slate-300 p-4 rounded-lg bg-white/50">
                <legend className="px-2 text-[10px] font-bold text-slate-500 uppercase">Appearance</legend>
                <button className="text-[10px] font-bold bg-white border border-slate-300 px-4 py-2 rounded-md hover:bg-sky-50 hover:text-sky-700 transition-all shadow-sm">Customize Hydra Skins...</button>
              </fieldset>
            </div>
          )}

          {activeTab === 'Heads (Connections)' && (
            <div className="space-y-4 text-xs">
              <div className="bg-sky-50 border border-sky-100 p-3 rounded-md text-sky-800 italic mb-4">
                Hydra uses "Heads" to split files into segments. More heads allow for faster simultaneous packet retrieval.
              </div>
              
              <div className="space-y-2">
                <label className="font-bold block text-slate-700">Max connections (Heads) per task:</label>
                <select 
                  className="w-full border border-slate-300 p-2 bg-white rounded-md shadow-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                  value={localSettings.maxConnections}
                  onChange={(e) => setLocalSettings({...localSettings, maxConnections: Number(e.target.value)})}
                >
                  {[1, 2, 4, 8, 16, 24, 32, 64].map(n => <option key={n} value={n}>{n} Heads</option>)}
                </select>
                <p className="text-[10px] text-slate-500">Increasing this value uses more CPU but maximizes gigabit bandwidth.</p>
              </div>

              <fieldset className="border border-slate-300 p-4 rounded-lg bg-white/50 mt-6">
                <legend className="px-2 text-[10px] font-bold text-slate-500 uppercase">Speed Limiter</legend>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-sky-600"
                      checked={localSettings.isSpeedLimitEnabled} 
                      onChange={(e) => setLocalSettings({...localSettings, isSpeedLimitEnabled: e.target.checked})} 
                    />
                    Enable Global Throttle
                  </label>
                  <div className={`flex items-center gap-3 ml-7 transition-opacity ${!localSettings.isSpeedLimitEnabled ? 'opacity-30 pointer-events-none' : ''}`}>
                    <span>Cap speed at:</span>
                    <input 
                      type="number" 
                      className="border border-slate-300 p-1.5 w-24 bg-white rounded-md text-center" 
                      value={localSettings.speedLimit}
                      onChange={(e) => setLocalSettings({...localSettings, speedLimit: Number(e.target.value)})}
                    />
                    <span className="font-bold">KB/s</span>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* ... other tabs ... */}
          {!['General', 'Heads (Connections)'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center opacity-50">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
              </div>
              <div className="italic text-sm">Hydra {activeTab} Engine configuration is auto-optimized in web mode.</div>
            </div>
          )}
        </div>

        <div className="p-4 flex justify-end gap-3 border-t border-slate-300 bg-slate-50">
          <button 
            onClick={() => onSave(localSettings)}
            className="px-8 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-[11px] font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
          >
            APPLY CHANGES
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-md text-[11px] font-bold shadow-sm"
          >
            DISCARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;
