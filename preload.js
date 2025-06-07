// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendCredentials: (data) => ipcRenderer.send('save-credentials', data),
  onSyncedData: (callback) => ipcRenderer.on('synced-data', (event, data) => callback(data)),
  onSyncError: (callback) => ipcRenderer.on('sync-error', (event, error) => callback(error)),
  onCredentialsSaved: (callback) => ipcRenderer.on('credentials-saved', () => callback())
});
