document.addEventListener('DOMContentLoaded', function() {
    console.log('Digital Passport page loaded');
    
    // Get DOM elements
    const passportSearch = document.getElementById('passportSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const exportBtn = document.querySelector('.export-btn');
    const addAchievementBtn = document.querySelector('.add-achievement-btn');
    const emptyState = document.getElementById('emptyState');
    const passportGrid = document.getElementById('passportGrid');
    
    // Initialize page
    initializePage();
    
    // Listen for achievement updates from other pages
    window.addEventListener('statsUpdated', function(event) {
        initializePage(); // Refresh the passport data
    });
    
    // Add event listeners
    if (passportSearch) {
        passportSearch.addEventListener('input', window.utils.debounce(filterPassportItems, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterPassportItems);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPassportItems);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDigitalPassport);
    }
    
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', () => {
            window.location.href = 'achievements.html';
        });
    }
    
    // Settings button
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            notifications.show('Settings functionality coming soon!', 'info');
        });
    }
    
    function initializePage() {
        // Load digital passport data from shared data manager
        const passportData = getDigitalPassportData();
        
        // Display passport items or empty state
        displayPassportItems(passportData);
        
        // Update page title with count
        updatePageTitle(passportData.length);
        
        // Add smooth animations
        animateCards();
    }
    
    function getDigitalPassportData() {
        // Get approved achievements from shared data manager
        const achievements = window.studentCredoData.getAchievements();
        return achievements.filter(achievement => achievement.status === 'approved');
    }
    
    function displayPassportItems(items) {
        if (!items || items.length === 0) {
            showEmptyState();
            return;
        }
        
        showPassportGrid(items);
    }
    
    function showEmptyState() {
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        if (passportGrid) {
            passportGrid.style.display = 'none';
        }
    }
    
    function showPassportGrid(items) {
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        if (passportGrid) {
            passportGrid.style.display = 'grid';
            renderPassportItems(items);
        }
    }
    
    function renderPassportItems(items) {
        const passportHTML = items.map(item => createPassportItemHTML(item)).join('');
        passportGrid.innerHTML = passportHTML;
        
        // Add click event listeners to passport items
        const passportItems = passportGrid.querySelectorAll('.passport-item');
        passportItems.forEach(item => {
            item.addEventListener('click', () => {
                const itemId = item.dataset.id;
                viewPassportItem(itemId);
            });
        });
    }
    
    function createPassportItemHTML(item) {
        const statusClass = getStatusClass(item.status);
        const categoryIcon = window.utils.getCategoryIcon(item.category);
        const formattedDate = window.utils.formatDate(item.date || item.dateCreated);
        
        return `
            <div class="passport-item" data-id="${item.id}" data-category="${item.category}" data-status="${item.status}">
                <div class="passport-item-header">
                    <div class="passport-item-icon">
                        <i class="${categoryIcon}"></i>
                    </div>
                    <div class="passport-item-info">
                        <h4>${item.title}</h4>
                        <p>${item.category || 'General'}</p>
                    </div>
                </div>
                <div class="passport-item-description">
                    <p>${truncateText(item.description || '', 100)}</p>
                </div>
                <div class="passport-item-skills">
                    ${item.skills && item.skills.length > 0 ? 
                        `<div class="skills-preview">
                            ${item.skills.slice(0, 3).map(skill => 
                                `<span class="skill-tag">${skill}</span>`
                            ).join('')}
                            ${item.skills.length > 3 ? `<span class="more-skills">+${item.skills.length - 3} more</span>` : ''}
                        </div>` : ''
                    }
                </div>
                <div class="passport-item-meta">
                    <span class="passport-item-date">${formattedDate}</span>
                    <span class="passport-item-status ${statusClass}">
                        <i class="${window.utils.getStatusIcon(item.status)}"></i>
                        ${capitalizeFirst(item.status || 'draft')}
                    </span>
                </div>
                <div class="passport-item-actions">
                    <button class="action-btn view-btn" onclick="viewPassportItem('${item.id}')">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="action-btn share-btn" onclick="sharePassportItem('${item.id}')">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
        `;
    }
    
    function getStatusClass(status) {
        switch (status?.toLowerCase()) {
            case 'verified':
            case 'approved':
                return 'verified';
            case 'pending':
                return 'pending';
            default:
                return 'draft';
        }
    }
    
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function updatePageTitle(count) {
        const titleElement = document.querySelector('.card-header h3');
        if (titleElement) {
            titleElement.textContent = `Your Digital Passport (${count})`;
        }
    }
    
    function filterPassportItems() {
        const searchTerm = passportSearch?.value.toLowerCase() || '';
        const selectedCategory = categoryFilter?.value || '';
        const selectedStatus = statusFilter?.value || '';
        
        const passportItems = document.querySelectorAll('.passport-item');
        let visibleCount = 0;
        
        passportItems.forEach(item => {
            const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.passport-item-description p')?.textContent.toLowerCase() || '';
            const category = item.dataset.category?.toLowerCase() || '';
            const status = item.dataset.status?.toLowerCase() || '';
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = !selectedCategory || category === selectedCategory;
            const matchesStatus = !selectedStatus || status === selectedStatus;
            
            if (matchesSearch && matchesCategory && matchesStatus) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide empty state based on visible items
        if (visibleCount === 0 && passportItems.length > 0) {
            showFilterEmptyState();
        } else if (passportItems.length === 0) {
            showEmptyState();
        } else {
            if (passportGrid) {
                passportGrid.style.display = 'grid';
            }
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
    }
    
    function showFilterEmptyState() {
        if (passportGrid) {
            passportGrid.innerHTML = `
                <div class="filter-empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No matching items found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="clear-filters-btn" onclick="clearAllFilters()">
                        <i class="fas fa-times"></i>
                        Clear Filters
                    </button>
                </div>
            `;
            passportGrid.style.display = 'flex';
            passportGrid.style.justifyContent = 'center';
            passportGrid.style.alignItems = 'center';
        }
    }
    
    function viewPassportItem(itemId) {
        const passportData = getDigitalPassportData();
        const item = passportData.find(p => p.id === itemId);
        
        if (!item) {
            notifications.show('Passport item not found', 'error');
            return;
        }
        
        // Create detailed view modal
        showPassportItemModal(item);
    }
    
    function showPassportItemModal(item) {
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
        modal.className = 'passport-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 700px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        const skillsHtml = item.skills && item.skills.length > 0 
            ? `<div class="modal-skills">
                 <h4>Skills Demonstrated:</h4>
                 <div class="skills-tags">
                   ${item.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                 </div>
               </div>`
            : '';

        modal.innerHTML = `
            <div class="modal-header">
                <div class="modal-title-section">
                    <div class="modal-icon">
                        <i class="${window.utils.getCategoryIcon(item.category)}"></i>
                    </div>
                    <div>
                        <h2>${item.title}</h2>
                        <p class="modal-category">${item.category}</p>
                    </div>
                </div>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="modal-status-badge ${getStatusClass(item.status)}">
                    <i class="${window.utils.getStatusIcon(item.status)}"></i>
                    <span>Verified Achievement</span>
                </div>
                <div class="modal-description">
                    <h4>Description:</h4>
                    <p>${item.description || 'No description provided'}</p>
                </div>
                ${skillsHtml}
                <div class="modal-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Date:</strong> ${window.utils.formatDate(item.date || item.dateCreated)}
                        </div>
                        <div class="detail-item">
                            <strong>Issuer:</strong> ${item.issuer || 'Self-reported'}
                        </div>
                        <div class="detail-item">
                            <strong>Status:</strong> ${capitalizeFirst(item.status)}
                        </div>
                        <div class="detail-item">
                            <strong>Category:</strong> ${capitalizeFirst(item.category)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                <button class="btn btn-primary" onclick="sharePassportItem('${item.id}'); this.closest('.modal-overlay').remove();">Share Achievement</button>
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
    
    function sharePassportItem(itemId) {
        const passportData = getDigitalPassportData();
        const item = passportData.find(p => p.id === itemId);
        
        if (!item) {
            notifications.show('Item not found', 'error');
            return;
        }
        
        // Create shareable link or data
        const shareData = {
            title: `${item.title} - Digital Achievement`,
            text: `Check out my verified achievement: ${item.title}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).then(() => {
                notifications.show('Achievement shared successfully!', 'success');
            }).catch(() => {
                copyToClipboard(shareData.url);
            });
        } else {
            copyToClipboard(shareData.url);
        }
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            notifications.show('Link copied to clipboard!', 'success');
        }).catch(() => {
            notifications.show('Failed to copy link', 'error');
        });
    }
    
    // Make functions globally accessible
    window.viewPassportItem = viewPassportItem;
    window.sharePassportItem = sharePassportItem;
    
    function exportDigitalPassport() {
        const passportData = getDigitalPassportData();
        
        if (passportData.length === 0) {
            notifications.show('No passport data to export', 'warning');
            return;
        }
        
        // Show export options modal
        showExportOptionsModal(passportData);
    }
    
    function showExportOptionsModal(passportData) {
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
        modal.className = 'export-options-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        modal.innerHTML = `
            <div class="modal-header">
                <h2><i class="fas fa-download"></i> Export Portfolio</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="export-options">
                <p>Choose your preferred export format:</p>
                <div class="export-option-buttons">
                    <button class="export-option-btn" onclick="exportPortfolioHTML()">
                        <i class="fas fa-file-code"></i>
                        <div>
                            <h4>Professional Portfolio (HTML)</h4>
                            <p>Shareable web portfolio with professional formatting</p>
                        </div>
                    </button>
                    <button class="export-option-btn" onclick="exportPortfolioPDF()">
                        <i class="fas fa-file-pdf"></i>
                        <div>
                            <h4>PDF Resume</h4>
                            <p>Print-ready PDF document for applications</p>
                        </div>
                    </button>
                </div>
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
    
    function exportPortfolioHTML() {
        const passportData = getDigitalPassportData();
        const profile = window.studentCredoData.getUserProfile();
        
        // Show loading state
        const modal = document.querySelector('.export-options-modal');
        modal.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #3b82f6;"></i><p style="margin-top: 16px;">Generating your professional portfolio...</p></div>';
        
        setTimeout(() => {
            try {
                const portfolioHTML = generatePortfolioHTML(profile, passportData);
                
                // Create and download HTML file
                const dataBlob = new Blob([portfolioHTML], { type: 'text/html' });
                const url = URL.createObjectURL(dataBlob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `${profile.name.replace(/\s+/g, '_')}_Portfolio.html`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                notifications.show('Professional Portfolio exported successfully!', 'success');
                document.querySelector('.modal-overlay').remove();
            } catch (error) {
                console.error('Export error:', error);
                notifications.show('Failed to export portfolio', 'error');
                document.querySelector('.modal-overlay').remove();
            }
        }, 1500);
    }
    
    function exportPortfolioPDF() {
        const passportData = getDigitalPassportData();
        const profile = window.studentCredoData.getUserProfile();
        
        // Show loading state
        const modal = document.querySelector('.export-options-modal');
        modal.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #3b82f6;"></i><p style="margin-top: 16px;">Generating PDF resume...</p></div>';
        
        setTimeout(() => {
            try {
                const resumeHTML = generateResumeHTML(profile, passportData);
                
                // Create a new window for PDF generation
                const printWindow = window.open('', '_blank');
                printWindow.document.write(resumeHTML);
                printWindow.document.close();
                
                // Trigger print dialog
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 500);
                
                notifications.show('PDF resume ready for printing/saving!', 'success');
                document.querySelector('.modal-overlay').remove();
            } catch (error) {
                console.error('PDF export error:', error);
                notifications.show('Failed to generate PDF', 'error');
                document.querySelector('.modal-overlay').remove();
            }
        }, 1500);
    }
    
    
    // Helper functions for portfolio generation
    function generateProfileSummary(profile, achievements) {
        const categories = [...new Set(achievements.map(a => a.category))];
        const skills = extractUniqueSkills(achievements);
        
        let summary = `A motivated and results-oriented ${profile.department} student with a proven track record in `;
        
        if (categories.includes('competition')) {
            summary += 'competitive programming and ';
        }
        if (categories.includes('professional') || categories.includes('internship')) {
            summary += 'professional development and ';
        }
        if (categories.includes('project')) {
            summary += 'project development and ';
        }
        
        summary += 'academic excellence. Passionate about building innovative solutions and adept at leading projects from concept to completion. Seeking challenging opportunities to apply and expand technical skills.';
        
        return summary;
    }
    
    function extractUniqueSkills(achievements) {
        const allSkills = achievements.reduce((skills, achievement) => {
            if (achievement.skills && Array.isArray(achievement.skills)) {
                return [...skills, ...achievement.skills];
            }
            return skills;
        }, []);
        
        return [...new Set(allSkills)];
    }
    
    function categorizeAchievements(achievements) {
        const categories = {
            academic: [],
            professional: [],
            certifications: [],
            competitions: [],
            projects: [],
            others: []
        };
        
        achievements.forEach(achievement => {
            const category = achievement.category?.toLowerCase() || 'others';
            
            if (category.includes('academic') || category.includes('education')) {
                categories.academic.push(achievement);
            } else if (category.includes('professional') || category.includes('internship') || category.includes('job')) {
                categories.professional.push(achievement);
            } else if (category.includes('certification') || category.includes('certificate')) {
                categories.certifications.push(achievement);
            } else if (category.includes('competition') || category.includes('contest')) {
                categories.competitions.push(achievement);
            } else if (category.includes('project')) {
                categories.projects.push(achievement);
            } else {
                categories.others.push(achievement);
            }
        });
        
        return categories;
    }
    
    function generatePortfolioHTML(profile, achievements) {
        const summary = generateProfileSummary(profile, achievements);
        const skills = extractUniqueSkills(achievements);
        const categorizedAchievements = categorizeAchievements(achievements);
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name} - Professional Portfolio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 0;
            text-align: center;
            margin-bottom: 40px;
            border-radius: 12px;
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section {
            background: white;
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .section h2 {
            color: #2d3748;
            font-size: 1.8rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .achievement-item {
            margin-bottom: 25px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .achievement-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .achievement-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2d3748;
        }
        
        .achievement-date {
            color: #718096;
            font-size: 0.9rem;
        }
        
        .achievement-description {
            color: #4a5568;
            margin-bottom: 15px;
        }
        
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #e2e8f0;
            color: #2d3748;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .verification-badge {
            background: #48bb78;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .stat-label {
            color: #718096;
            font-size: 0.9rem;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: #718096;
            background: white;
            border-radius: 12px;
            margin-top: 40px;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 15px;
            }
            
            .achievement-header {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${profile.name}</h1>
            <p class="subtitle">${profile.department} Student | ${profile.rollNumber}</p>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>New Delhi, India</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>+91 98765 43210</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${profile.email || profile.name.toLowerCase().replace(/\s+/g, '.') + '@email.com'}</span>
                </div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${achievements.length}</div>
                <div class="stat-label">Total Achievements</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${achievements.filter(a => a.status === 'approved').length}</div>
                <div class="stat-label">Verified Achievements</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${skills.length}</div>
                <div class="stat-label">Skills Demonstrated</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${[...new Set(achievements.map(a => a.category))].length}</div>
                <div class="stat-label">Categories</div>
            </div>
        </div>
        
        <div class="section">
            <h2><i class="fas fa-user"></i> Summary</h2>
            <p>${summary}</p>
        </div>
        
        <div class="section">
            <h2><i class="fas fa-graduation-cap"></i> Education</h2>
            <div class="achievement-item">
                <div class="achievement-header">
                    <div class="achievement-title">Bachelor of Technology, ${profile.department}</div>
                    <div class="achievement-date">Expected Graduation: May 2026</div>
                </div>
                <div class="achievement-description">
                    Your University Name<br>
                    Current CGPA: 8.9/10.0
                </div>
            </div>
        </div>
        
        ${categorizedAchievements.competitions.length > 0 ? `
        <div class="section">
            <h2><i class="fas fa-trophy"></i> Competitions & Awards</h2>
            ${categorizedAchievements.competitions.map(achievement => `
                <div class="achievement-item">
                    <div class="achievement-header">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="achievement-description">${achievement.description || 'No description provided'}</div>
                    ${achievement.skills && achievement.skills.length > 0 ? `
                        <div class="skills-container">
                            ${achievement.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div style="margin-top: 10px;">
                        <span class="verification-badge">
                            <i class="fas fa-check-circle"></i>
                            Verified Achievement
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${categorizedAchievements.professional.length > 0 ? `
        <div class="section">
            <h2><i class="fas fa-briefcase"></i> Professional Experience</h2>
            ${categorizedAchievements.professional.map(achievement => `
                <div class="achievement-item">
                    <div class="achievement-header">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="achievement-description">${achievement.description || 'No description provided'}</div>
                    ${achievement.skills && achievement.skills.length > 0 ? `
                        <div class="skills-container">
                            ${achievement.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${categorizedAchievements.certifications.length > 0 ? `
        <div class="section">
            <h2><i class="fas fa-certificate"></i> Certifications</h2>
            ${categorizedAchievements.certifications.map(achievement => `
                <div class="achievement-item">
                    <div class="achievement-header">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="achievement-description">
                        ${achievement.description || 'No description provided'}<br>
                        <strong>Issuing Body:</strong> ${achievement.issuer || 'Self-reported'}
                    </div>
                    ${achievement.skills && achievement.skills.length > 0 ? `
                        <div class="skills-container">
                            ${achievement.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${categorizedAchievements.projects.length > 0 ? `
        <div class="section">
            <h2><i class="fas fa-project-diagram"></i> Projects</h2>
            ${categorizedAchievements.projects.map(achievement => `
                <div class="achievement-item">
                    <div class="achievement-header">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="achievement-description">${achievement.description || 'No description provided'}</div>
                    ${achievement.skills && achievement.skills.length > 0 ? `
                        <div class="skills-container">
                            ${achievement.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="section">
            <h2><i class="fas fa-cogs"></i> Technical Skills</h2>
            <div class="skills-container">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p><i class="fas fa-shield-alt"></i> This portfolio was generated from verified achievements on STUDENT Credo platform</p>
            <p>Generated on ${currentDate}</p>
        </div>
    </div>
</body>
</html>`;
    }
    
    function generateResumeHTML(profile, achievements) {
        const summary = generateProfileSummary(profile, achievements);
        const skills = extractUniqueSkills(achievements);
        const categorizedAchievements = categorizeAchievements(achievements);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            background: white;
            font-size: 12px;
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .contact-line {
            font-size: 11px;
            color: #666;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section h2 {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
        }
        
        .item {
            margin-bottom: 12px;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 12px;
        }
        
        .item-date {
            font-size: 10px;
            color: #666;
        }
        
        .item-subtitle {
            font-style: italic;
            font-size: 11px;
            color: #666;
            margin-bottom: 3px;
        }
        
        .item-description {
            font-size: 11px;
            text-align: justify;
        }
        
        .skills-list {
            font-size: 11px;
            line-height: 1.3;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
            
            .resume-container {
                box-shadow: none;
                margin: 0;
                padding: 0.5in;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <h1>${profile.name}</h1>
            <div class="contact-line">
                New Delhi, India | +91 98765 43210 | ${profile.email || profile.name.toLowerCase().replace(/\s+/g, '.') + '@email.com'}
            </div>
        </div>
        
        <div class="section">
            <h2>Summary</h2>
            <p class="item-description">${summary}</p>
        </div>
        
        <div class="section">
            <h2>Education</h2>
            <div class="item">
                <div class="item-header">
                    <div class="item-title">Bachelor of Technology, ${profile.department}</div>
                    <div class="item-date">Expected Graduation: May 2026</div>
                </div>
                <div class="item-subtitle">Your University Name</div>
                <div class="item-description">Current CGPA: 8.9/10.0</div>
            </div>
        </div>
        
        ${categorizedAchievements.competitions.length > 0 ? `
        <div class="section">
            <h2>Verified Achievements & Awards</h2>
            ${categorizedAchievements.competitions.slice(0, 3).map(achievement => `
                <div class="item">
                    <div class="item-header">
                        <div class="item-title">${achievement.title}</div>
                        <div class="item-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="item-description">${achievement.description || 'No description provided'}</div>
                    <div class="item-subtitle">Verification: [Blockchain ID: ${achievement.id.substring(0, 12)}...]</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${categorizedAchievements.professional.length > 0 ? `
        <div class="section">
            <h2>Professional Experience</h2>
            ${categorizedAchievements.professional.slice(0, 2).map(achievement => `
                <div class="item">
                    <div class="item-header">
                        <div class="item-title">${achievement.title}</div>
                        <div class="item-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="item-description">${achievement.description || 'No description provided'}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${categorizedAchievements.certifications.length > 0 ? `
        <div class="section">
            <h2>Certifications</h2>
            ${categorizedAchievements.certifications.slice(0, 3).map(achievement => `
                <div class="item">
                    <div class="item-header">
                        <div class="item-title">${achievement.title}</div>
                        <div class="item-date">${window.utils.formatDate(achievement.date || achievement.dateCreated)}</div>
                    </div>
                    <div class="item-subtitle">Issuing Body: ${achievement.issuer || 'Self-reported'}</div>
                    <div class="item-description">${achievement.description || 'No description provided'}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="section">
            <h2>Technical Skills</h2>
            <div class="skills-list">
                <strong>Languages:</strong> ${skills.filter(s => ['Python', 'Java', 'JavaScript', 'C++', 'SQL', 'HTML', 'CSS'].some(lang => s.toLowerCase().includes(lang.toLowerCase()))).join(', ') || 'Python, Java, JavaScript, C++, SQL'}<br>
                <strong>Technologies:</strong> ${skills.filter(s => ['React', 'Node', 'MongoDB', 'Git', 'Docker', 'API'].some(tech => s.toLowerCase().includes(tech.toLowerCase()))).join(', ') || 'React.js, Node.js, MongoDB, Git, Docker, REST APIs'}<br>
                <strong>Soft Skills:</strong> Project Management, Team Leadership, Problem-Solving, Communication
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>`;
    }
    
    // Make export functions globally accessible
    window.exportPortfolioHTML = exportPortfolioHTML;
    window.exportPortfolioPDF = exportPortfolioPDF;
    
    function animateCards() {
        const cards = document.querySelectorAll('.content-card, .passport-item');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Global function for clearing filters
    window.clearAllFilters = function() {
        if (passportSearch) passportSearch.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        
        // Re-render all items
        const passportData = getDigitalPassportData();
        displayPassportItems(passportData);
        
        notifications.show('Filters cleared', 'info');
    };
    
    // Add CSS for passport items and modal
    const style = document.createElement('style');
    style.textContent = `
        .passport-item {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid #e2e8f0;
        }
        
        .passport-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .passport-item-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .passport-item-icon {
            width: 40px;
            height: 40px;
            background: #f1f5f9;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #64748b;
        }
        
        .passport-item-info h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .passport-item-info p {
            margin: 4px 0 0 0;
            font-size: 14px;
            color: #64748b;
        }
        
        .passport-item-description {
            margin: 12px 0;
        }
        
        .passport-item-description p {
            font-size: 14px;
            color: #64748b;
            line-height: 1.5;
            margin: 0;
        }
        
        .passport-item-skills {
            margin: 12px 0;
        }
        
        .skills-preview {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .skill-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .more-skills {
            background: #f1f5f9;
            color: #64748b;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .passport-item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 16px 0 12px 0;
            padding-top: 12px;
            border-top: 1px solid #f1f5f9;
        }
        
        .passport-item-date {
            font-size: 12px;
            color: #64748b;
        }
        
        .passport-item-status {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 8px;
            border-radius: 12px;
        }
        
        .passport-item-status.verified {
            background: #dcfce7;
            color: #166534;
        }
        
        .passport-item-status.pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .passport-item-status.draft {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .passport-item-actions {
            display: flex;
            gap: 8px;
        }
        
        .action-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        
        .view-btn {
            background: #3b82f6;
            color: white;
        }
        
        .view-btn:hover {
            background: #2563eb;
        }
        
        .share-btn {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .share-btn:hover {
            background: #e2e8f0;
            color: #475569;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .modal-title-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .modal-icon {
            width: 48px;
            height: 48px;
            background: #f1f5f9;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #64748b;
        }
        
        .modal-title-section h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .modal-category {
            margin: 4px 0 0 0;
            font-size: 14px;
            color: #64748b;
        }
        
        .modal-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        
        .modal-status-badge.verified {
            background: #dcfce7;
            color: #166534;
        }
        
        .modal-description h4,
        .modal-skills h4 {
            margin: 0 0 10px 0;
            color: #334155;
            font-size: 16px;
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
        
        .modal-details {
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
        }
        
        .detail-item {
            color: #475569;
            font-size: 14px;
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
        
        .filter-empty-state {
            text-align: center;
            padding: 60px 40px;
            grid-column: 1 / -1;
        }
        
        .filter-empty-state .empty-icon {
            width: 80px;
            height: 80px;
            background: #f1f5f9;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 32px;
            color: #64748b;
        }
        
        .filter-empty-state h3 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .filter-empty-state p {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 24px;
        }
        
        .clear-filters-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        
        .clear-filters-btn:hover {
            background: #2980b9;
            transform: translateY(-1px);
        }
        
        /* Export Modal Styles */
        .export-options {
            padding: 20px 0;
        }
        
        .export-options p {
            margin-bottom: 20px;
            color: #64748b;
            font-size: 14px;
        }
        
        .export-option-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .export-option-btn {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
        }
        
        .export-option-btn:hover {
            background: #f1f5f9;
            border-color: #3b82f6;
            transform: translateY(-1px);
        }
        
        .export-option-btn i {
            font-size: 24px;
            color: #3b82f6;
            width: 32px;
            text-align: center;
        }
        
        .export-option-btn h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .export-option-btn p {
            margin: 0;
            font-size: 13px;
            color: #64748b;
            line-height: 1.4;
        }
    `;
    document.head.appendChild(style);
});

// Add sample data for demonstration
if (typeof window !== 'undefined' && window.studentCredoData) {
    // Check if we have sample data, if not add some for demonstration
    const existingAchievements = window.studentCredoData.getAchievements();
    if (existingAchievements.length === 0) {
        // Add sample achievements for portfolio demonstration
        const sampleAchievements = [
            {
                title: 'Winner - National CodeFest 2024',
                category: 'competition',
                description: 'Secured 1st place among 5,000+ national participants in a 24-hour hackathon. Developed a real-time data visualization tool using Python and React.',
                skills: ['Python', 'React', 'Data Visualization', 'Problem Solving'],
                date: '2024-11-15',
                issuer: 'National Programming Council',
                status: 'approved'
            },
            {
                title: 'Python for Data Science Certification',
                category: 'certification',
                description: 'Completed a 40-hour comprehensive course on data analysis, visualization, and machine learning libraries including Pandas, NumPy, and Scikit-learn.',
                skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Analysis'],
                date: '2024-06-20',
                issuer: 'Coursera (University-Approved)',
                status: 'approved'
            },
            {
                title: 'Software Development Intern',
                category: 'professional',
                description: 'Developed and tested new user-facing features for a client management portal using the MERN stack. Contributed to a 15% reduction in API response time by optimizing database queries.',
                skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'API Optimization'],
                date: '2024-08-30',
                issuer: 'Innovatech Solutions',
                status: 'approved'
            },
            {
                title: 'CampusConnect Mobile App - Project Lead',
                category: 'project',
                description: 'Led a team of 5 students to design, develop, and launch a mobile application for university events and notifications. Managed project timeline and presented to university administration.',
                skills: ['Project Management', 'Mobile Development', 'Team Leadership', 'React Native'],
                date: '2024-09-15',
                issuer: 'University Tech Club',
                status: 'approved'
            }
        ];
        
        sampleAchievements.forEach(achievement => {
            window.studentCredoData.addAchievement(achievement);
        });
    }
}
