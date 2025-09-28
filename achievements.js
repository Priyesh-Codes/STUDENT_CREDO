// Achievement data structure
let achievements = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const statusSelect = document.getElementById('statusSelect');
const achievementsGrid = document.getElementById('achievementsGrid');
const emptyState = document.querySelector('.empty-state');
const achievementsTitle = document.querySelector('.achievements-title');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadAchievements();
    setupEventListeners();
    updateStats();
    renderAchievements();
    
    // Listen for stats updates from other pages
    window.addEventListener('statsUpdated', function(event) {
        updateStatsDisplay(event.detail);
    });
    
    // Listen for new pending approvals (when achievements are uploaded)
    window.addEventListener('approvalsUpdated', function(event) {
        console.log('New approval added:', event.detail);
        loadAchievements(); // Reload achievements including pending approvals
        renderAchievements(); // Re-render the display
        updateStats(); // Update statistics
    });
    
    // Listen for achievement status updates from admin
    window.addEventListener('achievementStatusUpdated', function(event) {
        console.log('Achievement status updated:', event.detail);
        loadAchievements(); // Reload achievements
        renderAchievements(); // Re-render the display
        updateStats(); // Update statistics
    });
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', utils.debounce(filterAchievements, 300));
    
    // Filter functionality
    categorySelect.addEventListener('change', filterAchievements);
    statusSelect.addEventListener('change', filterAchievements);
    
    // Button event listeners
    const addAchievementBtn = document.querySelector('.add-achievement-btn');
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', function() {
            window.location.href = 'upload-achievement.html';
        });
    }
    
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            window.location.href = 'upload-achievement.html';
        });
    }
    
    // Settings button
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            notifications.show('Settings functionality coming soon!', 'info');
        });
    }
}

// Load achievements using shared data manager
function loadAchievements() {
    const regularAchievements = studentCredoData.getAchievements();
    const pendingApprovals = studentCredoData.getPendingApprovals();
    
    // Convert pending approvals to achievement format for display
    const pendingAchievements = pendingApprovals.map(approval => ({
        id: approval.id,
        title: approval.title,
        description: approval.description,
        category: approval.category,
        skills: approval.skills,
        files: approval.files,
        status: approval.status,
        dateCreated: approval.submittedDate,
        issuer: 'Self-reported'
    }));
    
    // Combine both arrays
    achievements = [...regularAchievements, ...pendingAchievements];
}

// Save achievements using shared data manager
function saveAchievements() {
    studentCredoData.saveAchievements(achievements);
}

// Update statistics display
function updateStats() {
    const stats = studentCredoData.getStats();
    updateStatsDisplay(stats);
}

function updateStatsDisplay(stats) {
    // Update stat cards
    const statCards = {
        total: document.querySelector('.stat-card.blue .stat-number'),
        approved: document.querySelector('.stat-card.green .stat-number'),
        pending: document.querySelector('.stat-card.orange .stat-number'),
        rejected: document.querySelector('.stat-card.purple .stat-number')
    };
    
    if (statCards.total) statCards.total.textContent = stats.total;
    if (statCards.approved) statCards.approved.textContent = stats.approved;
    if (statCards.pending) statCards.pending.textContent = stats.pending;
    if (statCards.rejected) statCards.rejected.textContent = stats.rejected;
}

// Filter achievements based on search and filters
function filterAchievements() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const selectedStatus = statusSelect.value;
    
    const filtered = achievements.filter(achievement => {
        const matchesSearch = achievement.title.toLowerCase().includes(searchTerm) ||
                            achievement.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || achievement.category === selectedCategory;
        const matchesStatus = !selectedStatus || achievement.status === selectedStatus;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    renderAchievements(filtered);
}

// Render achievements
function renderAchievements(filteredAchievements = achievements) {
    const achievementsToShow = filteredAchievements || achievements;
    
    // Update title
    achievementsTitle.textContent = `Your Achievements (${achievementsToShow.length})`;
    
    if (achievementsToShow.length === 0) {
        // Show empty state
        emptyState.style.display = 'block';
        achievementsGrid.style.display = 'none';
    } else {
        // Show achievements grid
        emptyState.style.display = 'none';
        achievementsGrid.style.display = 'grid';
        
        achievementsGrid.innerHTML = achievementsToShow.map(achievement => 
            createAchievementCard(achievement)
        ).join('');
        
        // Add event listeners to achievement cards
        addAchievementCardListeners();
    }
}

// Create achievement card HTML
function createAchievementCard(achievement) {
    const statusClass = achievement.status;
    const statusIcon = utils.getStatusIcon(achievement.status);
    const categoryIcon = utils.getCategoryIcon(achievement.category);
    
    return `
        <div class="achievement-card" data-id="${achievement.id}">
            <div class="achievement-header">
                <div class="achievement-category">
                    <i class="${categoryIcon}"></i>
                    <span>${utils.getCategoryLabel(achievement.category)}</span>
                </div>
                <div class="achievement-status ${statusClass}">
                    <i class="${statusIcon}"></i>
                    <span>${achievement.status}</span>
                </div>
            </div>
            
            <div class="achievement-content">
                <h3 class="achievement-title">${achievement.title}</h3>
                <p class="achievement-description">${achievement.description}</p>
                
                <div class="achievement-meta">
                    <div class="achievement-date">
                        <i class="fas fa-calendar"></i>
                        <span>${utils.formatDate(achievement.date || achievement.dateCreated)}</span>
                    </div>
                    <div class="achievement-issuer">
                        <i class="fas fa-building"></i>
                        <span>${achievement.issuer || 'Self-reported'}</span>
                    </div>
                </div>
            </div>
            
            <div class="achievement-actions">
                <button class="action-btn view-btn" onclick="viewAchievement('${achievement.id}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Add event listeners to achievement cards
function addAchievementCardListeners() {
    const cards = document.querySelectorAll('.achievement-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.achievement-actions')) {
                const achievementId = card.dataset.id;
                viewAchievement(achievementId);
            }
        });
    });
}

// Achievement actions
function viewAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement) {
        showAchievementModal(achievement, 'view');
    }
}

// Edit and delete functions removed - achievements are now read-only for students
// Achievements can only be modified through the admin approval process

// Show achievement modal (create/edit/view)
function showAchievementModal(achievement, mode) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const modal = document.createElement('div');
    modal.className = 'achievement-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    const skillsHtml = achievement.skills && achievement.skills.length > 0 
        ? `<div class="modal-skills">
             <h4>Skills:</h4>
             <div class="skills-tags">
               ${achievement.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
             </div>
           </div>`
        : '';

    modal.innerHTML = `
        <div class="modal-header">
            <h2>${achievement.title}</h2>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-content">
            <div class="modal-meta">
                <div class="modal-category">
                    <i class="${utils.getCategoryIcon(achievement.category)}"></i>
                    <span>${utils.getCategoryLabel(achievement.category)}</span>
                </div>
                <div class="modal-status ${achievement.status}">
                    <i class="${utils.getStatusIcon(achievement.status)}"></i>
                    <span>${achievement.status}</span>
                </div>
            </div>
            <div class="modal-description">
                <h4>Description:</h4>
                <p>${achievement.description || 'No description provided'}</p>
            </div>
            ${skillsHtml}
            <div class="modal-details">
                <div class="detail-item">
                    <strong>Date:</strong> ${utils.formatDate(achievement.date || achievement.dateCreated)}
                </div>
                <div class="detail-item">
                    <strong>Issuer:</strong> ${achievement.issuer || 'Self-reported'}
                </div>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
        </div>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Close on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

// Add sample achievement (for testing)
function addSampleAchievement() {
    const sampleAchievement = {
        title: 'Dean\'s List Achievement',
        description: 'Achieved Dean\'s List recognition for academic excellence in Fall 2024 semester',
        category: 'academic',
        status: 'approved',
        date: '2024-12-15',
        issuer: 'University Academic Office',
        skills: ['Academic Excellence', 'Time Management', 'Study Skills'],
        files: []
    };
    
    studentCredoData.addAchievement(sampleAchievement);
    loadAchievements();
    updateStats();
    renderAchievements();
    notifications.show('Sample achievement added!', 'success');
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        animation: fadeIn 0.3s ease;
    }
    
    .achievement-modal {
        animation: slideInUp 0.3s ease;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        color: #64748b;
    }
    
    .modal-close:hover {
        background: #f1f5f9;
        color: #334155;
    }
    
    .modal-meta {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .modal-category, .modal-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
    }
    
    .modal-category {
        background: #f1f5f9;
        color: #475569;
    }
    
    .modal-status.approved {
        background: #dcfce7;
        color: #166534;
    }
    
    .modal-status.pending {
        background: #fef3c7;
        color: #92400e;
    }
    
    .modal-status.rejected {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .modal-description h4, .modal-skills h4 {
        margin: 0 0 10px 0;
        color: #334155;
    }
    
    .modal-description p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
    }
    
    .skills-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
    }
    
    .skill-tag {
        background: #e0e7ff;
        color: #3730a3;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .modal-details {
        margin: 20px 0;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .detail-item {
        margin-bottom: 8px;
        color: #475569;
    }
    
    .detail-item:last-child {
        margin-bottom: 0;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
    }
    
    .btn {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-secondary {
        background: #f1f5f9;
        color: #475569;
    }
    
    .btn-secondary:hover {
        background: #e2e8f0;
    }
    
    .btn-primary {
        background: #3b82f6;
        color: white;
    }
    
    .btn-primary:hover {
        background: #2563eb;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(modalStyles);
