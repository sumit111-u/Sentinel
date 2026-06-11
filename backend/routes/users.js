import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /users/settings - Get user settings
router.get('/settings', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }

    res.json({
      id: user.id,
      discord_webhook_url: user.discordWebhookUrl,
      auto_post_comments: user.autoPostComments,
      check_security: user.checkSecurity,
      check_performance: user.checkPerformance,
      check_code_smells: user.checkCodeSmells,
      block_on_critical: user.blockOnCritical,
      block_on_warnings: user.blockOnWarnings,
    });
  } catch (error) {
    console.error('Get settings error:', error.message);
    res.status(500).json({ detail: error.message });
  }
});

// PATCH /users/settings - Update user settings
router.patch('/settings', requireAuth, async (req, res) => {
  try {
    const updates = {};

    // Map snake_case to camelCase
    if (req.body.discord_webhook_url !== undefined) {
      updates.discordWebhookUrl = req.body.discord_webhook_url;
    }
    if (req.body.auto_post_comments !== undefined) {
      updates.autoPostComments = req.body.auto_post_comments;
    }
    if (req.body.check_security !== undefined) {
      updates.checkSecurity = req.body.check_security;
    }
    if (req.body.check_performance !== undefined) {
      updates.checkPerformance = req.body.check_performance;
    }
    if (req.body.check_code_smells !== undefined) {
      updates.checkCodeSmells = req.body.check_code_smells;
    }
    if (req.body.block_on_critical !== undefined) {
      updates.blockOnCritical = req.body.block_on_critical;
    }
    if (req.body.block_on_warnings !== undefined) {
      updates.blockOnWarnings = req.body.block_on_warnings;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updates,
    });

    res.json({
      ok: true,
      settings: {
        id: user.id,
        discord_webhook_url: user.discordWebhookUrl,
        auto_post_comments: user.autoPostComments,
        check_security: user.checkSecurity,
        check_performance: user.checkPerformance,
        check_code_smells: user.checkCodeSmells,
        block_on_critical: user.blockOnCritical,
        block_on_warnings: user.blockOnWarnings,
      },
    });
  } catch (error) {
    console.error('Update settings error:', error.message);
    res.status(500).json({ detail: error.message });
  }
});

export default router;
