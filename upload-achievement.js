document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const form = document.getElementById('achievementForm');
    const skillsInput = document.getElementById('skillsInput');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsTags = document.getElementById('skillsTags');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    const chooseFilesBtn = document.getElementById('chooseFilesBtn');

    // Skills array to store added skills
    let skills = [];
    let uploadedFiles = [];
    let isEditMode = false;
    let editingAchievementId = null;

    // Initialize page
    initializePage();

    function initializePage() {
        // Check if we're in edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const editingData = localStorage.getItem('editingAchievement');
        
        if (mode === 'edit' && editingData) {
            isEditMode = true;
            const achievement = JSON.parse(editingData);
            loadAchievementForEditing(achievement);
            localStorage.removeItem('editingAchievement');
        }

        // Update navigation badges
        updateNavigationBadges();
        
        // Initialize form validation
        setupFormValidation();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load user profile data
        loadUserProfile();
    }

    function updateNavigationBadges() {
        const stats = studentCredoData.getStats();
        document.querySelectorAll('.nav-badge').forEach(badge => {
            badge.textContent = stats.pending;
        });
    }

    function loadUserProfile() {
        const profile = studentCredoData.getUserProfile();
        const userInfo = document.querySelector('.user-info h4');
        const userRoll = document.querySelector('.user-info p');
        const userAvatar = document.querySelector('.user-avatar img');
        
        if (userInfo) userInfo.textContent = profile.name;
        if (userRoll) userRoll.textContent = profile.rollNumber;
        if (userAvatar && profile.profilePicture) {
            userAvatar.src = profile.profilePicture;
        }
    }

    function setupEventListeners() {
        // File input button
        if (chooseFilesBtn) {
            chooseFilesBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling to upload area
                fileInput.click();
            });
        }

        // Skills management
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', addSkill);
        }
        
        if (skillsInput) {
            skillsInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                }
            });
        }

        // File handling
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                handleFiles(e.target.files);
                e.target.value = '';
            });
        }

        // Drag and drop
        setupDragAndDrop();

        // Form submission
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }

        // Cancel button
        const cancelBtn = document.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (hasUnsavedChanges()) {
                    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                        window.location.href = 'achievements.html';
                    }
                } else {
                    window.location.href = 'achievements.html';
                }
            });
        }

        // Settings button
        const settingsBtn = document.querySelector('.settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                notifications.show('Settings functionality coming soon!', 'info');
            });
        }

        // Auto-resize textarea
        const textarea = document.getElementById('description');
        if (textarea) {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }

        // Setup character counter
        setupCharacterCounter();
    }

    function setupFormValidation() {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        clearFieldError(e);
        
        if (!value && field.hasAttribute('required')) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Specific validations
        if (field.id === 'achievementTitle' && value.length < 5) {
            showFieldError(field, 'Title must be at least 5 characters long');
            return false;
        }
        
        if (field.id === 'description' && value.length > 0 && value.length < 20) {
            showFieldError(field, 'Description must be at least 20 characters long');
            return false;
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function hasUnsavedChanges() {
        const title = document.getElementById('achievementTitle')?.value.trim();
        const description = document.getElementById('description')?.value.trim();
        return title || description || skills.length > 0 || uploadedFiles.length > 0;
    }

    // Skills management
    function addSkill() {
        const skillValue = skillsInput.value.trim();
        
        if (!skillValue) {
            notifications.show('Please enter a skill', 'error');
            skillsInput.focus();
            return;
        }

        if (skills.includes(skillValue)) {
            notifications.show('Skill already added', 'error');
            skillsInput.focus();
            return;
        }

        if (skills.length >= 10) {
            notifications.show('Maximum 10 skills allowed', 'error');
            return;
        }

        skills.push(skillValue);
        renderSkills();
        skillsInput.value = '';
        skillsInput.focus();
        
        // Show success feedback
        notifications.show(`Skill "${skillValue}" added successfully`, 'success');
    }

    function removeSkill(skillToRemove) {
        skills = skills.filter(skill => skill !== skillToRemove);
        renderSkills();
        notifications.show(`Skill "${skillToRemove}" removed`, 'info');
    }

    function renderSkills() {
        skillsTags.innerHTML = '';
        
        skills.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                <span>${skill}</span>
                <button type="button" class="remove-skill" onclick="removeSkill('${skill}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            skillsTags.appendChild(skillTag);
        });
    }

    // Make removeSkill globally accessible
    window.removeSkill = removeSkill;

    // File upload handling
    function handleFiles(files) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        let successCount = 0;

        Array.from(files).forEach(file => {
            // Check file type
            if (!allowedTypes.includes(file.type)) {
                notifications.show(`File type not supported: ${file.name}`, 'error');
                return;
            }

            // Check file size
            if (file.size > maxSize) {
                notifications.show(`File too large: ${file.name} (max 10MB)`, 'error');
                return;
            }

            // Check if file already exists
            if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                notifications.show(`File already uploaded: ${file.name}`, 'error');
                return;
            }

            // Add file to uploaded files
            uploadedFiles.push(file);
            successCount++;
        });

        if (successCount > 0) {
            renderUploadedFiles();
            notifications.show(`${successCount} file(s) uploaded successfully`, 'success');
        }
    }

    function removeFile(fileName, fileSize) {
        uploadedFiles = uploadedFiles.filter(file => !(file.name === fileName && file.size === fileSize));
        renderUploadedFiles();
        notifications.show(`File "${fileName}" removed`, 'info');
    }

    function renderUploadedFiles() {
        uploadedFilesContainer.innerHTML = '';
        
        if (uploadedFiles.length === 0) {
            return;
        }

        const filesHeader = document.createElement('div');
        filesHeader.className = 'files-header';
        filesHeader.innerHTML = `<h4><i class="fas fa-paperclip"></i> Uploaded Files (${uploadedFiles.length})</h4>`;
        uploadedFilesContainer.appendChild(filesHeader);
        
        uploadedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = getFileIcon(file.type);
            const fileSize = utils.formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <i class="fas ${fileIcon} file-icon"></i>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile('${file.name}', ${file.size})" title="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            uploadedFilesContainer.appendChild(fileItem);
        });
    }

    // Make removeFile globally accessible
    window.removeFile = removeFile;

    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'fa-image';
        if (fileType === 'application/pdf') return 'fa-file-pdf';
        if (fileType.includes('word')) return 'fa-file-word';
        return 'fa-file';
    }

    function setupDragAndDrop() {
        if (!uploadArea) return;

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // Load achievement for editing
    function loadAchievementForEditing(achievement) {
        editingAchievementId = achievement.id;
        
        // Update page title and header
        document.title = 'Edit Achievement - STUDENT Credo';
        const headerTitle = document.querySelector('.dashboard-header h1');
        if (headerTitle) {
            headerTitle.textContent = 'Edit Achievement';
        }
        
        const headerDescription = document.querySelector('.dashboard-header p');
        if (headerDescription) {
            headerDescription.textContent = 'Update your achievement information';
        }
        
        // Update submit button text
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Achievement';
        }
        
        // Populate form fields
        const titleInput = document.getElementById('achievementTitle');
        const categorySelect = document.getElementById('category');
        const descriptionTextarea = document.getElementById('description');
        const blockchainCheckbox = document.getElementById('blockchainVerification');
        
        if (titleInput) titleInput.value = achievement.title || '';
        if (categorySelect) categorySelect.value = achievement.category || '';
        if (descriptionTextarea) {
            descriptionTextarea.value = achievement.description || '';
            // Trigger auto-resize
            descriptionTextarea.dispatchEvent(new Event('input'));
        }
        if (blockchainCheckbox) blockchainCheckbox.checked = achievement.blockchain || false;
        
        // Load skills
        if (achievement.skills && Array.isArray(achievement.skills)) {
            skills = [...achievement.skills];
            renderSkills();
        }
        
        notifications.show('Achievement loaded for editing. Please re-upload any files if needed.', 'info');
    }

    // Form validation
    function validateForm() {
        const title = document.getElementById('achievementTitle')?.value.trim();
        const category = document.getElementById('category')?.value;
        const description = document.getElementById('description')?.value.trim();

        const errors = [];

        if (!title) {
            errors.push('Achievement title is required');
        } else if (title.length < 5) {
            errors.push('Achievement title must be at least 5 characters long');
        }

        if (!category) {
            errors.push('Achievement category is required');
        }

        if (!description) {
            errors.push('Achievement description is required');
        } else if (description.length < 20) {
            errors.push('Description must be at least 20 characters long');
        }

        if (skills.length === 0) {
            errors.push('At least one skill must be added');
        }

        // Files are optional for editing
        if (!isEditMode && uploadedFiles.length === 0) {
            errors.push('At least one supporting document must be uploaded');
        }

        return errors;
    }

    // Form submission
    function handleFormSubmission(e) {
        e.preventDefault();
        
        const errors = validateForm();
        
        if (errors.length > 0) {
            notifications.show(errors[0], 'error');
            return;
        }

        // Disable submit button
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = isEditMode 
                ? '<i class="fas fa-spinner fa-spin"></i> Updating...'
                : '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        // Simulate form submission with progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (submitBtn) {
                const action = isEditMode ? 'Updating' : 'Submitting';
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${action}... ${progress}%`;
            }
        }, 200);

        setTimeout(() => {
            clearInterval(progressInterval);
            
            const formData = {
                title: document.getElementById('achievementTitle').value.trim(),
                category: document.getElementById('category').value,
                description: document.getElementById('description').value.trim(),
                skills: skills,
                files: uploadedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                })),
                blockchain: document.getElementById('blockchainVerification')?.checked || false,
                status: 'pending',
                issuer: 'Self-reported',
                dateCreated: new Date().toISOString()
            };

            try {
                if (isEditMode && editingAchievementId) {
                    // Update existing achievement
                    const updatedAchievement = studentCredoData.updateAchievement(editingAchievementId, formData);
                    if (updatedAchievement) {
                        notifications.show('Achievement updated successfully!', 'success');
                        
                        // Dispatch stats update event
                        window.dispatchEvent(new CustomEvent('statsUpdated', {
                            detail: studentCredoData.getStats()
                        }));
                    } else {
                        throw new Error('Failed to update achievement');
                    }
                } else {
                    // Create new achievement and add to pending approvals
                    const newApproval = studentCredoData.addPendingApproval(formData);
                    notifications.show('Achievement submitted successfully! It will be reviewed by faculty.', 'success');
                    
                    // Dispatch stats update event
                    window.dispatchEvent(new CustomEvent('statsUpdated', {
                        detail: studentCredoData.getStats()
                    }));
                    
                    // Dispatch approvals update event for admin interface
                    window.dispatchEvent(new CustomEvent('approvalsUpdated', {
                        detail: studentCredoData.getPendingApprovals()
                    }));
                }
                
                // Reset form after successful submission
                setTimeout(() => {
                    window.location.href = 'achievements.html';
                }, 2000);
                
            } catch (error) {
                console.error('Error submitting achievement:', error);
                notifications.show('Error submitting achievement. Please try again.', 'error');
                
                // Re-enable submit button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = isEditMode 
                        ? '<i class="fas fa-save"></i> Update Achievement'
                        : '<i class="fas fa-paper-plane"></i> Submit for Review';
                }
            }
        }, 2000);
    }

    function setupCharacterCounter() {
        const descriptionInput = document.getElementById('description');
        if (!descriptionInput) return;
        
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = 'font-size: 12px; color: #64748b; text-align: right; margin-top: 4px;';
        descriptionInput.parentNode.appendChild(charCounter);
        
        descriptionInput.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length}/1000 characters`;
            
            if (length > 1000) {
                charCounter.style.color = '#ef4444';
                this.value = this.value.substring(0, 1000);
            } else if (length < 20) {
                charCounter.style.color = '#f59e0b';
            } else {
                charCounter.style.color = '#22c55e';
            }
        });
        
        // Initialize counter
        descriptionInput.dispatchEvent(new Event('input'));
    }

    // Add enhanced styles
    const enhancedStyles = document.createElement('style');
    enhancedStyles.textContent = `
        .upload-area.dragover {
            border-color: #3b82f6;
            background-color: #eff6ff;
            transform: scale(1.02);
        }
        
        .file-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            margin-bottom: 8px;
            transition: all 0.2s;
        }
        
        .file-item:hover {
            background: #f1f5f9;
            transform: translateX(4px);
        }
        
        .files-header {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .files-header h4 {
            margin: 0;
            color: #334155;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .file-icon {
            font-size: 20px;
            color: #64748b;
        }
        
        .file-info {
            flex: 1;
        }
        
        .file-name {
            font-weight: 500;
            color: #334155;
            font-size: 14px;
        }
        
        .file-size {
            font-size: 12px;
            color: #64748b;
        }
        
        .remove-file {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 6px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .remove-file:hover {
            background: #fee2e2;
            transform: scale(1.1);
        }
        
        .skill-tag {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #e0e7ff;
            color: #3730a3;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin: 4px;
            transition: all 0.2s;
        }
        
        .skill-tag:hover {
            background: #c7d2fe;
            transform: translateY(-1px);
        }
        
        .remove-skill {
            background: none;
            border: none;
            color: #3730a3;
            cursor: pointer;
            padding: 2px;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .remove-skill:hover {
            background: rgba(55, 48, 163, 0.1);
            transform: scale(1.2);
        }
        
        .field-error {
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .field-error::before {
            content: "⚠";
        }
        
        input.error, select.error, textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .char-counter {
            transition: color 0.2s;
        }
    `;
    document.head.appendChild(enhancedStyles);
});
