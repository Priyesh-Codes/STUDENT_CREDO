# STUDENT Credo - Achievement Management System

A comprehensive web application for managing student achievements, certificates, and academic progress with blockchain verification capabilities.

## 🚀 Live Demo

Visit the live application: [Your GitHub Pages URL will be here]

## 📋 Features

- **Student Dashboard**: Track achievements, upload certificates, view progress
- **Admin Portal**: Manage approvals, student data, and system analytics  
- **Digital Passport**: Comprehensive student profile with all achievements
- **Blockchain Credentials**: Secure verification of certificates
- **Skills Analysis**: AI-powered skill assessment and recommendations
- **Real-time Analytics**: Progress tracking and performance metrics

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Inter)
- **Storage**: Local Storage for data persistence
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
├── index.html              # Main dashboard (entry point)
├── admin-dashboard.html    # Admin dashboard
├── achievements.html       # Student achievements page
├── upload-achievement.html # Achievement upload form
├── skills-analysis.html    # Skills analysis page
├── digital-passport.html   # Digital passport page
├── blockchain-credentials.html # Blockchain verification page
├── admin-approvals.html    # Admin approvals page
├── student-management.html # Student management page
├── analytics.html          # Analytics dashboard
├── shared-utils.js         # Common utilities and data management
└── *.css                   # Styling files for each page
```

## 🚀 Deployment on GitHub Pages

### Method 1: Direct Repository Deployment

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/student-credo.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

3. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/student-credo`

### Method 2: Using GitHub Desktop

1. Open GitHub Desktop
2. Create new repository from existing folder
3. Publish to GitHub
4. Follow steps 2-3 from Method 1

## 💻 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/student-credo.git
   cd student-credo
   ```

2. **Serve locally** (choose one method):
   
   **Using Python:**
   ```bash
   python -m http.server 8000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```
   
   **Using Live Server (VS Code extension):**
   - Install Live Server extension
   - Right-click on index.html → "Open with Live Server"

3. **Open in browser**: http://localhost:8000

## 🎯 Usage

1. **Student Portal**: 
   - Access via the main dashboard (index.html)
   - Upload achievements, view progress, analyze skills

2. **Admin Portal**:
   - Toggle to admin mode using the mode switcher
   - Manage student approvals and view analytics

## 🔧 Configuration

- **Data Storage**: All data is stored in browser's localStorage
- **Mode Switching**: Toggle between student and admin modes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🌐 Browser Support

- Chrome (recommended)
- Firefox  
- Safari
- Edge

## 📝 License

MIT License - feel free to use this project for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.
