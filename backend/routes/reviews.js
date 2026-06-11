import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import * as gh from '../services/github.js';
import * as groq from '../services/groq.js';
import * as discord from '../services/discord.js';

const router = express.Router();
const prisma = new PrismaClient();

// Background task: Run AI review
const runReview = async (reviewId, repo, prNumber, accessToken, userSettings, discordWebhook) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      console.error(`Review ${reviewId} not found`);
      return;
    }

    // 1. Fetch PR files and diff
    const files = await gh.getPRFiles(accessToken, repo, prNumber);
    const diff = await gh.getPRDiff(accessToken, repo, prNumber);
    const languages = gh.detectLanguages(files);

    // 2. Run AI review
    const aiResult = await groq.reviewDiff(diff, languages, userSettings);

    // 3. Count issues by severity
    const comments = aiResult.comments || [];
    const critical = comments.filter((c) => c.severity === 'critical').length;
    const warning = comments.filter((c) => c.severity === 'warning').length;
    const info = comments.filter((c) => c.severity === 'info').length;

    // 4. Update review record
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'reviewed',
        issuesCount: comments.length,
        criticalCount: critical,
        warningCount: warning,
        infoCount: info,
        aiSummary: aiResult.summary || '',
        comments: JSON.stringify(comments),
        detectedLanguages: JSON.stringify(languages),
      },
    });

    // 5. Post GitHub comment if enabled
    if (userSettings.autoPostComments !== false) {
      try {
        const ghComment = groq.buildGitHubComment(aiResult, review.prTitle);
        await gh.postPRReviewComment(accessToken, repo, prNumber, ghComment);
      } catch (commentError) {
        console.error('Failed to post GitHub comment:', commentError.message);
      }
    }

    // 6. Send Discord notification if webhook configured
    if (discordWebhook) {
      try {
        await discord.sendDiscordNotification(
          discordWebhook,
          {
            score: aiResult.score || 0,
            critical_count: critical,
            warning_count: warning,
            info_count: info,
            ai_summary: aiResult.summary || '',
          },
          review.prTitle,
          review.prUrl,
          repo
        );
      } catch (discordError) {
        console.error('Failed to send Discord notification:', discordError.message);
      }
    }
  } catch (error) {
    console.error(`Review error for ${reviewId}:`, error.message);

    // Update review status to error
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'error',
        aiSummary: `Review failed: ${error.message}`,
      },
    });
  }
};

// POST /reviews/trigger - Trigger an AI review
router.post('/trigger', requireAuth, async (req, res) => {
  try {
    const { repo, pr_number } = req.body;

    if (!repo || !pr_number) {
      return res.status(400).json({ detail: 'Missing repo or pr_number' });
    }

    // Fetch PR metadata from GitHub
    const pr = await gh.getPRDetails(req.user.accessToken, repo, pr_number);

    // Create pending review record
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        repoFullName: repo,
        prNumber: pr_number,
        prTitle: pr.title,
        prAuthor: pr.user.login,
        prUrl: pr.html_url,
        baseBranch: pr.base.ref,
        headBranch: pr.head.ref,
        linesAdded: pr.additions || 0,
        linesDeleted: pr.deletions || 0,
        status: 'pending',
      },
    });

    const userSettings = {
      autoPostComments: req.user.autoPostComments,
      checkSecurity: req.user.checkSecurity,
      checkPerformance: req.user.checkPerformance,
      checkCodeSmells: req.user.checkCodeSmells,
    };

    // Start background task (don't await)
    runReview(
      review.id,
      repo,
      pr_number,
      req.user.accessToken,
      userSettings,
      req.user.discordWebhookUrl
    ).catch((error) => {
      console.error('Background review task failed:', error.message);
    });

    // Return immediately
    res.status(202).json({
      review_id: review.id,
      status: 'pending',
    });
  } catch (error) {
    console.error('Trigger review error:', error.message);
    res.status(400).json({ detail: error.message });
  }
});

// GET /reviews/ - List user's reviews
router.get('/', requireAuth, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      repo: r.repoFullName,
      pr_number: r.prNumber,
      pr_title: r.prTitle,
      pr_author: r.prAuthor,
      pr_url: r.prUrl,
      status: r.status,
      issues_count: r.issuesCount,
      critical_count: r.criticalCount,
      warning_count: r.warningCount,
      info_count: r.infoCount,
      lines_added: r.linesAdded,
      lines_deleted: r.linesDeleted,
      detected_languages: r.detectedLanguages ? JSON.parse(r.detectedLanguages) : [],
      created_at: r.createdAt.toISOString(),
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('List reviews error:', error.message);
    res.status(500).json({ detail: error.message });
  }
});

// GET /reviews/:id - Get single review details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const reviewId = parseInt(id, 10);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ detail: 'Review not found' });
    }

    // Verify ownership
    if (review.userId !== req.user.id) {
      return res.status(403).json({ detail: 'Unauthorized' });
    }

    const responseData = {
      id: review.id,
      repo: review.repoFullName,
      pr_number: review.prNumber,
      pr_title: review.prTitle,
      pr_author: review.prAuthor,
      pr_url: review.prUrl,
      status: review.status,
      issues_count: review.issuesCount,
      critical_count: review.criticalCount,
      warning_count: review.warningCount,
      info_count: review.infoCount,
      ai_summary: review.aiSummary,
      comments: review.comments ? JSON.parse(review.comments) : [],
      detected_languages: review.detectedLanguages ? JSON.parse(review.detectedLanguages) : [],
      lines_added: review.linesAdded,
      lines_deleted: review.linesDeleted,
      base_branch: review.baseBranch,
      head_branch: review.headBranch,
      created_at: review.createdAt.toISOString(),
    };

    res.json(responseData);
  } catch (error) {
    console.error('Get review error:', error.message);
    res.status(500).json({ detail: error.message });
  }
});

export default router;
