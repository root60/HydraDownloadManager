
import React from 'react';
import { DownloadItem, DownloadStatus, ThreadStatus } from '../types';

interface DownloadProgressModalProps {
  item: DownloadItem;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const getStatusColor = (status: ThreadStatus) => {
  switch (status) {
    case ThreadStatus.CONNECTING: return 'bg-yellow-500';
    case ThreadStatus.REQUESTING: return 'bg-red-500';
    case ThreadStatus.RECEIVING: return 'bg-green-500';
    case ThreadStatus.COMPLETE: return 'bg-blue-600';
    default: return 'bg-slate-700';
  }
};

const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({ item, onPause, onResume, onCancel, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-[#0c0c0c] border border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.2)] rounded-sm w-full max-w-2xl overflow-hidden flex flex-col font-mono">
        <div className="bg-red-950/40 border-b border-red-900/50 text-red-500 p-3 text-xs font-black flex justify-between items-center select-none uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 animate-ping rounded-full" />
            <span>Hydra Session: {item.progress.toFixed(1)}% Accelerated Download</span>
          </div>
          <button onClick={onClose} className="hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4 text-[10px]">
            <div className="text-red-900 font-black uppercase">Session ID:</div>
            <div className="col-span-3 truncate text-slate-300 border-b border-red-900/20 pb-1">{item.name}</div>
            
            <div className="text-red-900 font-black uppercase">Vector:</div>
            <div className="col-span-3 flex items-center gap-4">
               <span className={item.status === DownloadStatus.DOWNLOADING ? 'text-red-500 animate-pulse' : 'text-slate-500'}>
                 {item.status.toUpperCase()}
               </span>
               <div className="flex gap-2">
                 {Object.values(ThreadStatus).slice(1, -1).map(s => (
                   <div key={s} className="flex items-center gap-1 opacity-40">
                     <div className={`w-1.5 h-1.5 ${getStatusColor(s as ThreadStatus)}`} />
                     <span className="text-[8px] tracking-tighter uppercase">{s}</span>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="text-red-900 font-black uppercase">Payload:</div>
            <div className="col-span-1 text-slate-400">{item.size}</div>
            <div className="text-red-900 font-black uppercase">Bitrate:</div>
            <div className="col-span-1 text-green-500 font-bold">{item.speed}</div>

            <div className="text-red-900 font-black uppercase">Time Left:</div>
            <div className="col-span-3 text-red-500">{item.timeLeft}</div>
          </div>

          <div className="space-y-2">
            <div className="relative h-12 bg-black border border-red-900/40 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-red-900/30 border-r border-red-500 transition-all duration-300 relative overflow-hidden"
                style={{ width: `${item.progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-scan" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-red-500 tracking-[0.5em] mix-blend-screen">
                {item.progress.toFixed(2)}% CAPTURED
              </div>
            </div>
          </div>

          <fieldset className="border border-red-900/20 p-4 rounded-sm bg-black/40">
            <legend className="px-2 text-[9px] font-black text-red-900 uppercase tracking-widest">
              Neural Head Allocation ({item.threads.length} Channels)
            </legend>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 mt-2">
              {item.threads.map((t) => (
                <div key={t.id} className="group relative">
                  <div className="h-2 bg-slate-900 border border-red-900/10 rounded-sm overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${getStatusColor(t.status)}`} 
                      style={{ width: `${t.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-center gap-4 pt-4">
            {item.status === DownloadStatus.DOWNLOADING ? (
              <button onClick={onPause} className="w-1/3 py-2 border border-red-600/50 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">Freeze</button>
            ) : (
              <button onClick={onResume} className="w-1/3 py-2 border border-green-600/50 bg-green-950/20 text-green-500 hover:bg-green-600 hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">Revive</button>
            )}
            <button onClick={onCancel} className="w-1/3 py-2 border border-slate-700 bg-slate-900 text-slate-500 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">Discard</button>
          </div>
        </div>
        
        <div className="bg-[#000000] p-3 text-[9px] text-center text-red-900 border-t border-red-900/30 font-black italic uppercase tracking-tighter">
          Security is just an illusion. RedHydra is the reality.
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DownloadProgressModal;
