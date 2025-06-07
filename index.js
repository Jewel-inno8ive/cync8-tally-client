import { app, BrowserWindow, ipcMain } from 'electron';
import keytar from 'keytar';
import path from 'path';
import { fileURLToPath } from 'url';
import syncCustomers from './src/services/customer-sync-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, 'src/renderer/index.html'));
  console.log('App started')
}
app.whenReady().then(createWindow);

ipcMain.on('save-credentials', async (event, { apiKey, organizationId, softwareId }) => {
  console.log("ipc")
  await keytar.setPassword('Cync8SyncApp', 'apiKey', apiKey);
  await keytar.setPassword('Cync8SyncApp', 'organizationId', organizationId);
  await keytar.setPassword('Cync8SyncApp', 'softwareId', softwareId);
  event.reply('credentials-saved');
  console.log('Credentials stored securely.');

  syncCustomers(BrowserWindow, apiKey, organizationId, softwareId);
});