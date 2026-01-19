
import React from 'react';
import { AddUrlIcon, ResumeIcon, StopIcon, DeleteIcon, SettingsIcon, SchedulerIcon, GrabberIcon } from './Icons';

interface ToolbarProps {
  onAdd: () => void;
  onStop: () => void;
  onStopAll: () => void;
  onResume: () => void;
  onDelete: () => void;
  onDeleteFinished: () => void;
  onOptions: () => void;
  onScheduler: () => void;
  onGrabber: () => void;
  onIntegration: () => void;
  onAiToggle: () => void;
  isAiOptimized: boolean;
  selectedId: string | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onAdd, onStop, onStopAll, onResume, onDelete, onDeleteFinished, onOptions, onScheduler, onGrabber, onIntegration, onAiToggle, isAiOptimized, selectedId 
}) => {
  return (
    <div className="bg-[#0c0c0c] border-b border-red-900/20 p-2 flex items-center space-x-2 shadow-inner overflow-x-auto select-none">
      <ToolbarButton icon={<AddUrlIcon />} label="Inject Link" onClick={onAdd} color="text-red-500" />
      <div className="h-10 w-[1px] bg-red-900/20 mx-1" />
      <ToolbarButton icon={<ResumeIcon />} label="Wake Head" onClick={onResume} disabled={!selectedId} color="text-green-500" />
      <ToolbarButton icon={<StopIcon />} label="Freeze" onClick={onStop} disabled={!selectedId} color="text-slate-500" />
      <ToolbarButton icon={<StopIcon />} label="Panic All" onClick={onStopAll} color="text-red-700" />
      <div className="h-10 w-[1px] bg-red-900/20 mx-1" />
      <ToolbarButton icon={<DeleteIcon />} label="Sever" onClick={onDelete} disabled={!selectedId} color="text-slate-400" />
      <ToolbarButton icon={<DeleteIcon />} label="Purge" onClick={onDeleteFinished} color="text-slate-600" />
      <div className="h-10 w-[1px] bg-red-900/20 mx-1" />
      <ToolbarButton icon={<SettingsIcon />} label="RedConfig" onClick={onOptions} color="text-slate-400" />
      <ToolbarButton icon={<SchedulerIcon />} label="Timeline" onClick={onScheduler} color="text-red-400" />
      <ToolbarButton icon={<GrabberIcon />} label="HydraScout" onClick={onGrabber} color="text-green-600" />
      <div className="h-10 w-[1px] bg-red-900/20 mx-1" />
      <ToolbarButton 
        icon={<div className="w-6 h-6 rounded border border-red-600 flex items-center justify-center text-red-600 font-bold text-[8px]">WEB</div>} 
        label="Linker" 
        onClick={onIntegration} 
        color="text-red-500"
      />
      <ToolbarButton 
        icon={
          <div className={`w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${isAiOptimized ? 'bg-red-600 text-black shadow-[0_0_10px_rgba(220,38,38,1)]' : 'bg-slate-900 text-red-600 border border-red-900'}`}>
            AI
          </div>
        } 
        label={isAiOptimized ? "AI_ACTIVE" : "AI_IDLE"} 
        onClick={onAiToggle} 
        color={isAiOptimized ? "text-red-500" : "text-slate-600"}
      />
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean, color?: string }> = ({ 
  icon, label, onClick, disabled, color 
}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-2 rounded hover:bg-red-900/10 active:bg-red-900/20 transition-all min-w-[75px] border border-transparent hover:border-red-900/30 ${
      disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
    } ${color || 'text-slate-400'}`}
  >
    <div className="mb-0.5">{icon}</div>
    <span className="text-[9px] font-black whitespace-nowrap uppercase tracking-widest">{label}</span>
  </button>
);

export default Toolbar;
