// Analytics Dashboard JavaScript

// Chart instances
let achievementTrendsChart;
let departmentChart;
let activityPointsChart;

// Sample analytics data
const analyticsData = {
    achievements: {
        monthly: [45, 52, 38, 67, 73, 89, 95, 78, 84, 92, 88, 96],
        weekly: [12, 18, 15, 22, 19, 25, 28]
    },
    departments: {
        labels: ['Computer Science', 'Electronics & Communication', 'Mechanical', 'Civil', 'Electrical'],
        data: [45, 25, 15, 10, 5],
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    },
    activityPoints: {
        labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        data: [1250, 3450, 8750, 15000]
    },
    metrics: {
        totalStudents: { current: 156, previous: 139, trend: 'up' },
        totalAchievements: { current: 1247, previous: 998, trend: 'up' },
        activityPoints: { current: 28450, previous: 24120, trend: 'up' }
    }
};

// Initialize analytics dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    setupEventListeners();
    updateMetrics();
});

function initializeAnalytics() {
    initializeCharts();
    animateMetrics();
}

function setupEventListeners() {
    // Date range selector
    const dateRange = document.getElementById('dateRange');
    dateRange.addEventListener('change', handleDateRangeChange);
    
    // Chart period buttons
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', handleChartPeriodChange);
    });
    
    // Export report button
    const exportBtn = document.querySelector('.export-report-btn');
    exportBtn.addEventListener('click', exportAnalyticsReport);
    
    // View all performers button
    const viewAllBtn = document.querySelector('.view-all-btn');
    viewAllBtn.addEventListener('click', () => {
        window.location.href = 'student-management.html?sort=points';
    });
}

function initializeCharts() {
    // Achievement Trends Chart
    const achievementCtx = document.getElementById('achievementTrendsChart').getContext('2d');
    achievementTrendsChart = new Chart(achievementCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Achievements',
                data: analyticsData.achievements.monthly,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            weight: '500'
                        }
                    }
                },
                y: {
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            weight: '500'
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#1d4ed8'
                }
            }
        }
    });

    // Department Distribution Chart
    const departmentCtx = document.getElementById('departmentChart').getContext('2d');
    departmentChart = new Chart(departmentCtx, {
        type: 'doughnut',
        data: {
            labels: analyticsData.departments.labels,
            datasets: [{
                data: analyticsData.departments.data,
                backgroundColor: analyticsData.departments.colors,
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#64748b'
                    }
                }
            }
        }
    });

    // Activity Points Chart
    const activityCtx = document.getElementById('activityPointsChart').getContext('2d');
    activityPointsChart = new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: analyticsData.activityPoints.labels,
            datasets: [{
                label: 'Activity Points',
                data: analyticsData.activityPoints.data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            weight: '500'
                        }
                    }
                },
                y: {
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            weight: '500'
                        },
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function handleDateRangeChange(e) {
    const days = parseInt(e.target.value);
    
    // Simulate data update based on date range
    updateChartsForDateRange(days);
    updateMetricsForDateRange(days);
    
    showNotification(`Analytics updated for last ${days} days`, 'info');
}

function handleChartPeriodChange(e) {
    const period = e.target.dataset.period;
    const buttons = document.querySelectorAll('.chart-btn');
    
    // Update button states
    buttons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update chart data
    if (period === 'weekly') {
        achievementTrendsChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        achievementTrendsChart.data.datasets[0].data = analyticsData.achievements.weekly;
    } else {
        achievementTrendsChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        achievementTrendsChart.data.datasets[0].data = analyticsData.achievements.monthly;
    }
    
    achievementTrendsChart.update('active');
}

function updateChartsForDateRange(days) {
    // Simulate different data based on date range
    const multiplier = days / 30; // Base on 30 days
    
    // Update achievement trends
    const newAchievementData = analyticsData.achievements.monthly.map(val => 
        Math.round(val * multiplier * (0.8 + Math.random() * 0.4))
    );
    achievementTrendsChart.data.datasets[0].data = newAchievementData;
    achievementTrendsChart.update('active');
    
    // Update activity points
    const newActivityData = analyticsData.activityPoints.data.map(val => 
        Math.round(val * multiplier * (0.9 + Math.random() * 0.2))
    );
    activityPointsChart.data.datasets[0].data = newActivityData;
    activityPointsChart.update('active');
}

function updateMetricsForDateRange(days) {
    const multiplier = days / 30;
    
    // Update metric cards with simulated data
    const metrics = document.querySelectorAll('.metric-value');
    if (metrics.length >= 3) {
        metrics[0].textContent = Math.round(156 * (0.8 + multiplier * 0.4));
        metrics[1].textContent = Math.round(1247 * multiplier * (0.7 + Math.random() * 0.6)).toLocaleString();
        metrics[2].textContent = Math.round(28450 * multiplier * (0.8 + Math.random() * 0.4)).toLocaleString();
    }
}

function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach((metric, index) => {
        const finalValue = metric.textContent;
        const numericValue = parseInt(finalValue.replace(/,/g, ''));
        
        if (!isNaN(numericValue)) {
            animateCounter(metric, 0, numericValue, 2000, index * 200);
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

function updateMetrics() {
    // Calculate and display trend percentages
    const trends = document.querySelectorAll('.metric-trend span');
    const data = analyticsData.metrics;
    
    // Calculate percentage changes
    const studentsTrend = ((data.totalStudents.current - data.totalStudents.previous) / data.totalStudents.previous * 100).toFixed(0);
    const achievementsTrend = ((data.totalAchievements.current - data.totalAchievements.previous) / data.totalAchievements.previous * 100).toFixed(0);
    const pointsTrend = ((data.activityPoints.current - data.activityPoints.previous) / data.activityPoints.previous * 100).toFixed(0);
    
    if (trends.length >= 3) {
        trends[0].textContent = `${studentsTrend}%`;
        trends[1].textContent = `${achievementsTrend}%`;
        trends[2].textContent = `${pointsTrend}%`;
    }
}

function exportAnalyticsReport() {
    const exportBtn = document.querySelector('.export-report-btn');
    const originalText = exportBtn.innerHTML;
    
    // Show loading state
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    exportBtn.disabled = true;
    
    // Simulate report generation
    setTimeout(() => {
        // Create report data
        const reportData = {
            generatedAt: new Date().toISOString(),
            dateRange: document.getElementById('dateRange').value + ' days',
            metrics: analyticsData.metrics,
            departments: analyticsData.departments,
            achievements: analyticsData.achievements.monthly,
            activityPoints: analyticsData.activityPoints
        };
        
        // Convert to JSON and download
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Reset button
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        
        showNotification('Analytics report exported successfully!', 'success');
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Real-time updates simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate new data coming in
        const randomIndex = Math.floor(Math.random() * analyticsData.achievements.monthly.length);
        analyticsData.achievements.monthly[randomIndex] += Math.floor(Math.random() * 3);
        
        // Update charts if they exist
        if (achievementTrendsChart) {
            achievementTrendsChart.data.datasets[0].data = analyticsData.achievements.monthly;
            achievementTrendsChart.update('none');
        }
    }, 30000); // Update every 30 seconds
}

// Start real-time updates
setTimeout(startRealTimeUpdates, 5000);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
    }
    
    .metric-card {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    .metric-card:nth-child(1) { animation-delay: 0.1s; }
    .metric-card:nth-child(2) { animation-delay: 0.2s; }
    .metric-card:nth-child(3) { animation-delay: 0.3s; }
    .metric-card:nth-child(4) { animation-delay: 0.4s; }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .chart-card {
        animation: fadeInScale 0.8s ease forwards;
        opacity: 0;
        transform: scale(0.95);
    }
    
    .chart-card:nth-child(1) { animation-delay: 0.2s; }
    .chart-card:nth-child(2) { animation-delay: 0.4s; }
    
    @keyframes fadeInScale {
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
