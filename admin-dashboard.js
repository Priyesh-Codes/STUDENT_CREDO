document.addEventListener('DOMContentLoaded', function() {
    // Initialize mode toggle
    initializeModeToggle();
    
    // Initialize admin dashboard
    initializeAdminDashboard();
    
    // Initialize navigation
    initializeNavigation();
    
    // Setup quick actions
    setupQuickActions();
    
    // Load admin data
    loadAdminData();
    
    // Listen for new submissions
    window.addEventListener('approvalsUpdated', function(event) {
        updateAdminStats();
    });
});

function initializeModeToggle() {
    const studentMode = document.getElementById('studentMode');
    const adminMode = document.getElementById('adminMode');
    const logoTitle = document.querySelector('.logo-title');
    
    // Admin mode is checked by default
    adminMode.checked = true;
    localStorage.setItem('userMode', 'admin');
    
    // Add event listeners
    studentMode.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('userMode', 'student');
            // Redirect to student dashboard
            window.location.href = 'dashboard-new.html';
        }
    });
    
    adminMode.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('userMode', 'admin');
            logoTitle.textContent = 'ADMIN Credo';
        }
    });
}

function initializeAdminDashboard() {
    console.log('Admin Dashboard initialized');
    
    // Update admin stats
    updateAdminStats();
    
    // Start counter animations immediately while page is loading
    animateMetrics();
    
    // Load recent activity
    loadRecentActivity();
    
    // Update system metrics
    updateSystemMetrics();
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only prevent default for placeholder links (no notifications)
            const href = this.getAttribute('href');
            if (href === '#' || !href) {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
            }
            // For actual links (admin-dashboard.html, student-management.html, etc.), 
            // allow normal navigation without any interference
        });
    });
}

function setupQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            
            switch(actionText) {
                case 'Review Pending':
                    window.location.href = 'admin-approvals.html';
                    break;
                case 'Add Student':
                    showNotification('Add Student feature coming soon!', 'info');
                    break;
                case 'Export Data':
                    exportAdminData();
                    break;
                case 'View Reports':
                    showNotification('Reports feature coming soon!', 'info');
                    break;
                default:
                    showNotification(`${actionText} feature coming soon!`, 'info');
            }
        });
    });
    
    // View All button for recent activity
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showNotification('Full activity log coming soon!', 'info');
        });
    }
    
    // Notifications button
    const notificationsBtn = document.querySelector('.notifications-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showAdminNotifications();
        });
    }
    
    // Settings button
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showNotification('Settings panel coming soon!', 'info');
        });
    }
}

function updateAdminStats() {
    // Get approval statistics from shared data manager
    const approvalStats = window.studentCredoData.getApprovalStats();
    
    // Calculate admin-specific stats
    const stats = {
        pendingApprovals: approvalStats.pending,
        totalStudents: 156,
        totalAchievements: 4
    };
    
    // Update metric numbers only on admin dashboard page (not accreditation status)
    const metricNumbers = document.querySelectorAll('.metric-number');
    const isAdminDashboard = window.location.pathname.includes('admin-dashboard.html');
    
    if (metricNumbers.length >= 3 && isAdminDashboard) {
        metricNumbers[0].textContent = stats.pendingApprovals;
        metricNumbers[1].textContent = stats.totalStudents;
        metricNumbers[2].textContent = stats.totalAchievements.toLocaleString();
    }
    
    // Update nav badge
    const navBadge = document.getElementById('approvalsBadge');
    if (navBadge) {
        navBadge.textContent = stats.pendingApprovals;
        // Hide badge if count is 0
        navBadge.style.display = stats.pendingApprovals > 0 ? 'inline' : 'none';
    }
}

function loadRecentActivity() {
    // Activity data is already in HTML, but we can add real-time updates here
    console.log('Recent activity loaded');
    
    // Simulate real-time activity updates
    setTimeout(() => {
        addNewActivity({
            type: 'approved',
            title: 'Achievement Approved',
            description: 'Python Programming Certificate - John Doe',
            time: 'Just now'
        });
    }, 30000); // Add new activity after 30 seconds
}

function addNewActivity(activity) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';
    activityItem.style.transform = 'translateY(-10px)';
    
    activityItem.innerHTML = `
        <div class="activity-icon ${activity.type}">
            <i class="fas fa-${activity.type === 'approved' ? 'check' : activity.type === 'pending' ? 'clock' : 'times'}"></i>
        </div>
        <div class="activity-details">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
            <span class="activity-time">${activity.time}</span>
        </div>
    `;
    
    // Insert at the beginning
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Animate in
    setTimeout(() => {
        activityItem.style.transition = 'all 0.3s ease';
        activityItem.style.opacity = '1';
        activityItem.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove last item if more than 4 activities
    const activities = activityList.querySelectorAll('.activity-item');
    if (activities.length > 4) {
        activities[activities.length - 1].remove();
    }
    
    // Update pending count if it was an approval
    if (activity.type === 'approved') {
        const pendingStat = document.querySelector('.stat-card.orange .stat-number');
        if (pendingStat) {
            const currentCount = parseInt(pendingStat.textContent);
            pendingStat.textContent = Math.max(0, currentCount - 1);
        }
    }
}

function updateSystemMetrics() {
    // Simulate system health metrics
    const metrics = [
        { label: 'System Health', value: 'Excellent', percentage: 95, status: 'good' },
        { label: 'Database Status', value: 'Online', percentage: 100, status: 'good' },
        { label: 'Active Sessions', value: '23 Users', percentage: 60, status: 'normal' }
    ];
    
    const metricItems = document.querySelectorAll('.metric-item');
    metrics.forEach((metric, index) => {
        if (metricItems[index]) {
            const valueElement = metricItems[index].querySelector('.metric-value');
            const fillElement = metricItems[index].querySelector('.metric-fill');
            
            if (valueElement) {
                valueElement.textContent = metric.value;
                valueElement.className = `metric-value ${metric.status}`;
            }
            
            if (fillElement) {
                fillElement.style.width = `${metric.percentage}%`;
            }
        }
    });
}

function loadAdminData() {
    // Simulate loading admin-specific data
    console.log('Loading admin data...');
    
    // You can add real API calls here to fetch admin data
    // For now, we'll use simulated data
    
    setTimeout(() => {
        console.log('Admin data loaded successfully');
    }, 1000);
}

// Function to clear pending approvals (for testing/reset purposes)
function clearPendingApprovals() {
    if (confirm('Are you sure you want to clear all pending approvals? This action cannot be undone.')) {
        localStorage.removeItem('studentCredoPendingApprovals');
        updateAdminStats();
        showNotification('Pending approvals cleared successfully!', 'success');
    }
}

// Make function available globally for console access
window.clearPendingApprovals = clearPendingApprovals;

function exportAdminData() {
    // Simulate data export
    showNotification('Preparing data export...', 'info');
    
    setTimeout(() => {
        // Create a simple CSV export simulation
        const csvContent = "data:text/csv;charset=utf-8," + 
            "Student Name,Achievements,Status,Last Activity\n" +
            "Priyesh Kumar,5,Active,2024-01-15\n" +
            "Rahul Sharma,3,Active,2024-01-14\n" +
            "Ananya Singh,7,Active,2024-01-15\n";
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "admin_data_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Data exported successfully!', 'success');
    }, 2000);
}

function showAdminNotifications() {
    const notifications = [
        '5 achievements pending approval',
        '2 new student registrations',
        'System backup completed successfully'
    ];
    
    const message = notifications.join('\n• ');
    showNotification(`Admin Notifications:\n• ${message}`, 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
        white-space: pre-line;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Auto-refresh admin data every 30 seconds
setInterval(() => {
    updateAdminStats();
    updateSystemMetrics();
}, 30000);

// Animation functions (optimized for immediate loading)
function animateMetrics() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    
    metricNumbers.forEach((metric, index) => {
        const finalValue = metric.textContent;
        const numericValue = parseInt(finalValue.replace(/,/g, ''));
        
        if (!isNaN(numericValue)) {
            // Start immediately with minimal stagger for faster loading feel
            animateCounter(metric, 0, numericValue, 2000, index * 100);
        }
    });
}

function animateCounter(element, start, end, duration, delay) {
    setTimeout(() => {
        const startTime = performance.now();
        const isDecimal = element.textContent.includes('.');
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * easeOutQuart);
            
            if (isDecimal) {
                element.textContent = (current / 10).toFixed(1) + ' days';
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }, delay);
}
