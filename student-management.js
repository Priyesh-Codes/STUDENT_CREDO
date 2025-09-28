// Student Management JavaScript

// Sample student data
let studentsData = [
    {
        id: 1,
        name: "Priyesh Kumar Kashyap",
        rollNumber: "BT24CS063",
        department: "CSE",
        year: 2,
        section: "A2",
        email: "priyesh@example.com",
        achievements: 5,
        activityPoints: 120,
        status: "active"
    },
    {
        id: 2,
        name: "Rahul Sharma",
        rollNumber: "BT24CS045",
        department: "CSE",
        year: 2,
        section: "A1",
        email: "rahul@example.com",
        achievements: 8,
        activityPoints: 200,
        status: "active"
    },
    {
        id: 3,
        name: "Ananya Singh",
        rollNumber: "BT24ECE021",
        department: "ECE",
        year: 2,
        section: "B1",
        email: "ananya@example.com",
        achievements: 3,
        activityPoints: 75,
        status: "active"
    },
    {
        id: 4,
        name: "Arjun Patel",
        rollNumber: "BT23CS089",
        department: "CSE",
        year: 3,
        section: "A3",
        email: "arjun@example.com",
        achievements: 12,
        activityPoints: 350,
        status: "active"
    },
    {
        id: 5,
        name: "Sneha Reddy",
        rollNumber: "BT23ME034",
        department: "ME",
        year: 3,
        section: "B2",
        email: "sneha@example.com",
        achievements: 6,
        activityPoints: 150,
        status: "active"
    },
    {
        id: 6,
        name: "Vikram Gupta",
        rollNumber: "BT22EE067",
        department: "EE",
        year: 4,
        section: "A1",
        email: "vikram@example.com",
        achievements: 15,
        activityPoints: 450,
        status: "graduated"
    },
    {
        id: 7,
        name: "Pooja Mehta",
        rollNumber: "BT24CE012",
        department: "CE",
        year: 1,
        section: "A1",
        email: "pooja@example.com",
        achievements: 1,
        activityPoints: 25,
        status: "active"
    },
    {
        id: 8,
        name: "Karthik Raj",
        rollNumber: "BT23ECE078",
        department: "ECE",
        year: 3,
        section: "B3",
        email: "karthik@example.com",
        achievements: 9,
        activityPoints: 225,
        status: "inactive"
    }
];

// Pagination and filtering variables
let currentPage = 1;
const itemsPerPage = 10;
let filteredStudents = [...studentsData];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeStudentManagement();
});

function initializeStudentManagement() {
    setupEventListeners();
    renderStudentsTable();
    updatePagination();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('studentSearch');
    searchInput.addEventListener('input', handleSearch);
    
    // Filter functionality
    const departmentFilter = document.getElementById('departmentFilter');
    const yearFilter = document.getElementById('yearFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    departmentFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    
    // Add student modal
    const addStudentBtn = document.querySelector('.add-student-btn');
    const modal = document.getElementById('addStudentModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addStudentForm = document.getElementById('addStudentForm');
    
    addStudentBtn.addEventListener('click', () => showModal());
    closeModal.addEventListener('click', () => hideModal());
    cancelBtn.addEventListener('click', () => hideModal());
    addStudentForm.addEventListener('submit', handleAddStudent);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
    
    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    selectAll.addEventListener('change', handleSelectAll);
    
    // Export functionality
    const exportBtn = document.querySelector('.export-btn');
    exportBtn.addEventListener('click', exportStudentData);
    
    // Refresh functionality
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.addEventListener('click', refreshData);
}

function handleSearch() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    
    filteredStudents = studentsData.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.rollNumber.toLowerCase().includes(searchTerm) ||
        student.department.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );
    
    applyFilters();
}

function applyFilters() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = [...filteredStudents];
    
    if (departmentFilter) {
        filtered = filtered.filter(student => student.department === departmentFilter);
    }
    
    if (yearFilter) {
        filtered = filtered.filter(student => student.year.toString() === yearFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(student => student.status === statusFilter);
    }
    
    filteredStudents = filtered;
    currentPage = 1;
    renderStudentsTable();
    updatePagination();
}

function renderStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const studentsToShow = filteredStudents.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    studentsToShow.forEach(student => {
        const row = createStudentRow(student);
        tbody.appendChild(row);
    });
    
    // Update showing info
    document.getElementById('showingStart').textContent = startIndex + 1;
    document.getElementById('showingEnd').textContent = Math.min(endIndex, filteredStudents.length);
    document.getElementById('totalStudents').textContent = filteredStudents.length;
}

function createStudentRow(student) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="student-checkbox" data-id="${student.id}">
        </td>
        <td>
            <div class="student-info">
                <div class="student-avatar">
                    ${getInitials(student.name)}
                </div>
                <div class="student-details">
                    <h4>${student.name}</h4>
                    <p>${student.email}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="roll-number">${student.rollNumber}</span>
        </td>
        <td>
            <span class="department-badge">${student.department}</span>
        </td>
        <td>
            <span class="year-badge">${getYearText(student.year)}</span>
        </td>
        <td>
            <span class="achievements-count">${student.achievements}</span>
        </td>
        <td>
            <span class="activity-points">${student.activityPoints}</span>
        </td>
        <td>
            <span class="status-badge ${student.status}">${capitalizeFirst(student.status)}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn view" onclick="viewStudent(${student.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editStudent(${student.id})" title="Edit Student">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteStudent(${student.id})" title="Delete Student">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
}

function getYearText(year) {
    const yearTexts = {1: '1st', 2: '2nd', 3: '3rd', 4: '4th'};
    return yearTexts[year] || year;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updatePagination() {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Generate page numbers
    paginationNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            paginationNumbers.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationNumbers.appendChild(ellipsis);
        }
    }
    
    // Add event listeners for prev/next
    prevBtn.onclick = () => goToPage(currentPage - 1);
    nextBtn.onclick = () => goToPage(currentPage + 1);
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderStudentsTable();
        updatePagination();
    }
}

function showModal() {
    const modal = document.getElementById('addStudentModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    const modal = document.getElementById('addStudentModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('addStudentForm').reset();
}

function handleAddStudent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newStudent = {
        id: Date.now(), // Simple ID generation
        name: formData.get('name'),
        rollNumber: formData.get('rollNumber'),
        department: formData.get('department'),
        year: parseInt(formData.get('year')),
        section: formData.get('section'),
        email: formData.get('email'),
        achievements: 0,
        activityPoints: 0,
        status: 'active'
    };
    
    // Add to students data
    studentsData.push(newStudent);
    
    // Refresh the display
    applyFilters();
    hideModal();
    
    // Show success message
    showNotification('Student added successfully!', 'success');
}

function handleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function viewStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (student) {
        // Redirect to student profile page or show details modal
        window.location.href = `student-profile.html?id=${id}`;
    }
}

function editStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (student) {
        // Populate form with student data and show modal
        document.getElementById('studentName').value = student.name;
        document.getElementById('rollNumber').value = student.rollNumber;
        document.getElementById('department').value = student.department;
        document.getElementById('year').value = student.year;
        document.getElementById('section').value = student.section;
        document.getElementById('email').value = student.email;
        
        showModal();
    }
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        studentsData = studentsData.filter(s => s.id !== id);
        applyFilters();
        showNotification('Student deleted successfully!', 'success');
    }
}

function exportStudentData() {
    // Create CSV content
    const headers = ['Name', 'Roll Number', 'Department', 'Year', 'Section', 'Email', 'Achievements', 'Activity Points', 'Status'];
    const csvContent = [
        headers.join(','),
        ...filteredStudents.map(student => [
            student.name,
            student.rollNumber,
            student.department,
            student.year,
            student.section,
            student.email,
            student.achievements,
            student.activityPoints,
            student.status
        ].join(','))
    ].join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Student data exported successfully!', 'success');
}

function refreshData() {
    // Simulate data refresh
    const refreshBtn = document.querySelector('.refresh-btn i');
    refreshBtn.style.animation = 'spin 1s linear infinite';
    
    setTimeout(() => {
        refreshBtn.style.animation = '';
        renderStudentsTable();
        updatePagination();
        showNotification('Data refreshed successfully!', 'success');
    }, 1000);
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
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
    
    .pagination-ellipsis {
        padding: 8px;
        color: #64748b;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
