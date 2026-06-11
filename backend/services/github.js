import axios from 'axios';
import { config } from '../config.js';

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_BASE = 'https://api.github.com';

export const buildOAuthRedirectUrl = () => {
  const params = new URLSearchParams({
    client_id: config.github.clientId,
    scope: 'repo,read:user,user:email',
    redirect_uri: config.github.redirectUri,
  });

  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post(
      GITHUB_TOKEN_URL,
      {
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (!response.data.access_token) {
      throw new Error(`GitHub OAuth error: ${JSON.stringify(response.data)}`);
    }

    return response.data.access_token;
  } catch (error) {
    throw new Error(`Failed to exchange code for token: ${error.message}`);
  }
};

export const getGitHubUser = async (accessToken) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch GitHub user: ${error.message}`);
  }
};

export const getUserRepos = async (accessToken) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        sort: 'updated',
        per_page: 100,
        affiliation: 'owner,collaborator',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user repos: ${error.message}`);
  }
};

export const getRepoOpenPRs = async (accessToken, repo) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${repo}/pulls`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { state: 'open', per_page: 50 },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch open PRs: ${error.message}`);
  }
};

export const getPRDetails = async (accessToken, repo, prNumber) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${repo}/pulls/${prNumber}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch PR details: ${error.message}`);
  }
};

export const getPRDiff = async (accessToken, repo, prNumber) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch PR diff: ${error.message}`);
  }
};

export const getPRFiles = async (accessToken, repo, prNumber) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${repo}/pulls/${prNumber}/files`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch PR files: ${error.message}`);
  }
};

export const postPRReviewComment = async (accessToken, repo, prNumber, body) => {
  try {
    await axios.post(
      `${GITHUB_API_BASE}/repos/${repo}/issues/${prNumber}/comments`,
      { body },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (error) {
    console.error(`Failed to post PR comment: ${error.message}`);
    throw error;
  }
};

export const detectLanguages = (files) => {
  const extMap = {
    '.py': 'Python',
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript/React',
    '.jsx': 'JavaScript/React',
    '.go': 'Go',
    '.java': 'Java',
    '.cs': 'C#',
    '.cpp': 'C++',
    '.c': 'C',
    '.rb': 'Ruby',
    '.rs': 'Rust',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.sh': 'Shell',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.json': 'JSON',
    '.tf': 'Terraform',
    '.sql': 'SQL',
    '.html': 'HTML',
    '.css': 'CSS',
  };

  const languages = new Set();

  for (const file of files) {
    const filename = file.filename || '';
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();

    if (extMap[ext]) {
      languages.add(extMap[ext]);
    }
  }

  return Array.from(languages);
};
