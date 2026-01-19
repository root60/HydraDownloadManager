
import React from 'react';
import { DownloadItem, DownloadStatus } from '../types';

interface DownloadTableProps {
  downloads: DownloadItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const DownloadTable: React.FC<DownloadTableProps> = ({ downloads, selectedId, onSelect }) => {
  return (
    <div className="flex-1 overflow-auto bg-[#080808]">
      <table className="w-full text-left border-collapse min-w-[800px] font-sans">
        <thead className="sticky top-0 bg-[#000000] z-10">
          <tr className="border-b border-red-900/20">
            <th className="px-4 py-3 text-[10px] font-black text-red-700 uppercase tracking-widest w-1/4">IDENTIFIER</th>
            <th className="px-4 py-3 text-[10px] font-black text-red-700 uppercase tracking-widest">STATE</th>
            <th className="px-4 py-3 text-[10px] font-black text-red-700 uppercase tracking-widest">PAYLOAD</th>
            <th className="px-4 py-3 text-[10px] font-black text-red-700 uppercase tracking-widest">ETA</th>
            <th className="px-4 py-3 text-[10px] font-black text-red-700 uppercase tracking-widest">BITRATE</th>
            <th className="px-4 py-3 text-[10px] font-black text-red-700 uppercase tracking-widest">TIMESTAMP</th>
          </tr>
        </thead>
        <tbody>
          {downloads.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-40">
                <div className="flex flex-col items-center opacity-10">
                   <div className="text-6xl text-red-600">💀</div>
                   <div className="text-sm font-bold tracking-[0.3em] uppercase mt-4">No Sessions Detected</div>
                </div>
              </td>
            </tr>
          ) : (
            downloads.map((item) => (
              <tr 
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`cursor-default text-[11px] border-b border-red-900/5 transition-all duration-200 ${
                  selectedId === item.id ? 'bg-red-950/20' : 'hover:bg-slate-900/40'
                }`}
              >
                <td className="px-4 py-4 font-bold text-slate-200">
                  <div className="flex flex-col">
                    <span className="truncate max-w-xs">{item.name}</span>
                    {item.status === DownloadStatus.DOWNLOADING && (
                      <div className="w-full bg-slate-900 h-1 mt-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 h-full transition-all duration-300 green-glow" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter ${
                    item.status === DownloadStatus.COMPLETED ? 'bg-green-950/40 text-green-500' :
                    item.status === DownloadStatus.DOWNLOADING ? 'bg-red-900/40 text-red-500' :
                    item.status === DownloadStatus.ERROR ? 'bg-orange-950/40 text-orange-500 font-blink' :
                    'bg-slate-900 text-slate-500'
                  }`}>
                    {item.status} {item.status === DownloadStatus.DOWNLOADING ? `[${item.progress.toFixed(1)}%]` : ''}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-500 font-mono">{item.size}</td>
                <td className="px-4 py-4 text-slate-500 font-mono">{item.timeLeft}</td>
                <td className="px-4 py-4 text-green-600 font-mono font-bold">{item.speed}</td>
                <td className="px-4 py-4 text-slate-600 font-mono whitespace-nowrap">{item.addedDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DownloadTable;
