const { app, BrowserWindow, ipcMain } = require('electron');
const keytar = require('keytar');

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);

// Securely store API key/org ID
ipcMain.on('save-credentials', async (event, { apiKey, organizationId,softwareId }) => {
  await keytar.setPassword('Cync8SyncApp', 'apiKey', apiKey);
  await keytar.setPassword('Cync8SyncApp', 'organizationId', organizationId);
  await keytar.setPassword('Cync8SyncApp', 'softwareId', softwareId);
  event.reply('credentials-saved');
  console.log('Credentials stored securely.');

  // Start sync
  startSync(apiKey, organizationId, softwareId);
});

const axios = require('axios');

async function startSync(apiKey, organizationId, softwareId) {
  try {
    const result = await axios.get('http://20.2.90.36:3000/api/third-party/get-all-customers', {
      headers: { apiKey, organizationId, softwareId }
    });

    console.log('Synced:', result.data);

    // Send data to renderer
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('synced-data', result.data.data); // <-- send only the array
  } catch (error) {
    console.error('Sync failed:', error.message);
  }
}


