import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as gh from '../services/github.js';

const router = express.Router();

// GET /github/repos - List user repositories
router.get('/repos', requireAuth, async (req, res) => {
  try {
    const repos = await gh.getUserRepos(req.user.accessToken);

    const formattedRepos = repos.map((r) => ({
      full_name: r.full_name,
      name: r.name,
      owner: r.owner.login,
      private: r.private,
      description: r.description,
      language: r.language,
      open_issues_count: r.open_issues_count || 0,
      html_url: r.html_url,
      updated_at: r.updated_at,
    }));

    res.json(formattedRepos);
  } catch (error) {
    console.error('Error listing repos:', error.message);
    res.status(400).json({ detail: error.message });
  }
});

// GET /github/repos/:owner/:repo/pulls - List open PRs for a repo
router.get('/repos/:owner/:repo/pulls', requireAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const fullName = `${owner}/${repo}`;

    const prs = await gh.getRepoOpenPRs(req.user.accessToken, fullName);

    const formattedPRs = prs.map((pr) => ({
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      html_url: pr.html_url,
      base: pr.base.ref,
      head: pr.head.ref,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
    }));

    res.json(formattedPRs);
  } catch (error) {
    console.error('Error listing PRs:', error.message);
    res.status(400).json({ detail: error.message });
  }
});

export default router;
