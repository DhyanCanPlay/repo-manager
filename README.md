# GitHub Repository Manager

A simple web-based GitHub repository manager that allows you to view and delete your repositories with direct delete buttons.

## Features

- 🔐 Secure GitHub API authentication using Personal Access Tokens
- 📋 List all your GitHub repositories with detailed information
- 🗑️ Direct delete buttons for each repository with safety confirmations
- 📱 Responsive design that works on desktop and mobile
- ⚡ Real-time repository information including stars, forks, and last update
- 🔄 Refresh functionality to get latest repository data

## Getting Started

1. **Clone this repository:**
   ```bash
   git clone https://github.com/DhyanCanPlay/repo-manager.git
   cd repo-manager
   ```

2. **Open the application:**
   Simply open `index.html` in your web browser, or serve it using a local web server.

3. **Get a GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token"
   - Give it a descriptive name
   - Select the following scopes:
     - `repo` (Full control of private repositories)
     - `delete_repo` (Delete repositories)
   - Copy the generated token

4. **Connect to GitHub:**
   - Paste your token in the input field
   - Click "Connect to GitHub"
   - Your repositories will load automatically

## Usage

- **View Repositories:** All your repositories are displayed with key information including language, stars, forks, and last update date
- **Delete Repository:** Click the red "🗑️ Delete" button next to any repository
  - You'll get multiple confirmation prompts for safety
  - You must type the exact repository name to confirm deletion
  - This action cannot be undone!
- **Refresh:** Click the "🔄 Refresh Repositories" button to reload the latest data

## Security Notes

- Your GitHub token is only stored in memory and never saved to disk
- All API calls are made directly to GitHub from your browser
- No data is sent to any third-party servers
- Always use tokens with minimal required permissions

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript
- GitHub REST API

## Local Development

For local development with live reloading, you can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.