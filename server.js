const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for repos (in production, use a database)
let repos = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all repos
app.get('/api/repos', (req, res) => {
    res.json(repos);
});

// Add a repo
app.post('/api/repos', async (req, res) => {
    const { repoName } = req.body;
    
    if (!repoName) {
        return res.status(400).json({ error: 'Repository name is required' });
    }

    // Check if repo already exists
    if (repos.find(repo => repo.name === repoName)) {
        return res.status(400).json({ error: 'Repository already exists' });
    }

    try {
        // Fetch repo details from GitHub API
        const response = await axios.get(`https://api.github.com/repos/${repoName}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitHub-Repo-Manager'
            }
        });

        const repoData = {
            name: repoName,
            fullName: response.data.full_name,
            description: response.data.description,
            stars: response.data.stargazers_count,
            forks: response.data.forks_count,
            language: response.data.language,
            url: response.data.html_url,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at
        };

        repos.push(repoData);
        res.json(repoData);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Repository not found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch repository data' });
        }
    }
});

// Remove a repo
app.delete('/api/repos/:repoName', (req, res) => {
    const { repoName } = req.params;
    const index = repos.findIndex(repo => repo.name === repoName);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Repository not found' });
    }
    
    repos.splice(index, 1);
    res.json({ message: 'Repository removed successfully' });
});

// Get repo details
app.get('/api/repos/:repoName', async (req, res) => {
    const { repoName } = req.params;
    
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoName}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitHub-Repo-Manager'
            }
        });

        const repoData = {
            name: repoName,
            fullName: response.data.full_name,
            description: response.data.description,
            stars: response.data.stargazers_count,
            forks: response.data.forks_count,
            language: response.data.language,
            url: response.data.html_url,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at
        };

        res.json(repoData);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Repository not found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch repository data' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});