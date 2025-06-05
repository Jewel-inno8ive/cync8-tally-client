const { ipcRenderer } = require('electron');

document.getElementById('syncForm').addEventListener('submit', e => {
  e.preventDefault();
  ipcRenderer.send('save-credentials', {
    apiKey: document.getElementById('apiKey').value,
    organizationId: document.getElementById('organizationId').value,
    softwareId: document.getElementById('softwareId').value
  });
});

ipcRenderer.on('synced-data', (event, customers) => {
  const tbody = document.getElementById('dataBody');
  tbody.innerHTML = ''; // Clear previous data

  customers.forEach(customer => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.customerName}</td>
      <td>${(customer.contactDetails?.[0]?.phoneNumber || '')}</td>
      <td>${(customer.contactDetails?.[0]?.email || '')}</td>
      <td>${customer.state || ''}</td>
      <td>${customer.customerStatus || ''}</td>
    `;
    tbody.appendChild(row);
  });
});
