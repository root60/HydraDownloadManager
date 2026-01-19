
export enum DownloadStatus {
  DOWNLOADING = 'Downloading',
  PAUSED = 'Paused',
  COMPLETED = 'Completed',
  QUEUED = 'Queued',
  ERROR = 'Error'
}

export enum ThreadStatus {
  IDLE = 'Idle',
  CONNECTING = 'Connecting',
  REQUESTING = 'Requesting',
  RECEIVING = 'Receiving',
  RETRIEVING = 'Retrieving',
  COMPLETE = 'Complete'
}

export enum Category {
  ALL = 'All Downloads',
  COMPRESSED = 'Compressed',
  DOCUMENTS = 'Documents',
  MUSIC = 'Music',
  PROGRAMS = 'Programs',
  VIDEO = 'Video'
}

export enum Priority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High'
}

export interface ThreadInfo {
  id: number;
  progress: number;
  status: ThreadStatus;
  bytesReceived: number;
}

export interface DownloadQueue {
  id: string;
  name: string;
  isRunning: boolean;
  priority: Priority;
  startTime?: string; // HH:mm
  stopTime?: string;  // HH:mm
  maxActiveDownloads: number;
}

export interface DownloadItem {
  id: string;
  name: string;
  status: DownloadStatus;
  size: string;
  sizeInBytes: number;
  progress: number;
  speed: string;
  speedInBytes: number;
  timeLeft: string;
  category: Category;
  url: string;
  addedDate: string;
  description?: string;
  threads: ThreadInfo[];
  queueId: string;
  priority: Priority;
}

export interface AppSettings {
  maxConnections: number;
  speedLimit: number; // 0 for unlimited
  isSpeedLimitEnabled: boolean;
  savePath: string;
  autoStart: boolean;
  fileTypes: string[];
}
