// GitHub API configuration
let githubToken = '';
let currentUser = null;

// DOM elements
const authSection = document.getElementById('authSection');
const mainContent = document.getElementById('mainContent');
const loading = document.getElementById('loading');
const repositories = document.getElementById('repositories');
const userInfo = document.getElementById('userInfo');

// Authentication function
async function authenticate() {
    const tokenInput = document.getElementById('githubToken');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showError('Please enter a valid GitHub token');
        return;
    }
    
    try {
        showLoading(true);
        
        // Test the token by fetching user info
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Invalid token or authentication failed');
        }
        
        const user = await response.json();
        
        // Store the token and user info
        githubToken = token;
        currentUser = user;
        
        // Hide auth section and show main content
        authSection.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Update user info
        userInfo.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" style="width: 30px; height: 30px; border-radius: 50%;">
            <span>Welcome, ${user.name || user.login}!</span>
        `;
        
        // Load repositories
        await loadRepositories();
        
        showSuccess('Successfully authenticated with GitHub!');
        
    } catch (error) {
        showError(`Authentication failed: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Load repositories function
async function loadRepositories() {
    try {
        showLoading(true);
        clearMessages();
        
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        displayRepositories(repos);
        
    } catch (error) {
        showError(`Failed to load repositories: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Display repositories function
function displayRepositories(repos) {
    if (repos.length === 0) {
        repositories.innerHTML = `
            <div class="no-repos">
                <h3>No repositories found</h3>
                <p>You don't have any repositories yet.</p>
            </div>
        `;
        return;
    }
    
    repositories.innerHTML = repos.map(repo => `
        <div class="repo-card">
            <div class="repo-header">
                <div class="repo-title">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    ${repo.private ? '<span style="background: #ffd700; color: #333; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem;">Private</span>' : '<span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem;">Public</span>'}
                </div>
                <div class="repo-actions">
                    <a href="${repo.html_url}" target="_blank" class="view-btn">
                        🔗 View
                    </a>
                    <button onclick="deleteRepository('${repo.name}', '${repo.owner.login}')" class="delete-btn">
                        🗑️ Delete
                    </button>
                </div>
            </div>
            
            ${repo.description ? `<div class="repo-description">${repo.description}</div>` : ''}
            
            <div class="repo-meta">
                ${repo.language ? `<span>📝 ${repo.language}</span>` : ''}
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>📅 Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Delete repository function
async function deleteRepository(repoName, ownerLogin) {
    const confirmDelete = confirm(`Are you sure you want to delete the repository "${repoName}"?\n\nThis action cannot be undone!`);
    
    if (!confirmDelete) {
        return;
    }
    
    // Double confirmation for safety
    const confirmAgain = confirm(`FINAL CONFIRMATION:\n\nYou are about to permanently delete "${repoName}".\n\nType the repository name in the next prompt to confirm.`);
    
    if (!confirmAgain) {
        return;
    }
    
    const typedName = prompt(`Type "${repoName}" to confirm deletion:`);
    
    if (typedName !== repoName) {
        showError('Repository name did not match. Deletion cancelled.');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`https://api.github.com/repos/${ownerLogin}/${repoName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Insufficient permissions. Make sure your token has "delete_repo" scope.');
            }
            throw new Error(`Failed to delete repository (${response.status})`);
        }
        
        showSuccess(`Repository "${repoName}" has been successfully deleted.`);
        
        // Reload repositories to reflect the change
        await loadRepositories();
        
    } catch (error) {
        showError(`Failed to delete repository: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Utility functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.container').appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function showSuccess(message) {
    clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.container').appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

function clearMessages() {
    const existingMessages = document.querySelectorAll('.error, .success');
    existingMessages.forEach(msg => {
        if (msg.parentNode) {
            msg.parentNode.removeChild(msg);
        }
    });
}

// Handle Enter key in token input
document.getElementById('githubToken').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        authenticate();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('GitHub Repository Manager loaded');
});