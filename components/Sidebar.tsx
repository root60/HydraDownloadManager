
import React from 'react';
import { Category, DownloadQueue } from '../types';

interface SidebarProps {
  currentFilter: string;
  queues: DownloadQueue[];
  onFilterChange: (filter: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentFilter, onFilterChange, queues }) => {
  const categories = Object.values(Category);
  
  return (
    <div className="w-56 bg-[#000000] border-r border-red-900/20 flex flex-col h-full overflow-y-auto select-none">
      <div className="flex-1">
        <div className="p-3 bg-red-950/20 border-b border-red-900/30 font-black text-red-600 uppercase tracking-widest text-[10px] flex items-center gap-2 italic">
          <div className="w-2 h-2 bg-red-600 shadow-[0_0_5px_rgba(220,38,38,1)]" />
          Vault Categories
        </div>
        <ul className="py-2">
          {categories.map((cat) => (
            <li 
              key={cat}
              className={`px-6 py-2 cursor-pointer text-[11px] font-bold flex items-center space-x-2 transition-all border-l-2 ${
                currentFilter === cat 
                ? 'bg-red-900/10 border-red-600 text-white' 
                : 'border-transparent hover:bg-slate-900/50 text-slate-500 hover:text-slate-300'
              }`}
              onClick={() => onFilterChange(cat)}
            >
              <span>{cat}</span>
            </li>
          ))}
        </ul>

        <div className="p-3 bg-red-950/20 border-y border-red-900/30 font-black text-red-600 uppercase tracking-widest text-[10px] flex items-center gap-2 italic mt-4">
          <div className="w-2 h-2 bg-green-500 shadow-[0_0_5px_rgba(34,197,94,1)]" />
          Network Status
        </div>
        <ul className="py-2">
          {['All', 'Finished', 'Unfinished'].map((status) => (
            <li 
              key={status}
              className={`px-6 py-2 cursor-pointer text-[11px] font-bold flex items-center space-x-2 transition-all border-l-2 ${
                currentFilter === status 
                ? 'bg-red-900/10 border-red-600 text-white' 
                : 'border-transparent hover:bg-slate-900/50 text-slate-500 hover:text-slate-300'
              }`}
              onClick={() => onFilterChange(status)}
            >
              <span>{status} Tasks</span>
            </li>
          ))}
        </ul>

        <div className="p-3 bg-red-950/20 border-y border-red-900/30 font-black text-red-600 uppercase tracking-widest text-[10px] flex items-center gap-2 italic mt-4">
          <div className="w-2 h-2 bg-blue-500 animate-pulse" />
          Neural Queues
        </div>
        <ul className="py-2">
          {queues.map((q) => (
            <li 
              key={q.id}
              className={`px-6 py-2 cursor-pointer text-[11px] font-bold flex items-center space-x-2 transition-all border-l-2 ${
                currentFilter === `queue_${q.id}` 
                ? 'bg-red-900/10 border-red-600 text-white' 
                : 'border-transparent hover:bg-slate-900/50 text-slate-500 hover:text-slate-300'
              }`}
              onClick={() => onFilterChange(`queue_${q.id}`)}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${q.isRunning ? 'bg-green-500 green-glow' : 'bg-slate-700'}`} />
              <span className="truncate">{q.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 text-[9px] text-red-900 font-mono text-center border-t border-red-900/10 italic tracking-tighter uppercase">
        "Capture. Accelerate. Prevail."
      </div>
    </div>
  );
};

export default Sidebar;
