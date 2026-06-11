import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config.js';
import { requireAuth, createSessionToken } from '../middleware/auth.js';
import * as gh from '../services/github.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /auth/login - Redirect to GitHub OAuth
router.get('/login', (req, res) => {
  const redirectUrl = gh.buildOAuthRedirectUrl();
  res.redirect(redirectUrl);
});

// GET /auth/callback - Handle GitHub OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ detail: 'Missing authorization code' });
    }

    // Exchange code for access token
    const accessToken = await gh.exchangeCodeForToken(code);

    // Fetch user profile from GitHub
    const githubUser = await gh.getGitHubUser(accessToken);

    // Upsert user in database
    let user = await prisma.user.findUnique({
      where: { githubId: githubUser.id },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken,
          login: githubUser.login,
          name: githubUser.name,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          githubId: githubUser.id,
          login: githubUser.login,
          name: githubUser.name,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
          accessToken,
        },
      });
    }

    // Create JWT session token
    const sessionToken = createSessionToken(user.id);

    // Redirect to frontend with token in URL
    const redirectUri = `${config.frontendUrl}/dashboard?token=${sessionToken}`;
    res.redirect(redirectUri);
  } catch (error) {
    console.error('OAuth callback error:', error.message);
    res.status(400).json({ detail: error.message });
  }
});

// GET /auth/me - Get current user
router.get('/me', requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    github_id: req.user.githubId,
    login: req.user.login,
    name: req.user.name,
    email: req.user.email,
    avatar_url: req.user.avatarUrl,
  });
});

// POST /auth/logout - Clear session
router.post('/logout', (req, res) => {
  res.clearCookie('sentinel_session');
  res.json({ ok: true });
});

export default router;
