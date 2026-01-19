
import React, { useState } from 'react';
import { DownloadQueue, Priority } from '../types';

interface SchedulerModalProps {
  queues: DownloadQueue[];
  onUpdateQueue: (queueId: string, updates: Partial<DownloadQueue>) => void;
  onClose: () => void;
}

const SchedulerModal: React.FC<SchedulerModalProps> = ({ queues, onUpdateQueue, onClose }) => {
  const [selectedQueueId, setSelectedQueueId] = useState(queues[0]?.id || '');
  
  const selectedQueue = queues.find(q => q.id === selectedQueueId);

  const handleToggleQueue = () => {
    if (selectedQueue) {
      onUpdateQueue(selectedQueueId, { isRunning: !selectedQueue.isRunning });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[120] p-4 font-sans text-xs">
      <div className="bg-[#f0f0f0] border-2 border-white shadow-2xl rounded w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="bg-blue-800 text-white p-2 text-sm font-bold flex justify-between items-center select-none">
          <span>Scheduler & Queue Manager</span>
          <button onClick={onClose} className="hover:bg-red-500 px-2 transition-colors">✕</button>
        </div>

        <div className="flex-1 flex overflow-hidden h-[450px]">
          <div className="w-48 bg-white border-r border-gray-400 p-2 flex flex-col">
            <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase px-1">Active Queues</div>
            {queues.map(q => (
              <div 
                key={q.id}
                onClick={() => setSelectedQueueId(q.id)}
                className={`p-2 cursor-default flex items-center gap-2 border border-transparent rounded-sm transition-colors ${
                  selectedQueueId === q.id 
                  ? 'bg-blue-100 border-blue-300 font-bold' 
                  : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${q.isRunning ? 'bg-green-500' : 'bg-gray-300'}`} />
                {q.name}
              </div>
            ))}
            <button className="mt-auto p-2 text-blue-600 hover:bg-blue-50 text-center border border-dashed border-blue-300 rounded text-[10px]">
              + Create New Queue
            </button>
          </div>

          <div className="flex-1 p-5 space-y-6 overflow-y-auto bg-gray-50">
            {selectedQueue ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-800">{selectedQueue.name} Settings</h2>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${selectedQueue.isRunning ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {selectedQueue.isRunning ? 'Running' : 'Stopped'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <fieldset className="border border-gray-300 p-4 rounded bg-white shadow-sm">
                    <legend className="px-2 font-bold text-gray-700">Priority & Concurrency</legend>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Queue Priority:</label>
                        <select 
                          className="border border-gray-300 p-1 bg-white rounded shadow-inner"
                          value={selectedQueue.priority}
                          onChange={(e) => onUpdateQueue(selectedQueueId, { priority: e.target.value as Priority })}
                        >
                          {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Max Active Downloads:</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          className="border border-gray-300 p-1 bg-white rounded shadow-inner"
                          value={selectedQueue.maxActiveDownloads}
                          onChange={(e) => onUpdateQueue(selectedQueueId, { maxActiveDownloads: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border border-gray-300 p-4 rounded bg-white shadow-sm">
                    <legend className="px-2 font-bold text-gray-700">Schedule</legend>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Auto Start At:</label>
                        <input 
                          type="time" 
                          className="border border-gray-300 p-1 bg-white rounded shadow-inner"
                          value={selectedQueue.startTime || ''}
                          onChange={(e) => onUpdateQueue(selectedQueueId, { startTime: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Auto Stop At:</label>
                        <input 
                          type="time" 
                          className="border border-gray-300 p-1 bg-white rounded shadow-inner"
                          value={selectedQueue.stopTime || ''}
                          onChange={(e) => onUpdateQueue(selectedQueueId, { stopTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-3 rounded text-[11px] text-blue-800 italic">
                  Tip: Downloads in the {selectedQueue.name} will be processed {selectedQueue.priority.toLowerCase()}ly priority with up to {selectedQueue.maxActiveDownloads} parallel files.
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                Select a queue from the list to modify its settings.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-100 border-t border-gray-300 flex justify-between items-center">
          <button 
            onClick={handleToggleQueue}
            className={`px-6 py-2 rounded font-bold shadow-md transition-all active:scale-95 ${
              selectedQueue?.isRunning 
              ? 'bg-red-100 border border-red-400 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 border border-green-400 text-green-700 hover:bg-green-200'
            }`}
          >
            {selectedQueue?.isRunning ? 'Stop Queue' : 'Start Queue Now'}
          </button>
          
          <div className="flex gap-2">
            <button 
              className="bg-white border border-gray-400 px-6 py-2 hover:bg-gray-50 active:bg-gray-200 shadow-sm transition-colors"
              onClick={() => { alert("Settings applied to queue configuration database."); }}
            >
              Apply
            </button>
            <button 
              onClick={onClose}
              className="bg-white border border-gray-400 px-6 py-2 hover:bg-gray-50 active:bg-gray-200 shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerModal;
