# GitHub Repo Manager

A Node.js-based GitHub repository manager with a sleek black theme. Manage your favorite GitHub repositories with an intuitive web interface that fetches real-time data from the GitHub API.

## Features

- **Modern Black Theme**: Clean, dark interface that's easy on the eyes
- **Real-time GitHub Data**: Fetches repository information directly from GitHub API
- **Repository Details**: View stars, forks, language, and descriptions
- **Add/Remove Repos**: Simple management of your repository collection
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Add repositories using the format `owner/repository-name` (e.g., `facebook/react`)

## API Endpoints

- `GET /api/repos` - Get all managed repositories
- `POST /api/repos` - Add a new repository
- `DELETE /api/repos/:repoName` - Remove a repository
- `GET /api/repos/:repoName` - Get details for a specific repository

## Configuration

You can set the following environment variables:

- `PORT` - Server port (default: 3000)
- `GITHUB_TOKEN` - Optional GitHub personal access token for higher API rate limits

## GitHub API Rate Limits

The application uses the public GitHub API. Without authentication, you're limited to 60 requests per hour. For higher limits, you can add a GitHub personal access token to your `.env` file:

```
GITHUB_TOKEN=your_github_token_here
```

## Technologies Used

- **Backend**: Node.js, Express.js, Axios
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: GitHub REST API v3

## License

MIT License