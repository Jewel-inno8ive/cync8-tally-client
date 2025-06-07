import pushCustomerToTally from './push-to-tally-service.js';
import axios from 'axios';

export default async function syncCustomers(BrowserWindow, apiKey, organizationId, softwareId) {
    try {
      const result = await axios.get('http://20.2.90.36:3000/api/third-party/get-all-customers', {
        headers: { apiKey, organizationId, softwareId }
      });
  
      result.data.data.forEach(customer => {
        pushCustomerToTally(customer);
      });
  
      const win = BrowserWindow.getAllWindows()[0];
      win.webContents.send('synced-data', result.data.data);
    } catch (error) {
      console.error('Sync failed:', error.message);
    }
  }