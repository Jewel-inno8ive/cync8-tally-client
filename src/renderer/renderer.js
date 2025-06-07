let currentData = [];
let isConnected = false;

// DOM elements
const syncForm = document.getElementById('syncForm');
const syncButton = document.getElementById('syncButton');
const loadingSpinner = document.getElementById('loadingSpinner');
const syncButtonText = document.getElementById('syncButtonText');
const connectionStatus = document.getElementById('connectionStatus');
const statusMessage = document.getElementById('statusMessage');
const dataContainer = document.getElementById('dataContainer');
const tableContainer = document.getElementById('tableContainer');
const dataBody = document.getElementById('dataBody');
const refreshButton = document.getElementById('refreshData');

// Stats elements
const totalRecords = document.getElementById('totalRecords');
const syncedRecords = document.getElementById('syncedRecords');
const activeRecords = document.getElementById('activeRecords');
const lastSyncTime = document.getElementById('lastSyncTime');

// Form submission
syncForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const apiKey = document.getElementById('apiKey').value.trim();
    const organizationId = document.getElementById('organizationId').value.trim();
    const softwareId = document.getElementById('softwareId').value.trim();
    
    if (!apiKey || !organizationId || !softwareId) {
        showError('Please fill in all required fields');
        return;
    }
    
    startSync();
    
    window.electronAPI.sendCredentials({
        apiKey,
        organizationId,
        softwareId
    });
});

// Refresh data button
refreshButton.addEventListener('click', () => {
    if (isConnected) {
        const apiKey = document.getElementById('apiKey').value;
        const organizationId = document.getElementById('organizationId').value;
        const softwareId = document.getElementById('softwareId').value;
        
        if (apiKey && organizationId && softwareId) {
            startSync();
            window.electronAPI.sendCredentials({ apiKey, organizationId, softwareId });
        }
    }
});

// Start sync process
function startSync() {
    loadingSpinner.style.display = 'block';
    syncButtonText.textContent = 'Connecting...';
    syncButton.disabled = true;
    
    updateConnectionStatus('syncing', '🔄 Connecting and syncing data...');
}

// Handle successful sync
window.electronAPI.onSyncedData((customers) => {
    console.log('Received synced data:', customers);
    
    loadingSpinner.style.display = 'none';
    syncButtonText.textContent = 'Sync Complete';
    syncButton.disabled = false;
    isConnected = true;
    
    updateConnectionStatus('connected', '✅ Connected successfully - Data synced');
    
    currentData = customers || [];
    updateDataDisplay(currentData);
    updateStats(currentData);
    
    // Show refresh button
    refreshButton.style.display = 'inline-flex';
    
    // Update button text after successful sync
    setTimeout(() => {
        syncButtonText.textContent = 'Sync Again';
    }, 2000);
});

// Handle sync errors
window.electronAPI.onSyncError((error) => {
    console.error('Sync error:', error);
    
    loadingSpinner.style.display = 'none';
    syncButtonText.textContent = 'Retry Sync';
    syncButton.disabled = false;
    
    updateConnectionStatus('disconnected', '❌ Sync failed - Please check your credentials');
    showError('Sync failed: ' + (error.message || 'Unknown error'));
});

// Handle credentials saved
window.electronAPI.onCredentialsSaved(() => {
    console.log('Credentials saved successfully');
});

// Update connection status
function updateConnectionStatus(status, message) {
    const statusClasses = {
        'connected': 'connection-connected',
        'disconnected': 'connection-disconnected',
        'syncing': 'connection-syncing'
    };
    
    statusMessage.className = `connection-status ${statusClasses[status]}`;
    statusMessage.innerHTML = message;
    
    if (status === 'connected') {
        connectionStatus.classList.add('connected');
    } else {
        connectionStatus.classList.remove('connected');
    }
}

// Update data display
function updateDataDisplay(customers) {
    if (!customers || customers.length === 0) {
        dataContainer.style.display = 'block';
        tableContainer.style.display = 'none';
        return;
    }
    
    dataContainer.style.display = 'none';
    tableContainer.style.display = 'block';
    
    dataBody.innerHTML = '';
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        
        // Extract contact details safely
        const phone = customer.contactDetails && customer.contactDetails.length > 0 
            ? customer.contactDetails[0].phoneNumber || '' 
            : '';
        const email = customer.contactDetails && customer.contactDetails.length > 0 
            ? customer.contactDetails[0].email || '' 
            : '';
        
        // Determine status badge
        const status = customer.customerStatus || 'Unknown';
        const statusClass = getStatusClass(status);
        
        row.innerHTML = `
            <td><strong>${customer.customerName || 'N/A'}</strong></td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>${customer.state || customer.city || 'N/A'}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
        `;
        
        dataBody.appendChild(row);
    });
}

// Get status class for badge
function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('enabled')) {
        return 'status-active';
    } else if (statusLower.includes('inactive') || statusLower.includes('disabled')) {
        return 'status-inactive';
    } else {
        return 'status-pending';
    }
}

// Update statistics
function updateStats(customers) {
    const total = customers.length;
    const active = customers.filter(c => {
        const status = (c.customerStatus || '').toLowerCase();
        return status.includes('active') || status.includes('enabled');
    }).length;
    
    totalRecords.textContent = total;
    syncedRecords.textContent = total;
    activeRecords.textContent = active;
    lastSyncTime.textContent = new Date().toLocaleTimeString();
}

// Show error message
function showError(message) {
    // You can implement a toast notification or update the status message
    console.error(message);
    updateConnectionStatus('disconnected', '❌ ' + message);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cync8 Tally Sync app initialized');
});
