// Repo Manager Logic - Node.js API Integration
const repoListEl = document.getElementById('repoList');
const addRepoForm = document.getElementById('addRepoForm');
const repoInput = document.getElementById('repoInput');

async function getRepos() {
    try {
        const response = await fetch('/api/repos');
        return await response.json();
    } catch (error) {
        console.error('Error fetching repos:', error);
        return [];
    }
}

function renderRepos() {
    getRepos().then(repos => {
        repoListEl.innerHTML = '';
        repos.forEach((repo) => {
            const li = document.createElement('li');
            li.className = 'repo-item';
            
            const repoInfo = document.createElement('div');
            repoInfo.className = 'repo-info';
            
            const title = document.createElement('h3');
            title.textContent = repo.fullName || repo.name;
            title.className = 'repo-title';
            
            const description = document.createElement('p');
            description.textContent = repo.description || 'No description available';
            description.className = 'repo-description';
            
            const stats = document.createElement('div');
            stats.className = 'repo-stats';
            stats.innerHTML = `
                <span class="stat">⭐ ${repo.stars || 0}</span>
                <span class="stat">🍴 ${repo.forks || 0}</span>
                ${repo.language ? `<span class="stat">📝 ${repo.language}</span>` : ''}
            `;
            
            repoInfo.appendChild(title);
            repoInfo.appendChild(description);
            repoInfo.appendChild(stats);
            
            const actions = document.createElement('div');
            actions.className = 'repo-actions';
            
            if (repo.url) {
                const visitBtn = document.createElement('a');
                visitBtn.href = repo.url;
                visitBtn.target = '_blank';
                visitBtn.textContent = 'Visit';
                visitBtn.className = 'visit-btn';
                actions.appendChild(visitBtn);
            }
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => {
                removeRepo(repo.name);
            };
            actions.appendChild(removeBtn);
            
            li.appendChild(repoInfo);
            li.appendChild(actions);
            repoListEl.appendChild(li);
        });
    });
}

async function addRepo(repoName) {
    try {
        const response = await fetch('/api/repos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ repoName }),
        });
        
        if (response.ok) {
            renderRepos();
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to add repository');
        }
    } catch (error) {
        console.error('Error adding repo:', error);
        alert('Failed to add repository');
    }
}

async function removeRepo(repoName) {
    try {
        const response = await fetch(`/api/repos/${encodeURIComponent(repoName)}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            renderRepos();
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to remove repository');
        }
    } catch (error) {
        console.error('Error removing repo:', error);
        alert('Failed to remove repository');
    }
}

addRepoForm.onsubmit = (e) => {
    e.preventDefault();
    const repo = repoInput.value.trim();
    if (repo) {
        addRepo(repo);
        repoInput.value = '';
    }
};

// Initial render
renderRepos();