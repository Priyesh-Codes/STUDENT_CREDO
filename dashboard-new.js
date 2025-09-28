document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard data
    initializeDashboard();
    
    // Initialize mode toggle
    initializeModeToggle();
    
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only prevent default for items with href="#" (placeholder links)
            const href = this.getAttribute('href');
            if (href === '#' || !href) {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
            }
            // For actual links (like achievements.html), allow normal navigation
        });
    });
    
    // Initialize mode toggle
    initializeModeToggle();
    
    // Initialize dashboard components
    initializeDashboard();
    updateUserProfile();
    setupQuickActions();
});

function initializeModeToggle() {
    const studentMode = document.getElementById('studentMode');
    const adminMode = document.getElementById('adminMode');
    const logoTitle = document.querySelector('.logo-title');
    
    // Check if mode is stored in localStorage
    const savedMode = localStorage.getItem('userMode') || 'student';
    
    if (savedMode === 'admin') {
        adminMode.checked = true;
        updateModeDisplay('admin');
    } else {
        studentMode.checked = true;
        updateModeDisplay('student');
    }
    
    // Add event listeners
    studentMode.addEventListener('change', function() {
        if (this.checked) {
            updateModeDisplay('student');
            localStorage.setItem('userMode', 'student');
        }
    });
    
    adminMode.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('userMode', 'admin');
            // Redirect to admin dashboard
            window.location.href = 'admin-dashboard.html';
        }
    });
    
    function updateModeDisplay(mode) {
        if (mode === 'admin') {
            logoTitle.textContent = 'ADMIN Credo';
            // You can add more admin-specific changes here
            console.log('Switched to Admin mode');
            // Optionally hide/show certain navigation items for admin
        } else {
            logoTitle.textContent = 'STUDENT Credo';
            console.log('Switched to Student mode');
        }
    }
}

function initializeDashboard() {
    // Update dashboard stats
    const stats = studentCredoData.getStats();
    updateDashboardStats(stats);
    
    // Update activity points based on approved achievements
    updateActivityPoints(stats.approved);
    
    // Log activity points breakdown for debugging
    console.log('Activity Points Breakdown:', studentCredoData.getActivityPointsBreakdown());
}

function updateDashboardStats(stats) {
    // Update profile stats - show only approved achievements
    const achievementsStat = document.querySelector('.profile-stats .stat-item:first-child .stat-number');
    if (achievementsStat) {
        achievementsStat.textContent = stats.approved;
    }
    
    // Update header stats (Activity Points)
    const headerStats = document.querySelector('.header-stats span');
    if (headerStats) {
        const activityPoints = stats.activityPoints || studentCredoData.calculateActivityPoints();
        headerStats.textContent = `${activityPoints} APs`;
    }
    
    // Update progress card
    const progressPoints = document.querySelector('.points-number');
    if (progressPoints) {
        const activityPoints = stats.activityPoints || studentCredoData.calculateActivityPoints();
        progressPoints.textContent = activityPoints;
    }
}

function updateActivityPoints(approvedCount) {
    const activityPoints = studentCredoData.calculateActivityPoints();
    
    // Update all activity point displays
    document.querySelectorAll('.points-number').forEach(element => {
        element.textContent = activityPoints;
    });
    
    // Update header stats
    const headerStats = document.querySelector('.header-stats span');
    if (headerStats) {
        headerStats.textContent = `${activityPoints} APs`;
    }
}

function updateUserProfile() {
    const profile = studentCredoData.getUserProfile();
    
    // Update profile information in sidebar and main content
    document.querySelectorAll('.user-info h4, .profile-info h3').forEach(element => {
        element.textContent = profile.name;
    });
    
    document.querySelectorAll('.user-info p, .profile-info p:first-of-type').forEach(element => {
        element.textContent = profile.rollNumber;
    });
    
    // Update profile details
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        profileDetails.textContent = `${profile.year} | Section ${profile.section}`;
    }
}

function setupQuickActions() {
    // Add achievement button functionality
    const addButtons = document.querySelectorAll('.add-achievement-btn, .upload-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'upload-achievement.html';
        });
    });
    
    // Skills analysis navigation
    const skillsBadges = document.querySelectorAll('.skill-badge');
    skillsBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            window.location.href = 'skills-analysis.html';
        });
    });
    
    // Achievements navigation
    const achievementsSection = document.querySelector('.profile-stats .stat-item:first-child');
    if (achievementsSection) {
        achievementsSection.style.cursor = 'pointer';
        achievementsSection.addEventListener('click', function() {
            window.location.href = 'achievements.html';
        });
    }
    
    // Digital passport navigation
    const digitalPassportBtn = document.createElement('button');
    digitalPassportBtn.className = 'quick-action-btn';
    digitalPassportBtn.innerHTML = '<i class="fas fa-passport"></i> View Digital Passport';
    digitalPassportBtn.onclick = () => window.location.href = 'digital-passport.html';
    
    // Add to progress card if it exists
    const progressCard = document.querySelector('.progress-card');
    if (progressCard) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'dashboard-actions';
        actionsContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;';
        
        const viewAchievementsBtn = document.createElement('button');
        viewAchievementsBtn.className = 'quick-action-btn';
        viewAchievementsBtn.innerHTML = '<i class="fas fa-trophy"></i> View Achievements';
        viewAchievementsBtn.onclick = () => window.location.href = 'achievements.html';
        
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'quick-action-btn';
        uploadBtn.innerHTML = '<i class="fas fa-plus"></i> Add Achievement';
        uploadBtn.onclick = () => window.location.href = 'upload-achievement.html';
        
        actionsContainer.appendChild(viewAchievementsBtn);
        actionsContainer.appendChild(uploadBtn);
        actionsContainer.appendChild(digitalPassportBtn);
        
        progressCard.appendChild(actionsContainer);
    }
    
    // Settings button
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            notifications.show('Settings functionality coming soon!', 'info');
        });
    }
    
    // Notifications button
    const notificationsBtn = document.querySelector('.notifications-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showNotificationsPanel();
        });
    }
}

function showNotificationsPanel() {
    const stats = studentCredoData.getStats();
    let notificationMessage = 'No new notifications';
    
    if (stats.pending > 0) {
        notificationMessage = `You have ${stats.pending} achievement${stats.pending > 1 ? 's' : ''} pending approval.`;
    }
    
    notifications.show(notificationMessage, stats.pending > 0 ? 'info' : 'success');
}

// Add quick action button styles
const quickActionStyles = document.createElement('style');
quickActionStyles.textContent = `
    .quick-action-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
    }
    
    .quick-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .quick-action-btn i {
        font-size: 16px;
    }
    
    .profile-stats .stat-item:first-child:hover {
        background: #f8fafc;
        border-radius: 8px;
        transform: scale(1.02);
        transition: all 0.2s ease;
    }
    
    .skill-badge {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .skill-badge:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(quickActionStyles);

// Listen for achievement status updates (outside DOMContentLoaded)
window.addEventListener('achievementStatusUpdated', function(event) {
    console.log('Dashboard: Achievement status updated:', event.detail);
    loadDashboardData(); // Reload dashboard data
    updateStats(); // Update statistics
});

// Load dashboard data function
function loadDashboardData() {
    initializeDashboard();
    updateUserProfile();
}

// Update stats function
function updateStats() {
    const stats = studentCredoData.getStats();
    updateDashboardStats(stats);
}
