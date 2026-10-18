export interface VoiceRecordingRecord {
  id: string; // e.g., 'Mom', 'Dad', 'Friend', 'Teacher', 'Me'
  role: string;
  customLabel: string;
  blob: Blob;
  mimeType: string;
  durationSeconds: number;
  updatedAt: string;
}

const DB_NAME = 'ReclaimVoiceNudgesDB';
const STORE_NAME = 'recordings';
const DB_VERSION = 1;

function openVoiceDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllVoiceRecordings(): Promise<VoiceRecordingRecord[]> {
  try {
    const db = await openVoiceDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read unavailable:', err);
    return [];
  }
}

export async function saveVoiceRecording(record: VoiceRecordingRecord): Promise<void> {
  const db = await openVoiceDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteVoiceRecording(id: string): Promise<void> {
  const db = await openVoiceDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllVoiceRecordings(): Promise<void> {
  try {
    const db = await openVoiceDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear error:', err);
  }
}
