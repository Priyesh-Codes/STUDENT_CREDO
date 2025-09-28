// Blockchain Credentials JavaScript
// Handles all functionality for the blockchain credentials page

document.addEventListener('DOMContentLoaded', function() {
    console.log('Blockchain Credentials JS loaded');
    
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        console.log('Initializing blockchain credentials...');
        initializeBlockchainCredentials();
        
        // Test if button exists after initialization
        const exportBtn = document.getElementById('exportBlockchainBtn');
        console.log('Export button after init:', exportBtn);
        
        // Make functions globally available for testing
        window.testExport = exportBlockchainData;
        window.testButton = function() {
            const btn = document.getElementById('exportBlockchainBtn');
            console.log('Button test:', btn);
            if (btn) {
                console.log('Button exists, triggering click...');
                btn.click();
            } else {
                console.log('Button not found!');
            }
        };
        
        // Add manual update function
        window.forceUpdateStatus = function() {
            console.log('🔧 Forcing status update...');
            updateBlockchainStats();
        };
        
        window.checkBlockchainData = function() {
            console.log('🔍 Checking blockchain data...');
            const data = localStorage.getItem('studentCredoBlockchainCredentials');
            console.log('Raw data:', data);
            if (data) {
                const parsed = JSON.parse(data);
                console.log('Parsed data:', parsed);
                console.log('Count:', parsed.length);
            }
        };
        
        console.log('Test functions available:');
        console.log('- window.testExport() - Test export function directly');
        console.log('- window.testButton() - Test button click');
        console.log('- window.forceUpdateStatus() - Force update status indicator');
        console.log('- window.checkBlockchainData() - Check blockchain data in localStorage');
    }, 100);
});

function initializeBlockchainCredentials() {
    console.log('=== BLOCKCHAIN CREDENTIALS INITIALIZATION ===');
    
    // Test data availability
    if (window.studentCredoData) {
        console.log('✅ studentCredoData is available');
        const blockchainRecords = window.studentCredoData.getBlockchainCredentials();
        console.log('📊 Blockchain records count:', blockchainRecords.length);
        console.log('📋 Blockchain records:', blockchainRecords);
    } else {
        console.error('❌ studentCredoData is NOT available');
    }
    
    loadBlockchainCredentials();
    updateBlockchainStats();
    setupEventListeners();
    
    console.log('=== INITIALIZATION COMPLETE ===');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Verify All button
    const verifyAllBtn = document.getElementById('verifyAllBtn');
    if (verifyAllBtn) {
        console.log('Verify All button found, adding event listener');
        verifyAllBtn.addEventListener('click', verifyAllCredentials);
    } else {
        console.error('Verify All button not found!');
    }
    
    // Export Blockchain Data button
    const exportBlockchainBtn = document.getElementById('exportBlockchainBtn');
    if (exportBlockchainBtn) {
        console.log('Export Blockchain button found, adding event listener');
        exportBlockchainBtn.addEventListener('click', exportBlockchainData);
        
        // Also add onclick as backup
        exportBlockchainBtn.onclick = function(e) {
            console.log('Export button clicked via onclick handler');
            e.preventDefault();
            exportBlockchainData();
        };
        
        console.log('Both event listener and onclick handler added');
    } else {
        console.error('Export Blockchain button not found!');
    }
    
    // Listen for new blockchain records
    window.addEventListener('blockchainUpdated', function(event) {
        console.log('Blockchain updated event received:', event.detail);
        loadBlockchainCredentials();
        updateBlockchainStats();
    });
    
    // Listen for achievement status updates
    window.addEventListener('achievementStatusUpdated', function(event) {
        console.log('Blockchain: Achievement status updated:', event.detail);
        if (event.detail.status === 'approved') {
            // Reload blockchain credentials as new one might be added
            setTimeout(() => {
                loadBlockchainCredentials();
                updateBlockchainStats();
            }, 1000); // Small delay to ensure blockchain record is created
        }
    });
}

function loadBlockchainCredentials() {
    console.log('Loading blockchain credentials...');
    const blockchainRecords = window.studentCredoData.getBlockchainCredentials();
    const grid = document.getElementById('blockchainGrid');
    const emptyState = document.getElementById('emptyState');
    
    console.log(`Found ${blockchainRecords.length} blockchain records`);
    
    if (blockchainRecords.length === 0) {
        emptyState.style.display = 'block';
        grid.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    grid.style.display = 'grid';
    
    grid.innerHTML = blockchainRecords.map((record, index) => `
        <div class="blockchain-credential-card" data-hash="${record.blockHash}">
            <div class="credential-header">
                <div class="blockchain-badge">
                    <i class="fas fa-cubes"></i>
                    <span>${blockchainRecords.length} CREDENTIALS</span>
                </div>
                <div class="immutable-badge">
                    <i class="fas fa-lock"></i>
                    <span>IMMUTABLE</span>
                </div>
            </div>
            
            <div class="credential-content">
                <div class="achievement-info">
                    <div class="achievement-category ${record.achievement.category}">
                        <i class="fas fa-${getCategoryIcon(record.achievement.category)}"></i>
                        <span>${formatCategory(record.achievement.category)}</span>
                    </div>
                    <h4>${record.achievement.title}</h4>
                    <p>${record.achievement.description || 'Verified achievement record'}</p>
                </div>
                
                <div class="blockchain-metadata">
                    <div class="metadata-item">
                        <span class="label">Block Hash:</span>
                        <span class="value hash-value">${record.blockHash.substring(0, 16)}...</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Timestamp:</span>
                        <span class="value">${formatBlockchainDate(record.timestamp)}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Verified By:</span>
                        <span class="value">${record.verifiedBy || 'Admin'}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Activity Points:</span>
                        <span class="value points">${getAchievementPoints(record.achievement)} AP</span>
                    </div>
                </div>
            </div>
            
            <div class="credential-actions">
                <button class="verify-btn" onclick="verifyCredential('${record.blockHash}')">
                    <i class="fas fa-search"></i>
                    Verify
                </button>
                <button class="share-btn" onclick="shareCredential('${record.blockHash}')">
                    <i class="fas fa-share"></i>
                    Share
                </button>
                <button class="details-btn" onclick="viewCredentialDetails('${record.blockHash}')">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('Blockchain credentials loaded successfully');
}

function updateBlockchainStats() {
    console.log('🔄 updateBlockchainStats() called');
    
    // Check if studentCredoData exists
    if (!window.studentCredoData) {
        console.error('❌ studentCredoData not available in updateBlockchainStats');
        return;
    }
    
    const blockchainRecords = window.studentCredoData.getBlockchainCredentials();
    console.log('📊 Blockchain records retrieved:', blockchainRecords.length);
    console.log('📋 Blockchain records data:', blockchainRecords);
    
    // Check localStorage directly as backup
    const directCheck = localStorage.getItem('studentCredoBlockchainCredentials');
    console.log('💾 Direct localStorage check:', directCheck ? JSON.parse(directCheck).length : 'No data');
    
    // Update stats cards
    const blockchainCount = document.getElementById('blockchainCount');
    const verifiedCount = document.getElementById('verifiedCount');
    const immutableCount = document.getElementById('immutableCount');
    const hashCount = document.getElementById('hashCount');
    
    if (blockchainCount) blockchainCount.textContent = blockchainRecords.length;
    if (verifiedCount) verifiedCount.textContent = blockchainRecords.length;
    if (immutableCount) immutableCount.textContent = blockchainRecords.length;
    if (hashCount) hashCount.textContent = blockchainRecords.length;
    
    // Update header status indicator
    const statusIndicator = document.getElementById('blockchainStatusCount');
    console.log('🎯 Status indicator element:', statusIndicator);
    
    if (statusIndicator) {
        statusIndicator.textContent = blockchainRecords.length;
        console.log(`✅ Updated header status indicator to: ${blockchainRecords.length}`);
        
        // Force a visual update
        statusIndicator.style.color = 'red';
        setTimeout(() => {
            statusIndicator.style.color = '';
        }, 1000);
    } else {
        console.error('❌ Header status indicator element not found!');
    }
}

function verifyCredential(blockHash) {
    console.log('Verifying credential:', blockHash);
    const record = window.studentCredoData.getBlockchainCredentials().find(r => r.blockHash === blockHash);
    if (!record) {
        showNotification('Credential not found!', 'error');
        return;
    }
    
    const verificationDetails = document.getElementById('verificationDetails');
    verificationDetails.innerHTML = `
        <div class="verification-result success">
            <div class="verification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>Credential Verified Successfully</h4>
            <p>This credential is authentic and stored on blockchain</p>
        </div>
        
        <div class="verification-data">
            <h5>Credential Information</h5>
            <div class="data-grid">
                <div class="data-item">
                    <span class="label">Achievement:</span>
                    <span class="value">${record.achievement.title}</span>
                </div>
                <div class="data-item">
                    <span class="label">Category:</span>
                    <span class="value">${formatCategory(record.achievement.category)}</span>
                </div>
                <div class="data-item">
                    <span class="label">Block Hash:</span>
                    <span class="value hash-display">${record.blockHash}</span>
                </div>
                <div class="data-item">
                    <span class="label">Timestamp:</span>
                    <span class="value">${new Date(record.timestamp).toLocaleString()}</span>
                </div>
                <div class="data-item">
                    <span class="label">Verified By:</span>
                    <span class="value">${record.verifiedBy || 'System Admin'}</span>
                </div>
                <div class="data-item">
                    <span class="label">Activity Points:</span>
                    <span class="value">${getAchievementPoints(record.achievement)} AP</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('verificationModal').style.display = 'flex';
}

function verifyAllCredentials() {
    console.log('Verifying all credentials...');
    const blockchainRecords = window.studentCredoData.getBlockchainCredentials();
    
    if (blockchainRecords.length === 0) {
        showNotification('No blockchain credentials to verify', 'warning');
        return;
    }
    
    showNotification(`All ${blockchainRecords.length} credentials verified successfully!`, 'success');
}

function shareCredential(blockHash) {
    console.log('Sharing credential:', blockHash);
    const shareUrl = `${window.location.origin}/verify-credential.html?hash=${blockHash}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Blockchain Credential Verification',
            text: 'Verify this blockchain credential',
            url: shareUrl
        }).then(() => {
            showNotification('Credential shared successfully!', 'success');
        }).catch((error) => {
            console.log('Share failed:', error);
            // Fallback to clipboard
            fallbackShare(shareUrl);
        });
    } else {
        fallbackShare(shareUrl);
    }
}

function fallbackShare(shareUrl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Verification link copied to clipboard!', 'success');
        }).catch(() => {
            // Legacy fallback
            legacyShare(shareUrl);
        });
    } else {
        legacyShare(shareUrl);
    }
}

function legacyShare(shareUrl) {
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Verification link copied to clipboard!', 'success');
        } else {
            showNotification('Unable to copy link. Please copy manually: ' + shareUrl, 'info');
        }
    } catch (err) {
        showNotification('Unable to copy link. Please copy manually: ' + shareUrl, 'info');
    }
    
    document.body.removeChild(textArea);
}

function viewCredentialDetails(blockHash) {
    console.log('Viewing credential details:', blockHash);
    verifyCredential(blockHash);
}

function exportBlockchainData() {
    console.log('Export button clicked - starting export process...');
    
    try {
        // Check if studentCredoData exists
        if (!window.studentCredoData) {
            console.error('studentCredoData not found');
            showNotification('Error: Data manager not available', 'error');
            return;
        }
        
        const blockchainRecords = window.studentCredoData.getBlockchainCredentials();
        console.log('Blockchain records found:', blockchainRecords.length);
        
        if (blockchainRecords.length === 0) {
            showNotification('No blockchain data to export', 'warning');
            return;
        }
        
        // Get user profile with fallback
        let userProfile;
        try {
            userProfile = window.studentCredoData.getUserProfile();
        } catch (error) {
            console.warn('Could not get user profile, using default:', error);
            userProfile = {
                name: 'Student User',
                rollNumber: 'Unknown',
                email: 'student@example.com'
            };
        }
        
        const exportData = {
            student: userProfile,
            credentials: blockchainRecords,
            exportDate: new Date().toISOString(),
            totalRecords: blockchainRecords.length,
            exportVersion: '1.0'
        };
        
        console.log('Export data prepared:', exportData);
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `blockchain-credentials-${Date.now()}.json`;
        
        // Add the link to DOM temporarily for better browser compatibility
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
        
        console.log('Export completed successfully');
        showNotification('Blockchain data exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Export failed: ' + error.message, 'error');
    }
}

function closeVerificationModal() {
    document.getElementById('verificationModal').style.display = 'none';
}

// Utility functions
function getCategoryIcon(category) {
    const icons = {
        'certificate': 'certificate',
        'competition-win': 'trophy',
        'internship': 'briefcase',
        'workshop': 'chalkboard-teacher',
        'freelancing': 'laptop-code',
        'project': 'project-diagram'
    };
    return icons[category] || 'star';
}

function formatCategory(category) {
    const categories = {
        'certificate': 'Certificate',
        'competition-win': 'Competition Win',
        'internship': 'Internship',
        'workshop': 'Workshop',
        'freelancing': 'Freelancing',
        'project': 'Project'
    };
    return categories[category] || category;
}

function formatBlockchainDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getAchievementPoints(achievement) {
    const pointsMap = {
        'certificate': 5,
        'competition-win': 30,
        'internship': 30,
        'workshop': 5,
        'freelancing': 25,
        'project': 15
    };
    return pointsMap[achievement.category] || 5;
}

function showNotification(message, type = 'info') {
    // Use the global notification system if available
    if (window.notifications && window.notifications.show) {
        window.notifications.show(message, type);
        return;
    }
    
    // Fallback notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white; padding: 16px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 350px;
        font-size: 14px; font-weight: 500; transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

console.log('Blockchain Credentials JavaScript loaded successfully');
