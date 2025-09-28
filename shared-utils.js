// STUDENT Credo - Shared Utilities
// Common functionality shared across all pages

// Global data management
class StudentCredoData {
    // Storage keys
    constructor() {
        this.storageKeys = {
            achievements: 'studentCredoAchievements',
            userProfile: 'studentCredoProfile',
            pendingApprovals: 'studentCredoPendingApprovals',
            blockchainCredentials: 'studentCredoBlockchainCredentials'
        };
        this.init();
    }

    init() {
        // Initialize default data structures if they don't exist
        if (!this.getAchievements() || this.getAchievements().length === 0) {
            // Initialize with 4 sample achievements for new users
            this.initializeSampleAchievements();
        }
        if (!this.getUserProfile()) {
            this.saveUserProfile(this.getDefaultProfile());
        }
        // Initialize empty pending approvals if they don't exist
        if (!this.getPendingApprovals()) {
            this.savePendingApprovals([]);
        }
    }

    // Initialize sample achievements for new users
    initializeSampleAchievements() {
        const sampleAchievements = [
            {
                id: 'sample_1',
                title: 'JavaScript Fundamentals Certificate',
                description: 'Completed comprehensive JavaScript programming course covering ES6+, DOM manipulation, and modern development practices.',
                category: 'certificate',
                status: 'approved',
                dateCreated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
                dateApproved: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
                issuer: 'Tech Academy',
                verificationUrl: 'https://techacademy.com/verify/js-cert-2024',
                skills: ['JavaScript', 'ES6+', 'DOM Manipulation', 'Async Programming'],
                activityPoints: 5
            },
            {
                id: 'sample_2',
                title: 'Hackathon Winner - Smart City Solutions',
                description: 'First place winner in the National Smart City Hackathon 2024. Developed an IoT-based traffic management system.',
                category: 'competition-win',
                status: 'approved',
                dateCreated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
                dateApproved: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
                issuer: 'National Innovation Council',
                prize: 'First Place - ₹50,000',
                teamSize: 4,
                skills: ['IoT', 'Python', 'Machine Learning', 'System Design'],
                activityPoints: 30
            },
            {
                id: 'sample_3',
                title: 'Software Development Internship',
                description: 'Completed 3-month internship at TechCorp as Full Stack Developer. Worked on React.js and Node.js projects.',
                category: 'internship',
                status: 'approved',
                dateCreated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
                dateApproved: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
                company: 'TechCorp Solutions',
                duration: '3 months',
                role: 'Full Stack Developer Intern',
                skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
                activityPoints: 30
            },
            {
                id: 'sample_4',
                title: 'AI/ML Workshop Participation',
                description: 'Attended intensive 2-day workshop on Artificial Intelligence and Machine Learning fundamentals with hands-on projects.',
                category: 'workshop',
                status: 'approved',
                dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
                dateApproved: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
                issuer: 'AI Research Institute',
                duration: '2 days',
                topics: ['Machine Learning Basics', 'Neural Networks', 'Python for AI', 'Data Preprocessing'],
                skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
                activityPoints: 5
            }
        ];

        // Save the sample achievements
        this.saveAchievements(sampleAchievements);
        
        // Also add them to blockchain automatically since they're approved
        sampleAchievements.forEach(achievement => {
            this.addToBlockchain(achievement, 'System Admin');
        });

        console.log('✅ Initialized 4 sample achievements for new user');
    }

    // Achievement data management
    getAchievements() {
        const data = localStorage.getItem(this.storageKeys.achievements);
        return data ? JSON.parse(data) : [];
    }

    saveAchievements(achievements) {
        localStorage.setItem(this.storageKeys.achievements, JSON.stringify(achievements));
        this.updateGlobalStats();
    }

    addAchievement(achievement) {
        const achievements = this.getAchievements();
        achievement.id = Date.now().toString();
        achievement.dateCreated = new Date().toISOString();
        achievements.push(achievement);
        this.saveAchievements(achievements);
        return achievement;
    }

    updateAchievement(id, updatedData) {
        const achievements = this.getAchievements();
        const index = achievements.findIndex(a => a.id === id);
        if (index !== -1) {
            achievements[index] = { ...achievements[index], ...updatedData };
            this.saveAchievements(achievements);
            return achievements[index];
        }
        return null;
    }

    deleteAchievement(id) {
        const achievements = this.getAchievements();
        const filtered = achievements.filter(a => a.id !== id);
        this.saveAchievements(filtered);
    }

    // User profile management
    getUserProfile() {
        const data = localStorage.getItem(this.storageKeys.userProfile);
        return data ? JSON.parse(data) : null;
    }

    saveUserProfile(profile) {
        localStorage.setItem(this.storageKeys.userProfile, JSON.stringify(profile));
    }

    getDefaultProfile() {
        return {
            name: 'Priyesh Kumar Kashyap',
            rollNumber: 'BT24CS063',
            year: '2nd year',
            section: 'CSE A2',
            email: '',
            department: 'Computer Science',
            profilePicture: 'profile-pic.jpg'
        };
    }

    // Skills data management
    getSkillsData() {
        const data = localStorage.getItem(this.storageKeys.skillsData);
        return data ? JSON.parse(data) : { skills: [], analysis: null };
    }

    saveSkillsData(skillsData) {
        localStorage.setItem(this.storageKeys.skillsData, JSON.stringify(skillsData));
    }

    // Calculate global statistics
    updateGlobalStats() {
        const achievements = this.getAchievements();
        const stats = {
            total: achievements.length,
            approved: achievements.filter(a => a.status === 'approved').length,
            pending: achievements.filter(a => a.status === 'pending').length,
            rejected: achievements.filter(a => a.status === 'rejected').length,
            lastUpdated: new Date().toISOString()
        };
        
        // Broadcast stats update event
        window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }));
        return stats;
    }

    getStats() {
        const achievements = this.getAchievements();
        const pendingApprovals = this.getPendingApprovals();
        
        // Count pending from both achievements and pending approvals
        const pendingFromAchievements = achievements.filter(a => a.status === 'pending').length;
        const pendingFromApprovals = pendingApprovals.filter(a => a.status === 'pending').length;
        
        return {
            total: achievements.length + pendingApprovals.length,
            approved: achievements.filter(a => a.status === 'approved').length,
            pending: pendingFromAchievements + pendingFromApprovals,
            rejected: achievements.filter(a => a.status === 'rejected').length,
            activityPoints: this.calculateActivityPoints()
        };
    }

    // Calculate activity points based on achievement types
    calculateActivityPoints() {
        const achievements = this.getAchievements().filter(a => a.status === 'approved');
        const pointsMap = {
            'certificate': 5,          // 5 AP for certificates
            'certification': 5,        // 5 AP for certifications
            'competition': 30,         // 30 AP for winning competitions
            'contest': 30,             // 30 AP for winning contests
            'workshop': 5,             // 5 AP for workshops
            'seminar': 5,              // 5 AP for seminars
            'internship': 30,          // 30 AP for internships
            'freelancing': 25,         // 25 AP for freelancing
            'freelance': 25,           // Alternative keyword for freelancing
            'participate': 1,          // 1 AP for participation
            'participation': 1,        // 1 AP for participation
            'participating': 1          // 1 AP for participating
        };

        let totalPoints = 0;
        
        achievements.forEach(achievement => {
            const category = (achievement.category || '').toLowerCase();
            const title = (achievement.title || '').toLowerCase();
            
            // Debug logging to help identify issues
            console.log(`Processing achievement: "${achievement.title}" | Category: "${achievement.category}"`);
            
            // Check for competition wins first (30 AP)
            // More comprehensive winning keywords detection
            if ((category.includes('competition') || category.includes('contest') || category.includes('hackathon') ||
                 title.includes('competition') || title.includes('contest') || title.includes('hackathon')) &&
                (title.includes('win') || title.includes('won') || title.includes('winner') || 
                 title.includes('1st') || title.includes('first') || title.includes('champion') ||
                 title.includes('gold') || title.includes('silver') || title.includes('bronze') ||
                 category.includes('win') || category.includes('winner') || category.includes('champion'))) {
                totalPoints += 30;
                console.log(`  → Competition WIN detected: +30 AP`);
            }
            // Check for internships (30 AP)
            else if (category.includes('internship') || title.includes('internship')) {
                totalPoints += 30;
                console.log(`  → Internship detected: +30 AP`);
            }
            // Check for freelancing (25 AP)
            else if (category.includes('freelanc') || title.includes('freelanc')) {
                totalPoints += 25;
                console.log(`  → Freelancing detected: +25 AP`);
            }
            // Check for certificates (5 AP)
            else if (category.includes('certificate') || category.includes('certification') ||
                     title.includes('certificate') || title.includes('certification')) {
                totalPoints += 5;
                console.log(`  → Certificate detected: +5 AP`);
            }
            // Check for workshops/seminars (5 AP)
            else if (category.includes('workshop') || category.includes('seminar') ||
                     title.includes('workshop') || title.includes('seminar')) {
                totalPoints += 5;
                console.log(`  → Workshop detected: +5 AP`);
            }
            // Check for competition participation (1 AP)
            else if (category.includes('competition') || category.includes('contest') || category.includes('hackathon') ||
                     title.includes('competition') || title.includes('contest') || title.includes('hackathon') ||
                     title.includes('participate') || title.includes('participating') ||
                     title.includes('participation')) {
                totalPoints += 1;
                console.log(`  → Competition participation detected: +1 AP`);
            }
            // Fallback: check category mapping
            else if (pointsMap[category]) {
                totalPoints += pointsMap[category];
                console.log(`  → Category mapping "${category}": +${pointsMap[category]} AP`);
            }
            else {
                console.log(`  → No matching category found, 0 AP awarded`);
            }
        });

        return totalPoints;
    }

    // Get detailed activity points breakdown
    getActivityPointsBreakdown() {
        const achievements = this.getAchievements().filter(a => a.status === 'approved');
        const pointsMap = {
            'certificate': 5,          // 5 AP for certificates
            'certification': 5,        // 5 AP for certifications
            'competition': 30,         // 30 AP for winning competitions
            'contest': 30,             // 30 AP for winning contests
            'workshop': 5,             // 5 AP for workshops
            'seminar': 5,              // 5 AP for seminars
            'internship': 30,          // 30 AP for internships
            'freelancing': 25,         // 25 AP for freelancing
            'freelance': 25,           // Alternative keyword for freelancing
            'participate': 1,          // 1 AP for participation
            'participation': 1,        // 1 AP for participation
            'participating': 1          // 1 AP for participating
        };

        const breakdown = {
            certificates: { count: 0, points: 0 },    // 5 AP each
            competitions: { count: 0, points: 0 },    // 30 AP for wins, 1 AP for participation
            workshops: { count: 0, points: 0 },       // 5 AP each
            internships: { count: 0, points: 0 },     // 30 AP each
            freelancing: { count: 0, points: 0 },     // 25 AP each
            participation: { count: 0, points: 0 },   // 1 AP each
            total: 0
        };

        achievements.forEach(achievement => {
            const category = (achievement.category || '').toLowerCase();
            const title = (achievement.title || '').toLowerCase();
            
            // Certificate/Certification (5 AP)
            if (category.includes('certificate') || category.includes('certification') || 
                title.includes('certificate') || title.includes('certification')) {
                breakdown.certificates.count++;
                breakdown.certificates.points += 5;
            }
            // Competition Win (30 AP)
            else if ((category.includes('competition') || category.includes('contest') || category.includes('hackathon') ||
                     title.includes('competition') || title.includes('contest') || title.includes('hackathon')) &&
                     (title.includes('win') || title.includes('won') || title.includes('winner') ||
                      title.includes('1st') || title.includes('first') || title.includes('champion') ||
                      title.includes('gold') || title.includes('silver') || title.includes('bronze') ||
                      category.includes('win') || category.includes('winner') || category.includes('champion'))) {
                breakdown.competitions.count++;
                breakdown.competitions.points += 30;
            }
            // Competition Participation (1 AP)
            else if (category.includes('competition') || category.includes('contest') || category.includes('hackathon') ||
                    title.includes('competition') || title.includes('contest') || title.includes('hackathon') ||
                    title.includes('participate') || title.includes('participating') || 
                    title.includes('participation')) {
                breakdown.participation.count++;
                breakdown.participation.points += 1;
            }
            // Workshop/Seminar (5 AP)
            else if (category.includes('workshop') || category.includes('seminar') || 
                    title.includes('workshop') || title.includes('seminar')) {
                breakdown.workshops.count++;
                breakdown.workshops.points += 5;
            }
            // Internship (30 AP)
            else if (category.includes('internship') || title.includes('internship')) {
                breakdown.internships.count++;
                breakdown.internships.points += 30;
            }
            // Freelancing (25 AP)
            else if (category.includes('freelanc') || title.includes('freelanc')) {
                breakdown.freelancing.count++;
                breakdown.freelancing.points += 25;
            }
        });

        breakdown.total = breakdown.certificates.points + breakdown.competitions.points + 
                         breakdown.workshops.points + breakdown.internships.points + 
                         breakdown.freelancing.points + breakdown.participation.points;

        return breakdown;
    }

    // Pending Approvals Management
    getPendingApprovals() {
        const data = localStorage.getItem(this.storageKeys.pendingApprovals);
        return data ? JSON.parse(data) : [];
    }

    savePendingApprovals(approvals) {
        localStorage.setItem(this.storageKeys.pendingApprovals, JSON.stringify(approvals));
        // Broadcast approval update event
        window.dispatchEvent(new CustomEvent('approvalsUpdated', { detail: approvals }));
    }

    addPendingApproval(achievementData) {
        const approvals = this.getPendingApprovals();
        const achievementId = Date.now().toString();
        const submittedDate = new Date().toISOString();
        
        const newApproval = {
            id: achievementId,
            achievementId: achievementId, // Link to achievement
            studentName: this.getUserProfile().name,
            studentId: this.getUserProfile().rollNumber,
            title: achievementData.title,
            description: achievementData.description,
            category: achievementData.category,
            skills: achievementData.skills || [],
            files: achievementData.files || [],
            submittedDate: submittedDate,
            status: 'pending',
            priority: this.calculatePriority(achievementData.category),
            blockchainVerification: achievementData.blockchain || false
        };
        
        approvals.push(newApproval);
        this.savePendingApprovals(approvals);
        
        // NOTE: Achievement will be created only when approved by admin
        // This prevents duplicate/auto-creation of achievements
        
        return newApproval;
    }

    updateApprovalStatus(approvalId, status, reason = '') {
        const approvals = this.getPendingApprovals();
        const approvalIndex = approvals.findIndex(a => a.id === approvalId);
        
        if (approvalIndex !== -1) {
            approvals[approvalIndex].status = status;
            approvals[approvalIndex].reviewDate = new Date().toISOString();
            if (reason) {
                approvals[approvalIndex].reason = reason;
            }
            
            this.savePendingApprovals(approvals);
            
            // Update corresponding achievement
            const achievements = this.getAchievements();
            const achievementIndex = achievements.findIndex(a => 
                a.title === approvals[approvalIndex].title && 
                a.submittedDate === approvals[approvalIndex].submittedDate
            );
            
            if (achievementIndex !== -1) {
                achievements[achievementIndex].status = status;
                if (reason) {
                    achievements[achievementIndex].reason = reason;
                }
                this.saveAchievements(achievements);
            }
            
            return approvals[approvalIndex];
        }
        return null;
    }

    calculatePriority(category) {
        const highPriorityCategories = ['competition-win', 'internship'];
        const mediumPriorityCategories = ['certificate', 'freelancing'];
        
        if (highPriorityCategories.includes(category)) {
            return 'high';
        } else if (mediumPriorityCategories.includes(category)) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    getApprovalStats() {
        const approvals = this.getPendingApprovals();
        return {
            pending: approvals.filter(a => a.status === 'pending').length,
            approved: approvals.filter(a => a.status === 'approved').length,
            rejected: approvals.filter(a => a.status === 'rejected').length,
            total: approvals.length
        };
    }

    // Blockchain Credentials Management
    getBlockchainCredentials() {
        const data = localStorage.getItem(this.storageKeys.blockchainCredentials);
        return data ? JSON.parse(data) : [];
    }

    saveBlockchainCredentials(credentials) {
        localStorage.setItem(this.storageKeys.blockchainCredentials, JSON.stringify(credentials));
        window.dispatchEvent(new CustomEvent('blockchainUpdated', { 
            detail: { credentials, count: credentials.length } 
        }));
    }

    addToBlockchain(achievement, verifiedBy = 'Admin') {
        if (achievement.status !== 'approved') {
            return null;
        }

        const blockchainCredentials = this.getBlockchainCredentials();
        const existingRecord = blockchainCredentials.find(record => 
            record.achievement.id === achievement.id
        );
        
        if (existingRecord) {
            return existingRecord;
        }

        const blockchainRecord = {
            id: `blockchain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            blockHash: this.generateBlockHash(achievement),
            achievement: { ...achievement },
            timestamp: new Date().toISOString(),
            verifiedBy: verifiedBy,
            immutable: true,
            blockNumber: blockchainCredentials.length + 1
        };

        blockchainCredentials.push(blockchainRecord);
        this.saveBlockchainCredentials(blockchainCredentials);
        return blockchainRecord;
    }

    generateBlockHash(achievement) {
        const data = JSON.stringify({
            id: achievement.id,
            title: achievement.title,
            category: achievement.category,
            timestamp: Date.now()
        });
        
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return Math.abs(hash).toString(16).padStart(16, '0') + Date.now().toString(16);
    }

    // Override updateApprovalStatus to auto-add to blockchain
    updateApprovalStatus(approvalId, status, reason = '') {
        const approvals = this.getPendingApprovals();
        const approvalIndex = approvals.findIndex(a => a.id === approvalId);
        
        if (approvalIndex !== -1) {
            approvals[approvalIndex].status = status;
            approvals[approvalIndex].reviewDate = new Date().toISOString();
            if (reason) {
                approvals[approvalIndex].reason = reason;
            }
            
            this.savePendingApprovals(approvals);
            
            // Create achievement only when approved (not auto-created anymore)
            const achievements = this.getAchievements();
            const achievementId = approvals[approvalIndex].achievementId || approvals[approvalIndex].id;
            let achievementIndex = achievements.findIndex(a => a.id === achievementId);
            
            if (status === 'approved') {
                if (achievementIndex === -1) {
                    // Create new achievement from approval data
                    const newAchievement = {
                        id: achievementId,
                        title: approvals[approvalIndex].title,
                        description: approvals[approvalIndex].description,
                        category: approvals[approvalIndex].category,
                        skills: approvals[approvalIndex].skills || [],
                        files: approvals[approvalIndex].files || [],
                        status: 'approved',
                        dateCreated: approvals[approvalIndex].submittedDate,
                        submittedDate: approvals[approvalIndex].submittedDate,
                        reviewDate: new Date().toISOString()
                    };
                    
                    if (reason) {
                        newAchievement.reason = reason;
                    }
                    
                    achievements.push(newAchievement);
                    this.saveAchievements(achievements);
                    
                    // Auto-add to blockchain
                    this.addToBlockchain(newAchievement, 'System Admin');
                    
                    console.log(`✅ Achievement created and approved: ${newAchievement.title}`);
                } else {
                    // Update existing achievement
                    achievements[achievementIndex].status = status;
                    achievements[achievementIndex].reviewDate = new Date().toISOString();
                    if (reason) {
                        achievements[achievementIndex].reason = reason;
                    }
                    this.saveAchievements(achievements);
                    
                    // Auto-add to blockchain
                    this.addToBlockchain(achievements[achievementIndex], 'System Admin');
                    
                    console.log(`✅ Achievement updated to approved: ${achievements[achievementIndex].title}`);
                }
            } else if (status === 'rejected') {
                // For rejected, just log - no achievement created
                console.log(`❌ Achievement rejected: ${approvals[approvalIndex].title}`);
            }
            
            // Broadcast achievement update event
            window.dispatchEvent(new CustomEvent('achievementStatusUpdated', { 
                detail: { approvalId, achievementId, status, reason } 
            }));
            
            return approvals[approvalIndex];
        }
        return null;
    }
}

// Global instance
window.studentCredoData = new StudentCredoData();

// Notification system
class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        notification.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            background: ${colors[type]};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
            pointer-events: auto;
            max-width: 400px;
            word-wrap: break-word;
        `;

        this.container.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

// Global notification instance
window.notifications = new NotificationManager();

// Navigation utilities
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.updateActiveNavigation();
        this.setupNavigationListeners();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '');
    }

    updateActiveNavigation() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current page nav item
        const currentNavItem = document.querySelector(`a[href="${this.currentPage}.html"]`);
        if (currentNavItem) {
            currentNavItem.classList.add('active');
        }
    }

    setupNavigationListeners() {
        // Add click handlers for navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                if (href && href !== '#') {
                    // Allow normal navigation
                    return;
                }
                e.preventDefault();
            });
        });
    }

    navigateTo(page) {
        window.location.href = `${page}.html`;
    }
}

// Global navigation instance
window.navigationManager = new NavigationManager();

// Utility functions
const utils = {
    // Format date helper
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    // Status and category helpers
    getStatusIcon(status) {
        const icons = {
            approved: 'fas fa-check-circle',
            pending: 'fas fa-clock',
            rejected: 'fas fa-times-circle',
            draft: 'fas fa-edit'
        };
        return icons[status] || 'fas fa-question-circle';
    },

    getCategoryIcon(category) {
        const icons = {
            academic: 'fas fa-graduation-cap',
            extracurricular: 'fas fa-users',
            professional: 'fas fa-briefcase',
            certificate: 'fas fa-certificate',
            'competition-win': 'fas fa-trophy',
            'competition-participate': 'fas fa-users',
            workshop: 'fas fa-chalkboard-teacher',
            project: 'fas fa-project-diagram',
            internship: 'fas fa-briefcase',
            freelancing: 'fas fa-laptop-code'
        };
        return icons[category] || 'fas fa-star';
    },

    getCategoryLabel(category) {
        const labels = {
            academic: 'Academic',
            extracurricular: 'Extracurricular',
            professional: 'Professional',
            certificate: 'Certificate',
            'competition-win': 'Competition Win',
            'competition-participate': 'Competition Participation',
            workshop: 'Workshop',
            project: 'Project',
            internship: 'Internship',
            freelancing: 'Freelancing Project'
        };
        return labels[category] || category;
    },

    // File size formatter
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Make utils globally available
window.utils = utils;

// CSS animations for notifications
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
        background: rgba(255,255,255,0.1);
    }
`;
document.head.appendChild(animationStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation for current page
    window.navigationManager.updateActiveNavigation();
    
    // Update stats display if elements exist
    const stats = window.studentCredoData.getStats();
    
    // Badge updates are handled by individual admin pages
    // to avoid conflicts with page-specific updateApprovalsBadge() functions
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StudentCredoData, NotificationManager, NavigationManager, utils };
}
