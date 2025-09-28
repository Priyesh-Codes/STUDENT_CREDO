document.addEventListener('DOMContentLoaded', function() {
    console.log('Skills Analysis page loaded');
    
    // Get DOM elements
    const refreshBtn = document.getElementById('refreshBtn');
    const statValues = document.querySelectorAll('.stat-value');
    
    // Initialize page
    initializePage();
    
    // Listen for achievement updates from other pages
    window.addEventListener('statsUpdated', function(event) {
        initializePage(); // Refresh the skills analysis
    });
    
    // Add event listeners
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefreshAnalysis);
    }
    
    
    // Settings button
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            notifications.show('Settings functionality coming soon!', 'info');
        });
    }
    
    function initializePage() {
        console.log('=== INITIALIZING SKILLS ANALYSIS PAGE ===');
        
        // Clear any existing data for fresh start (for debugging)
        // Uncomment the next line to clear all achievements and start fresh
        // clearAllAchievements();
        
        // Check if we have any achievements, if not, create some test data
        const existingAchievements = studentCredoData.getAchievements();
        console.log(`Found ${existingAchievements.length} existing achievements`);
        
        // Only create test data if no achievements exist
        if (existingAchievements.length === 0) {
            console.log('No achievements found - user needs to upload achievements manually');
            // Removed auto-creation of test achievements to prevent unwanted data
        } else {
            console.log('Using existing achievements data');
        }
        
        // Load skills data from achievements
        const skillsData = extractSkillsFromAchievements();
        console.log('=== SKILLS DATA EXTRACTED ===');
        console.log('Skills data:', skillsData);
        console.log('Number of skills found:', skillsData.skills ? skillsData.skills.length : 0);
        
        // Update stats with actual data
        updateStats(skillsData);
        
        // Load skills analysis sections
        loadSkillsAnalysis(skillsData);
        
        // Add smooth animations to cards
        animateCards();
    }
    
    function createTestAchievements() {
        // Create some test achievements to demonstrate the system
        const testAchievements = [
            {
                id: 'test-1',
                title: 'C++ Programming Certificate',
                category: 'certificate',
                type: 'certificate',
                skills: ['C++', 'Programming', 'Object-Oriented Programming'],
                status: 'approved',
                dateCreated: new Date().toISOString()
            },
            {
                id: 'test-2',
                title: 'Smart India Hackathon 2024 - 1st Place',
                category: 'competition-win',
                type: 'competition',
                skills: ['C++', 'Problem Solving', 'Algorithms'],
                status: 'approved',
                dateCreated: new Date().toISOString()
            },
            {
                id: 'test-3',
                title: 'Web Development Internship at TCS',
                category: 'internship',
                type: 'internship',
                skills: ['JavaScript', 'React', 'Node.js'],
                status: 'approved',
                dateCreated: new Date().toISOString()
            },
            {
                id: 'test-4',
                title: 'Python Data Science Project',
                category: 'project',
                type: 'project',
                skills: ['Python', 'Data Science', 'Machine Learning'],
                status: 'approved',
                dateCreated: new Date().toISOString()
            }
        ];
        
        // Add test achievements to storage
        testAchievements.forEach(achievement => {
            studentCredoData.addAchievement(achievement);
        });
        
        console.log('Test achievements created successfully!');
    }
    
    function clearAllAchievements() {
        // Clear all achievements from localStorage
        localStorage.removeItem('studentAchievements');
        console.log('All achievements cleared from storage');
        
        // Show notification
        if (window.notifications) {
            notifications.show('All achievements cleared!', 'info');
        }
    }
    
    
    function isValidSkill(skill) {
        // Filter out common non-skill items
        const invalidSkills = [
            // Company names
            'IBM', 'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Facebook',
            'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify', 'Adobe', 'Oracle',
            'Salesforce', 'Intel', 'NVIDIA', 'Samsung', 'Sony', 'HP', 'Dell',
            
            // Common non-skill terms
            'Internship', 'Job', 'Work', 'Experience', 'Training', 'Course',
            'Program', 'Workshop', 'Seminar', 'Conference', 'Event', 'Project',
            'Competition', 'Contest', 'Hackathon', 'Bootcamp', 'Certification',
            
            // Combined terms that are not skills
            'IBM Internship', 'Google Internship', 'Microsoft Internship',
            'Summer Internship', 'Winter Internship', 'Full Time', 'Part Time'
        ];
        
        // Convert to lowercase for comparison
        const skillLower = skill.toLowerCase().trim();
        
        // Check if it's in the invalid list
        const isInvalid = invalidSkills.some(invalid => 
            skillLower === invalid.toLowerCase() || 
            skillLower.includes(invalid.toLowerCase())
        );
        
        // Also filter out very short skills (likely abbreviations or codes)
        const isTooShort = skill.trim().length < 2;
        
        // Filter out skills that are mostly numbers
        const isMostlyNumbers = /^\d+$/.test(skill.trim());
        
        return !isInvalid && !isTooShort && !isMostlyNumbers;
    }
    
    function extractSkillsFromAchievements() {
        const achievements = studentCredoData.getAchievements();
        const skillsMap = new Map();
        
        // Extract skills only from approved achievements
        const approvedAchievements = achievements.filter(achievement => achievement.status === 'approved');
        
        approvedAchievements.forEach(achievement => {
            if (achievement.skills && Array.isArray(achievement.skills)) {
                achievement.skills.forEach(skill => {
                    // Filter out non-skill items (company names, achievement titles, etc.)
                    if (isValidSkill(skill)) {
                        if (skillsMap.has(skill)) {
                            // Add achievement to existing skill
                            const existing = skillsMap.get(skill);
                            existing.count += 1;
                            existing.categories.add(achievement.category || 'General');
                            existing.achievements.push({
                                title: achievement.title,
                                type: achievement.type || 'general',
                                category: achievement.category || 'General'
                            });
                        } else {
                            // Add new skill
                            skillsMap.set(skill, {
                                name: skill,
                                count: 1,
                                categories: new Set([achievement.category || 'General']),
                                achievements: [{
                                    title: achievement.title,
                                    type: achievement.type || 'general',
                                    category: achievement.category || 'General'
                                }],
                                verified: true // Mark as verified since it's from approved achievement
                            });
                        }
                    }
                });
            }
        });
        
        // Calculate proficiency for each skill based on achievement types
        const skills = Array.from(skillsMap.values()).map(skill => {
            console.log(`\n=== CALCULATING PROFICIENCY FOR SKILL: ${skill.name} ===`);
            console.log(`Skill achievements:`, skill.achievements);
            const proficiency = calculateSkillProficiency(skill.achievements);
            console.log(`Final proficiency for ${skill.name}: ${proficiency}%`);
            return {
                ...skill,
                proficiency: proficiency,
                level: proficiency,
                categories: Array.from(skill.categories),
                category: Array.from(skill.categories)[0] // Primary category
            };
        });
        
        return {
            skills,
            totalAchievements: achievements.length,
            approvedAchievements: approvedAchievements.length,
            verifiedSkills: skills.length // Only verified skills count
        };
    }
    
    function updateStats(skillsData) {
        const stats = calculateStats(skillsData);
        
        // Animate stat values
        animateStatValues(stats);
    }
    
    function calculateStats(skillsData) {
        const skills = skillsData.skills || [];
        
        // Calculate total skills - equal to approved achievements count
        const totalSkills = skillsData.approvedAchievements || 0;
        
        // Calculate average proficiency
        const avgProficiency = skills.length > 0 
            ? Math.round(skills.reduce((sum, skill) => sum + (skill.proficiency || 0), 0) / skills.length)
            : 0;
        
        // Calculate expert level skills (proficiency > 80)
        const expertLevel = skills.filter(skill => (skill.proficiency || 0) > 80).length;
        
        // Calculate areas to improve (proficiency < 50)
        const areasToImprove = skills.filter(skill => (skill.proficiency || 0) < 50).length;
        
        return {
            totalSkills,
            avgProficiency: avgProficiency + '%',
            expertLevel,
            areasToImprove
        };
    }
    
    function animateStatValues(stats) {
        const statCards = document.querySelectorAll('.stat-card');
        const values = [stats.totalSkills, stats.avgProficiency, stats.expertLevel, stats.areasToImprove];
        
        statCards.forEach((card, index) => {
            const valueElement = card.querySelector('.stat-value');
            if (valueElement && values[index] !== undefined) {
                animateNumber(valueElement, values[index]);
            }
        });
    }
    
    function animateNumber(element, finalValue) {
        const isPercentage = typeof finalValue === 'string' && finalValue.includes('%');
        const numericValue = isPercentage ? parseInt(finalValue) : finalValue;
        const duration = 1000;
        const steps = 30;
        const stepValue = numericValue / steps;
        let currentValue = 0;
        
        const timer = setInterval(() => {
            currentValue += stepValue;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            element.textContent = isPercentage 
                ? Math.round(currentValue) + '%'
                : Math.round(currentValue);
        }, duration / steps);
    }
    
    function loadSkillsAnalysis(skillsData) {
        console.log('=== LOADING SKILLS ANALYSIS ===');
        console.log('Skills data received:', skillsData);
        
        if (skillsData.skills && skillsData.skills.length > 0) {
            console.log(`Found ${skillsData.skills.length} skills to display`);
            skillsData.skills.forEach((skill, index) => {
                console.log(`Skill ${index + 1}: ${skill.name} - ${skill.proficiency}%`);
            });
            
            // If we have skills data, populate the skills sections
            console.log('Populating top skills...');
            populateTopSkills(skillsData.skills);
            
            console.log('Populating skills categories...');
            populateSkillsCategories(skillsData.skills);
            
            console.log('Populating recommendations...');
            populateRecommendations(skillsData.skills);
            
            console.log('Hiding empty states...');
            hideEmptyStates();
        } else {
            console.log('No skills found, showing empty states');
            // Show empty states with helpful actions
            showEmptyStatesWithActions();
        }
    }
    
    function hideEmptyStates() {
        const emptyStates = document.querySelectorAll('.empty-state');
        emptyStates.forEach(state => {
            state.style.display = 'none';
        });
    }
    
    function showEmptyStatesWithActions() {
        const emptyStates = document.querySelectorAll('.empty-state');
        emptyStates.forEach(state => {
            state.style.display = 'block';
            
            // Add action button if not already present
            if (!state.querySelector('.action-btn')) {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'action-btn';
                actionBtn.innerHTML = '<i class="fas fa-plus"></i> Add Achievement';
                actionBtn.onclick = () => window.location.href = 'upload-achievement.html';
                state.appendChild(actionBtn);
            }
        });
    }
    
    function populateTopSkills(skills) {
        console.log('=== POPULATING TOP SKILLS ===');
        const skillsList = document.getElementById('skillsList');
        console.log('Skills list element:', skillsList);
        
        if (!skills || skills.length === 0) {
            console.log('No skills provided, showing empty state');
            skillsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h4>No skills detected yet.</h4>
                    <p>Upload achievements to see your skill analysis!</p>
                </div>
            `;
            return;
        }
        
        console.log(`Received ${skills.length} skills to display:`, skills);
        
        // Sort skills by proficiency and show all skills
        const sortedSkills = skills
            .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0));
        
        // Generate HTML for all skills
        const skillsHTML = sortedSkills.map((skill, index) => {
            const proficiency = skill.proficiency || 0;
            const isTopSkill = index === 0;
            
            return `
                <div class="skill-item ${isTopSkill ? 'top-skill' : ''}">
                    <div class="skill-info">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-percentage">${proficiency}%</span>
                    </div>
                    <div class="skill-progress-bar">
                        <div class="skill-progress" style="width: ${proficiency}%"></div>
                    </div>
                    <div class="skill-details">
                        <span class="skill-achievements">${skill.count} achievement${skill.count > 1 ? 's' : ''}</span>
                        <span class="skill-category">${skill.category}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('Generated skills HTML:', skillsHTML);
        console.log('Setting innerHTML of skillsList...');
        skillsList.innerHTML = skillsHTML;
        console.log('Skills HTML has been set. Current innerHTML:', skillsList.innerHTML);
    }
    
    function populateSkillsCategories(skills) {
        const categoriesCard = document.querySelector('.skills-category-card .card-content');
        if (!skills || skills.length === 0) return;
        
        // Group skills by category
        const categories = {};
        skills.forEach(skill => {
            const category = skill.category || 'General';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(skill);
        });
        
        const categoriesHTML = Object.entries(categories).map(([category, categorySkills]) => {
            const avgProficiency = Math.round(
                categorySkills.reduce((sum, skill) => sum + (skill.proficiency || 0), 0) / categorySkills.length
            );
            
            return `
                <div class="category-item">
                    <div class="category-header">
                        <h4>${category}</h4>
                        <span class="category-avg">${avgProficiency}% avg</span>
                    </div>
                    <div class="category-skills">
                        ${categorySkills.map(skill => `
                            <span class="skill-tag" title="${skill.achievements.join(', ')}">${skill.name}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        categoriesCard.innerHTML = `
            <div class="categories-list">
                ${categoriesHTML}
            </div>
        `;
    }
    
    function populateRecommendations(skills) {
        const recommendationsCard = document.querySelector('.recommendations-card .card-content');
        if (!skills || skills.length === 0) return;
        
        // Generate AI-like recommendations based on skills
        const recommendations = generateRecommendations(skills);
        
        const recommendationsHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="rec-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    ${rec.action ? `<button class="rec-action-btn" onclick="${rec.action}">${rec.actionText}</button>` : ''}
                </div>
            </div>
        `).join('');
        
        recommendationsCard.innerHTML = `
            <div class="recommendations-list">
                ${recommendationsHTML}
            </div>
        `;
    }
    
    function generateRecommendations(skills) {
        const recommendations = [];
        
        // Find skills that need improvement
        const weakSkills = skills.filter(skill => (skill.proficiency || 0) < 50);
        const strongSkills = skills.filter(skill => (skill.proficiency || 0) > 70);
        
        if (weakSkills.length > 0) {
            recommendations.push({
                icon: 'fas fa-arrow-up',
                title: 'Improve Core Skills',
                description: `Focus on strengthening ${weakSkills[0].name} through more achievements in this area.`,
                action: 'window.location.href="upload-achievement.html"',
                actionText: 'Add Achievement'
            });
        }
        
        if (strongSkills.length > 0) {
            recommendations.push({
                icon: 'fas fa-star',
                title: 'Leverage Your Strengths',
                description: `Your ${strongSkills[0].name} skills are excellent. Consider showcasing them in your digital passport.`,
                action: 'window.location.href="digital-passport.html"',
                actionText: 'View Passport'
            });
        }
        
        if (skills.length < 5) {
            recommendations.push({
                icon: 'fas fa-plus',
                title: 'Diversify Your Skills',
                description: 'Add more achievements to build a comprehensive skill profile.',
                action: 'window.location.href="achievements.html"',
                actionText: 'View Achievements'
            });
        }
        
        recommendations.push({
            icon: 'fas fa-graduation-cap',
            title: 'Continuous Learning',
            description: 'Explore new technologies and methodologies in your field to stay competitive.',
            action: 'window.location.href="upload-achievement.html"',
            actionText: 'Add Learning'
        });
        
        return recommendations.slice(0, 3); // Limit to 3 recommendations
    }
    
    function animateCards() {
        const cards = document.querySelectorAll('.analysis-card, .stat-card');
        
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
    
    function handleRefreshAnalysis() {
        console.log('Refreshing analysis...');
        
        // Add loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        refreshBtn.disabled = true;
        
        // Simulate analysis refresh
        setTimeout(() => {
            // Reload skills data
            initializePage();
            
            // Remove loading state
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Analysis';
            refreshBtn.disabled = false;
            
            // Show success message
            notifications.show('Skills analysis refreshed successfully!', 'success');
        }, 2000);
    }
    
    // Skill proficiency calculation based on achievement types
    function calculateSkillProficiency(achievements) {
        console.log(`  → Calculating proficiency for ${achievements.length} achievements`);
        let totalScore = 0;
        const achievementCounts = {
            certificate: 0,
            'competition-win': 0,
            workshop: 0,
            internship: 0,
            freelance: 0,
            'competition-participate': 0
        };
        
        // Count achievements by type
        achievements.forEach((achievement, index) => {
            console.log(`  → Processing achievement ${index + 1}: "${achievement.title}"`);
            const type = mapAchievementType(achievement.type, achievement.title, achievement.category);
            console.log(`  → Mapped to type: ${type}`);
            if (achievementCounts.hasOwnProperty(type)) {
                achievementCounts[type]++;
                console.log(`  → ${type} count is now: ${achievementCounts[type]}`);
            }
        });
        
        console.log(`  → Final achievement counts:`, achievementCounts);
        
        // Calculate score based on rules:
        // Professional certificate: +5% (up to 2)
        const certScore = Math.min(achievementCounts.certificate, 2) * 5;
        totalScore += certScore;
        console.log(`  → Certificate score: ${certScore}% (${achievementCounts.certificate} certificates)`);
        
        // Competition win: +30% (only 1 counts)
        const winScore = Math.min(achievementCounts['competition-win'], 1) * 30;
        totalScore += winScore;
        console.log(`  → Competition win score: ${winScore}% (${achievementCounts['competition-win']} wins)`);
        
        // Workshop: +5% (only 1 counts)
        const workshopScore = Math.min(achievementCounts.workshop, 1) * 5;
        totalScore += workshopScore;
        console.log(`  → Workshop score: ${workshopScore}% (${achievementCounts.workshop} workshops)`);
        
        // Internship: +30% (up to 2)
        const internScore = Math.min(achievementCounts.internship, 2) * 30;
        totalScore += internScore;
        console.log(`  → Internship score: ${internScore}% (${achievementCounts.internship} internships)`);
        
        // Freelance project: +25% (only 1 counts)
        const freelanceScore = Math.min(achievementCounts.freelance, 1) * 25;
        totalScore += freelanceScore;
        console.log(`  → Freelance score: ${freelanceScore}% (${achievementCounts.freelance} projects)`);
        
        // Competition participation: +1% (up to 5 times)
        const participateScore = Math.min(achievementCounts['competition-participate'], 5) * 1;
        totalScore += participateScore;
        console.log(`  → Participation score: ${participateScore}% (${achievementCounts['competition-participate']} participations)`);
        
        console.log(`  → Total raw score: ${totalScore}%`);
        const finalScore = Math.min(totalScore, 135);
        console.log(`  → Final capped score: ${finalScore}%`);
        return finalScore;
    }
    
    // Map achievement types to scoring categories
    function mapAchievementType(type, title, category) {
        const titleLower = (title || '').toLowerCase();
        const categoryLower = (category || '').toLowerCase();
        const typeLower = (type || '').toLowerCase();
        
        // Debug logging
        console.log(`Mapping achievement type: "${title}" | Category: "${category}" | Type: "${type}"`);
        
        // Check for competition wins FIRST (highest priority - 30% points)
        if ((titleLower.includes('1st') || titleLower.includes('first') || titleLower.includes('winner') || 
             titleLower.includes('won') || titleLower.includes('champion') || titleLower.includes('gold') ||
             titleLower.includes('silver') || titleLower.includes('bronze') || titleLower.includes('win')) && 
            (titleLower.includes('competition') || titleLower.includes('contest') || titleLower.includes('hackathon') ||
             categoryLower.includes('competition-win') || categoryLower.includes('competition'))) {
            console.log(`  → Mapped to: competition-win`);
            return 'competition-win';
        }
        
        // Check for internships (high value - 30% points)
        if (titleLower.includes('internship') || titleLower.includes('intern') || 
            categoryLower.includes('internship') || typeLower.includes('internship')) {
            console.log(`  → Mapped to: internship`);
            return 'internship';
        }
        
        // Check for freelance projects (25% points)
        if (titleLower.includes('freelance') || categoryLower.includes('freelance') || 
            typeLower.includes('freelance')) {
            console.log(`  → Mapped to: freelance`);
            return 'freelance';
        }
        
        // Check for certificates (5% points)
        if (titleLower.includes('certificate') || titleLower.includes('certification') || 
            categoryLower.includes('certificate') || typeLower.includes('certificate')) {
            console.log(`  → Mapped to: certificate`);
            return 'certificate';
        }
        
        // Check for workshops/seminars
        if (titleLower.includes('workshop') || titleLower.includes('seminar') ||
            categoryLower.includes('workshop') || categoryLower.includes('seminar') ||
            typeLower.includes('workshop') || typeLower.includes('seminar')) {
            console.log(`  → Mapped to: workshop`);
            return 'workshop';
        }
        
        // Check for projects (should be treated as freelance/portfolio work)
        if (titleLower.includes('project') || categoryLower.includes('project') || 
            typeLower.includes('project')) {
            console.log(`  → Mapped to: freelance (project)`);
            return 'freelance';
        }
        
        // Check for competition participation (only if it mentions competition)
        if (titleLower.includes('competition') || titleLower.includes('contest') || 
            titleLower.includes('hackathon') || categoryLower.includes('competition') ||
            titleLower.includes('participate') || titleLower.includes('participating')) {
            console.log(`  → Mapped to: competition-participate`);
            return 'competition-participate';
        }
        
        // For programming languages and technical skills, treat as certificate-level
        // This helps with C++, Java, Python, etc. achievements
        if (titleLower.includes('c++') || titleLower.includes('java') || titleLower.includes('python') ||
            titleLower.includes('javascript') || titleLower.includes('programming') || titleLower.includes('coding') ||
            categoryLower.includes('programming') || categoryLower.includes('technical') ||
            categoryLower.includes('academic') || categoryLower.includes('course')) {
            console.log(`  → Mapped to: certificate (technical/academic)`);
            return 'certificate';
        }
        
        // Default to certificate level instead of participation (more generous scoring)
        console.log(`  → Mapped to: certificate (default)`);
        return 'certificate';
    }
    
    // Add CSS for skills styling and recommendations
    const style = document.createElement('style');
    style.textContent = `
        .skills-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .skill-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            margin-bottom: 12px;
            transition: all 0.3s ease;
        }
        
        .skill-item:hover {
            background: #f1f5f9;
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .skill-item.top-skill {
            border-left: 4px solid #10b981;
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        }
        
        .skill-item.top-skill .skill-name {
            color: #065f46;
            font-weight: 700;
        }
        
        .skill-item.top-skill .skill-percentage {
            color: #059669;
            font-weight: 700;
        }
        
        .skill-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .skill-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 16px;
        }
        
        .skill-percentage {
            font-size: 14px;
            color: #3b82f6;
            font-weight: 700;
            background: #eff6ff;
            padding: 4px 8px;
            border-radius: 12px;
        }
        
        .skill-level {
            font-size: 14px;
            color: #3b82f6;
            font-weight: 600;
        }
        
        .skill-progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .skill-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #64748b;
        }
        
        .skill-achievements {
            font-weight: 500;
        }
        
        .skill-category {
            background: #e0e7ff;
            color: #3730a3;
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .skill-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
            border-radius: 4px;
            transition: width 1s ease;
        }
        
        .skill-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #64748b;
        }
        
        .categories-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        
        .category-item {
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .category-header h4 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }
        
        .category-avg {
            font-size: 12px;
            color: #3b82f6;
            font-weight: 600;
            background: #eff6ff;
            padding: 4px 8px;
            border-radius: 12px;
        }
        
        .category-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            cursor: help;
            transition: all 0.2s;
        }
        
        .skill-tag:hover {
            background: #c7d2fe;
            transform: scale(1.05);
        }
        
        .recommendations-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
            transition: all 0.2s;
        }
        
        .recommendation-item:hover {
            background: #f1f5f9;
            transform: translateX(4px);
        }
        
        .rec-icon {
            width: 40px;
            height: 40px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            flex-shrink: 0;
        }
        
        .rec-content {
            flex: 1;
        }
        
        .rec-content h4 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px 0;
        }
        
        .rec-content p {
            font-size: 14px;
            color: #64748b;
            line-height: 1.5;
            margin: 0 0 12px 0;
        }
        
        .rec-action-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .rec-action-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
        }
        
        .action-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
        }
        
        .action-btn:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }
        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
        }
    `;
    document.head.appendChild(style);
});

// Top Skill Scoring System Functions

function showSkillInfoModal() {
    const modal = document.getElementById('skillInfoModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSkillInfoModal() {
    const modal = document.getElementById('skillInfoModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Skill Scoring Calculation Logic
class SkillScorer {
    constructor() {
        this.scoringRules = {
            certificate: { points: 5, maxCount: 2 },
            'competition-win': { points: 30, maxCount: 1 },
            workshop: { points: 5, maxCount: 1 },
            internship: { points: 30, maxCount: 2 },
            freelance: { points: 25, maxCount: 1 },
            'competition-participate': { points: 1, maxCount: 5 }
        };
    }
    
    calculateSkillScore(achievements, skillName) {
        const relevantAchievements = this.filterAchievementsBySkill(achievements, skillName);
        let score = 0;
        const contributions = {};
        
        // Count achievements by type
        const achievementCounts = this.countAchievementsByType(relevantAchievements);
        
        // Calculate score for each type
        for (const [type, rule] of Object.entries(this.scoringRules)) {
            const count = achievementCounts[type] || 0;
            const effectiveCount = Math.min(count, rule.maxCount);
            const typeScore = effectiveCount * rule.points;
            
            if (effectiveCount > 0) {
                contributions[type] = {
                    count: effectiveCount,
                    totalCount: count,
                    score: typeScore,
                    achievements: relevantAchievements.filter(a => a.type === type)
                };
            }
            
            score += typeScore;
        }
        
        return {
            totalScore: Math.min(score, 105), // Cap at 105%
            contributions: contributions,
            recommendations: this.generateRecommendations(contributions, score)
        };
    }
    
    filterAchievementsBySkill(achievements, skillName) {
        // This would filter achievements based on skill relevance
        // For demo purposes, we'll return mock data
        return this.getMockAchievements(skillName);
    }
    
    countAchievementsByType(achievements) {
        const counts = {};
        achievements.forEach(achievement => {
            counts[achievement.type] = (counts[achievement.type] || 0) + 1;
        });
        return counts;
    }
    
    generateRecommendations(contributions, currentScore) {
        const recommendations = [];
        const maxScore = 105;
        const remaining = maxScore - currentScore;
        
        if (remaining <= 0) return recommendations;
        
        // Check what's missing and suggest improvements
        for (const [type, rule] of Object.entries(this.scoringRules)) {
            const contribution = contributions[type];
            const currentCount = contribution ? contribution.count : 0;
            
            if (currentCount < rule.maxCount) {
                const potential = (rule.maxCount - currentCount) * rule.points;
                recommendations.push({
                    type: type,
                    description: this.getRecommendationText(type),
                    potentialGain: potential,
                    priority: this.getRecommendationPriority(type, potential)
                });
            }
        }
        
        return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 3);
    }
    
    getRecommendationText(type) {
        const texts = {
            certificate: 'Get a professional certification',
            'competition-win': 'Win a competition in this skill area',
            workshop: 'Attend a relevant workshop',
            internship: 'Complete an internship',
            freelance: 'Work on a freelance project',
            'competition-participate': 'Participate in more competitions'
        };
        return texts[type] || 'Improve this skill area';
    }
    
    getRecommendationPriority(type, potentialGain) {
        // Higher potential gain = higher priority
        return potentialGain;
    }
    
    getMockAchievements(skillName) {
        // Updated mock data with realistic achievements
        const mockData = {
            programming: [
                { type: 'certificate', name: 'AWS Certified Developer Associate', date: '2024-01-15' },
                { type: 'certificate', name: 'Oracle Java SE 11 Developer', date: '2024-03-20' },
                { type: 'competition-win', name: '1st Place - Smart India Hackathon 2024', date: '2024-02-10' },
                { type: 'internship', name: 'Software Developer Intern - TCS', date: '2024-06-01' },
                { type: 'internship', name: 'Backend Developer Intern - Infosys', date: '2023-12-15' },
                { type: 'competition-participate', name: 'CodeChef Long Challenge', date: '2024-01-05' },
                { type: 'competition-participate', name: 'HackerRank Hiring Challenge', date: '2024-02-12' },
                { type: 'competition-participate', name: 'LeetCode Weekly Contest', date: '2024-03-08' },
                { type: 'competition-participate', name: 'Google Code Jam Qualification', date: '2024-04-15' },
                { type: 'competition-participate', name: 'ACM ICPC Regional Round', date: '2024-05-20' }
            ],
            'data-analysis': [
                { type: 'certificate', name: 'Google Data Analytics Professional Certificate', date: '2024-02-01' },
                { type: 'workshop', name: 'Machine Learning Workshop - IIT Delhi', date: '2024-03-15' },
                { type: 'internship', name: 'Data Analyst Intern - Flipkart', date: '2024-07-01' },
                { type: 'freelancing', name: 'E-commerce Sales Analytics Dashboard', date: '2024-05-10' }
            ],
            leadership: [
                { type: 'workshop', name: 'Leadership Excellence Program - NIT Trichy', date: '2024-01-20' },
                { type: 'internship', name: 'Team Lead - Accenture Innovation Lab', date: '2024-06-15' },
                { type: 'competition-participate', name: 'Business Case Study Competition', date: '2024-02-25' },
                { type: 'competition-participate', name: 'Model UN Conference', date: '2024-04-10' },
                { type: 'competition-participate', name: 'Inter-College Debate Championship', date: '2024-05-05' }
            ]
        };
        
        return mockData[skillName] || [];
    }
}

// Initialize the scoring system
document.addEventListener('DOMContentLoaded', function() {
    const skillScorer = new SkillScorer();
    
    // Add event listener for info button
    const skillInfoBtn = document.getElementById('skillInfoBtn');
    if (skillInfoBtn) {
        skillInfoBtn.addEventListener('click', showSkillInfoModal);
    }
    
    // Add event listener for modal close
    const modal = document.getElementById('skillInfoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSkillInfoModal();
            }
        });
    }
    
    // Calculate and update skill scores
    updateSkillScores(skillScorer);
});

function updateSkillScores(skillScorer) {
    const skills = ['programming', 'data-analysis', 'leadership'];
    
    skills.forEach(skillName => {
        const skillItem = document.querySelector(`[data-skill="${skillName}"]`);
        if (skillItem) {
            // Get mock achievements (in real app, this would come from the database)
            const achievements = [];
            const scoreData = skillScorer.calculateSkillScore(achievements, skillName);
            
            // Update the UI with calculated scores
            updateSkillUI(skillItem, scoreData, skillName);
        }
    });
}

function updateSkillUI(skillItem, scoreData, skillName) {
    // Update score value
    const scoreValue = skillItem.querySelector('.score-value');
    if (scoreValue) {
        scoreValue.textContent = `${scoreData.totalScore}%`;
    }
    
    // Update progress bar
    const progressFill = skillItem.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${scoreData.totalScore}%`;
    }
    
    // Update total score in breakdown
    const totalScoreElement = skillItem.querySelector('.total-score');
    if (totalScoreElement) {
        totalScoreElement.textContent = `Total: ${scoreData.totalScore}%`;
    }
    
    // Update recommendations
    const recommendationsList = skillItem.querySelector('.recommendation-list');
    if (recommendationsList && scoreData.recommendations.length > 0) {
        recommendationsList.innerHTML = scoreData.recommendations.map(rec => 
            `<li><i class="fas fa-lightbulb"></i> ${rec.description} (+${rec.potentialGain}%)</li>`
        ).join('');
    }
}

// Function to toggle expandable skills section
function toggleExpandableSkills() {
    const expandableSkills = document.querySelector('.expandable-skills');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const showText = showMoreBtn.querySelector('.show-text');
    const hideText = showMoreBtn.querySelector('.hide-text');
    const chevronIcon = showMoreBtn.querySelector('i');
    
    if (expandableSkills.style.display === 'none' || expandableSkills.style.display === '') {
        // Show expandable skills
        expandableSkills.style.display = 'block';
        showText.style.display = 'none';
        hideText.style.display = 'inline';
        showMoreBtn.classList.add('expanded');
    } else {
        // Hide expandable skills
        expandableSkills.style.display = 'none';
        showText.style.display = 'inline';
        hideText.style.display = 'none';
        showMoreBtn.classList.remove('expanded');
    }
}
