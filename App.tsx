
import React, { useState, useEffect, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import DownloadTable from './components/DownloadTable';
import AddDownloadModal from './components/AddDownloadModal';
import OptionsModal from './components/OptionsModal';
import DownloadProgressModal from './components/DownloadProgressModal';
import SchedulerModal from './components/SchedulerModal';
import GrabberModal from './components/GrabberModal';
import BrowserIntegrationModal from './components/BrowserIntegrationModal';
import { DownloadItem, DownloadStatus, Category, AppSettings, ThreadInfo, DownloadQueue, Priority, ThreadStatus } from './types';

// Using a placeholder variable for the logo URL - in a real app, this would be the local path to the uploaded image.
const LOGO_URL = "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png"; // Placeholder, but we'll style the UI to match the RedHydra image colors

const INITIAL_SETTINGS: AppSettings = {
  maxConnections: 32,
  speedLimit: 0,
  isSpeedLimitEnabled: false,
  savePath: 'C:\\Users\\RedHydra\\Downloads',
  autoStart: true,
  fileTypes: ['ZIP', 'EXE', 'PDF', 'MP4', 'MP3', 'ISO', 'RAR', 'MSI', 'DMG', 'PKG']
};

const DEFAULT_QUEUES: DownloadQueue[] = [
  { id: 'main', name: 'Hydra Core Queue', isRunning: true, priority: Priority.NORMAL, maxActiveDownloads: 8 },
  { id: 'stealth', name: 'Stealth Sync', isRunning: false, priority: Priority.HIGH, maxActiveDownloads: 4 },
  { id: 'media', name: 'RedStream Media', isRunning: false, priority: Priority.LOW, maxActiveDownloads: 2 },
];

const createThreads = (count: number): ThreadInfo[] => 
  Array.from({ length: count }, (_, i) => ({ 
    id: i, 
    progress: 0, 
    status: ThreadStatus.IDLE,
    bytesReceived: 0
  }));

const App: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('hdm_downloads');
    return saved ? JSON.parse(saved) : [];
  });
  const [queues, setQueues] = useState<DownloadQueue[]>(() => {
    const saved = localStorage.getItem('hdm_queues');
    return saved ? JSON.parse(saved) : DEFAULT_QUEUES;
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hdm_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isGrabberOpen, setIsGrabberOpen] = useState(false);
  const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [networkFactor, setNetworkFactor] = useState(1.0);
  const [isAiOptimized, setIsAiOptimized] = useState(true);

  useEffect(() => { localStorage.setItem('hdm_downloads', JSON.stringify(downloads)); }, [downloads]);
  useEffect(() => { localStorage.setItem('hdm_queues', JSON.stringify(queues)); }, [queues]);
  useEffect(() => { localStorage.setItem('hdm_settings', JSON.stringify(settings)); }, [settings]);

  useEffect(() => {
    const netInterval = setInterval(() => {
      setNetworkFactor(0.95 + Math.random() * 0.4);
    }, 2000);
    return () => clearInterval(netInterval);
  }, []);

  useEffect(() => {
    if (downloads.length === 0) {
      setDownloads([
        {
          id: '1',
          name: 'RedHydra_Security_Suite.exe',
          status: DownloadStatus.COMPLETED,
          size: '128.4 MB',
          sizeInBytes: 134637158,
          progress: 100,
          speed: '0 KB/s',
          speedInBytes: 0,
          timeLeft: 'Completed',
          category: Category.PROGRAMS,
          url: 'https://redhydra.io/suite.exe',
          addedDate: '2024-06-01 12:00:00',
          threads: createThreads(32).map(t => ({ ...t, status: ThreadStatus.COMPLETE, progress: 100 })),
          queueId: 'main',
          priority: Priority.HIGH
        }
      ]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(item => {
        const parentQueue = queues.find(q => q.id === item.queueId);
        if (item.status === DownloadStatus.DOWNLOADING) {
          if (parentQueue && !parentQueue.isRunning) {
             return { ...item, status: DownloadStatus.QUEUED, speed: '0 KB/s', timeLeft: 'Paused' };
          }
          
          const activeThreadsCount = settings.maxConnections;
          const accelerationFactor = Math.log10(activeThreadsCount + 1) * (isAiOptimized ? 5 : 3.5);
          let baseSpeedMbps = (60 + Math.random() * 100) * accelerationFactor * networkFactor; 
          
          if (settings.isSpeedLimitEnabled && settings.speedLimit > 0) {
            const limitMbps = (settings.speedLimit * 8) / 1024;
            baseSpeedMbps = Math.min(baseSpeedMbps, limitMbps);
          }

          const speedInBytesPerTick = (baseSpeedMbps * 1024 * 1024) / 8;
          const increment = (speedInBytesPerTick / item.sizeInBytes) * 100;
          const nextProgress = Math.min(100, item.progress + increment);
          
          const updatedThreads = item.threads.map((t, idx) => {
            if (nextProgress === 100) return { ...t, status: ThreadStatus.COMPLETE, progress: 100 };
            const dice = Math.random();
            let status = dice > 0.98 ? ThreadStatus.REQUESTING : dice > 0.95 ? ThreadStatus.CONNECTING : ThreadStatus.RECEIVING;
            const threadBoost = (1 + (Math.sin(Date.now() / 600 + idx) * 0.4));
            return {
              ...t,
              status,
              progress: Math.min(100, t.progress + (increment * threadBoost))
            };
          });

          const formatSpeed = (bytes: number) => {
            if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`;
            return `${(bytes / 1024).toFixed(1)} KB/s`;
          };

          const remainingBytes = item.sizeInBytes * (1 - nextProgress / 100);
          const secondsLeft = speedInBytesPerTick > 0 ? Math.ceil(remainingBytes / speedInBytesPerTick) : 0;
          const h = Math.floor(secondsLeft / 3600).toString().padStart(2, '0');
          const m = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0');
          const s = (secondsLeft % 60).toString().padStart(2, '0');

          return {
            ...item,
            progress: nextProgress,
            threads: updatedThreads,
            status: nextProgress === 100 ? DownloadStatus.COMPLETED : DownloadStatus.DOWNLOADING,
            speed: nextProgress === 100 ? '0 KB/s' : formatSpeed(speedInBytesPerTick),
            speedInBytes: speedInBytesPerTick,
            timeLeft: nextProgress === 100 ? 'Completed' : `${h}:${m}:${s}`
          };
        }
        return item;
      }));
    }, 300);
    return () => clearInterval(interval);
  }, [settings.isSpeedLimitEnabled, settings.speedLimit, settings.maxConnections, queues, networkFactor, isAiOptimized]);

  const handleAddDownload = (url: string, name: string, size: string, category: string) => {
    const num = parseFloat(size) || 200;
    let bytes = 500 * 1024 * 1024;
    if (size.includes('GB')) bytes = num * 1024 * 1024 * 1024;
    else if (size.includes('MB')) bytes = num * 1024 * 1024;
    else if (size.includes('KB')) bytes = num * 1024;

    const newItem: DownloadItem = {
      id: Date.now().toString(),
      name,
      status: DownloadStatus.DOWNLOADING,
      size,
      sizeInBytes: bytes,
      progress: 0,
      speed: 'Capturing Packets...',
      speedInBytes: 0,
      timeLeft: 'Infiltrating...',
      category: category as Category,
      url,
      addedDate: new Date().toISOString().replace('T', ' ').split('.')[0],
      threads: createThreads(settings.maxConnections),
      queueId: 'main',
      priority: Priority.NORMAL
    };
    setDownloads([newItem, ...downloads]);
    setIsAddModalOpen(false);
    setActiveDownloadId(newItem.id);
  };

  const handleDownloadExe = () => {
    if (confirm("Download RedHydra standalone executable for unrestricted throughput?")) {
      handleAddDownload('https://redhydra.io/download/setup_v3.exe', 'RedHydra_Setup_v3.exe', '28.5 MB', 'Programs');
    }
  };

  const handleToggleAi = () => setIsAiOptimized(!isAiOptimized);

  const handleStop = useCallback(() => {
    const idToStop = activeDownloadId || selectedId;
    if (!idToStop) return;
    setDownloads(prev => prev.map(item => 
      item.id === idToStop && item.status === DownloadStatus.DOWNLOADING 
        ? { ...item, status: DownloadStatus.PAUSED, speed: '0 KB/s', timeLeft: 'Paused' } 
        : item
    ));
    if (activeDownloadId === idToStop) setActiveDownloadId(null);
  }, [selectedId, activeDownloadId]);

  const handleResume = useCallback(() => {
    if (!selectedId) return;
    setDownloads(prev => prev.map(item => 
      item.id === selectedId && (item.status === DownloadStatus.PAUSED || item.status === DownloadStatus.QUEUED)
        ? { ...item, status: DownloadStatus.DOWNLOADING } 
        : item
    ));
  }, [selectedId]);

  const handleDelete = () => {
    if (!selectedId) return;
    if (confirm("Sever this Hydra head? This cannot be undone.")) {
      setDownloads(prev => prev.filter(item => item.id !== selectedId));
      setSelectedId(null);
      if (activeDownloadId === selectedId) setActiveDownloadId(null);
    }
  };

  const filteredDownloads = downloads.filter(item => {
    if (currentFilter === 'All') return true;
    if (currentFilter === 'Finished') return item.status === DownloadStatus.COMPLETED;
    if (currentFilter === 'Unfinished') return item.status !== DownloadStatus.COMPLETED;
    if (currentFilter.startsWith('queue_')) {
      const qId = currentFilter.replace('queue_', '');
      return item.queueId === qId;
    }
    return item.category === currentFilter;
  });

  const activeDownloadItem = downloads.find(d => d.id === (activeDownloadId || selectedId));

  return (
    <div className="h-screen flex flex-col bg-[#050505] select-none font-sans text-xs text-slate-300">
      <div className="bg-[#000000] text-slate-400 border-b border-red-900/50 px-4 py-2 flex items-center justify-between text-xs font-bold tracking-widest">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Visual representation of the logo provided in prompt */}
                <div className="absolute inset-0 border-2 border-red-600 rounded-full rotate-45"></div>
                <div className="w-5 h-5 bg-black border border-green-500 rounded-full flex items-center justify-center overflow-hidden">
                   <div className="text-green-500 text-[8px] animate-pulse">👽</div>
                </div>
             </div>
             <span className="text-red-600 font-black italic text-sm tracking-tighter">REDHYDRA HDM</span>
          </div>
          <div className="flex items-center space-x-4 opacity-70 hover:opacity-100 transition-opacity">
            {['Infiltrate', 'Vault', 'Heads', 'Interface', 'Help'].map(menu => (
              <div key={menu} className="px-1 cursor-pointer hover:text-white uppercase transition-colors">
                {menu}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1 bg-red-950/30 border border-red-600/50 text-red-500 rounded text-[9px] font-mono">
             SEC_STATUS: COMPROMISED
           </div>
           <button 
             onClick={handleDownloadExe}
             className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95"
           >
             Get EXE
           </button>
        </div>
      </div>

      <Toolbar 
        onAdd={() => setIsAddModalOpen(true)}
        onStop={handleStop}
        onStopAll={() => setDownloads(prev => prev.map(d => d.status === DownloadStatus.DOWNLOADING ? {...d, status: DownloadStatus.PAUSED} : d))}
        onResume={handleResume}
        onDelete={handleDelete}
        onDeleteFinished={() => setDownloads(prev => prev.filter(d => d.status !== DownloadStatus.COMPLETED))}
        onOptions={() => setIsOptionsOpen(true)}
        onScheduler={() => setIsSchedulerOpen(true)}
        onGrabber={() => setIsGrabberOpen(true)}
        onIntegration={() => setIsIntegrationOpen(true)}
        onAiToggle={handleToggleAi}
        isAiOptimized={isAiOptimized}
        selectedId={selectedId}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentFilter={currentFilter} 
          onFilterChange={setCurrentFilter}
          queues={queues}
        />
        
        <div className="flex-1 flex flex-col min-w-0 bg-[#080808] border-l border-red-900/20">
          <DownloadTable 
            downloads={filteredDownloads} 
            selectedId={selectedId}
            onSelect={(id) => { setSelectedId(id); const item = downloads.find(d => d.id === id); if (item?.status === DownloadStatus.DOWNLOADING) setActiveDownloadId(id); }}
          />
          
          <div className="bg-[#000000] border-t border-red-900/30 p-2 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center space-x-6 px-2">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" /> {filteredDownloads.length} SESSIONS ACTIVE</span>
              <span className="h-3 w-[1px] bg-red-900/50" />
              <span className={`uppercase tracking-widest ${isAiOptimized ? 'text-green-500 font-bold' : 'text-slate-500'}`}>
                {isAiOptimized ? '>>> NEURAL_ACCEL: ENABLED' : '>>> STANDARD_ACCEL'}
              </span>
              <span className="h-3 w-[1px] bg-red-900/50" />
              <span className="text-slate-500 italic">"Security is just an illusion"</span>
            </div>
            <div className={`px-4 py-1 rounded border transition-all duration-700 ${isAiOptimized ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-red-900 text-red-900'}`}>
              REDHYDRA ENGINE v3.0
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && <AddDownloadModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddDownload} />}
      {isOptionsOpen && <OptionsModal settings={settings} onSave={(s) => { setSettings(s); setIsOptionsOpen(false); }} onClose={() => setIsOptionsOpen(false)} />}
      {isSchedulerOpen && <SchedulerModal queues={queues} onUpdateQueue={(id, u) => setQueues(prev => prev.map(q => q.id === id ? {...q, ...u} : q))} onClose={() => setIsSchedulerOpen(false)} />}
      {isGrabberOpen && <GrabberModal onClose={() => setIsGrabberOpen(false)} onAddBatch={handleAddDownload} />}
      {isIntegrationOpen && <BrowserIntegrationModal onClose={() => setIsIntegrationOpen(false)} />}

      {activeDownloadId && activeDownloadItem && activeDownloadItem.status === DownloadStatus.DOWNLOADING && (
        <DownloadProgressModal 
          item={activeDownloadItem}
          onPause={handleStop}
          onResume={handleResume}
          onCancel={() => { handleStop(); setActiveDownloadId(null); }}
          onClose={() => setActiveDownloadId(null)}
        />
      )}
    </div>
  );
};

export default App;
