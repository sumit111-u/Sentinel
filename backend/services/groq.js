import axios from 'axios';
import { config } from '../config.js';

const SYSTEM_PROMPT = `You are Sentinel, an expert AI pull request guardian for engineering teams.
Your job is to analyze pull request diffs and identify:
1. **Bugs** — Logic errors, null pointer risks, off-by-one errors, incorrect API usage
2. **Security Vulnerabilities** — SQL injection, XSS, hardcoded secrets, insecure deserialization, SSRF, path traversal, etc.
3. **Performance Bottlenecks** — N+1 queries, inefficient algorithms, memory leaks, blocking calls in async code
4. **Code Smells** — Long functions, duplicate code, dead code, poor naming, missing error handling
5. **Style Issues** — Naming convention violations, missing type hints/JSDoc, poor code organization

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence overall assessment of the PR",
  "score": <integer 0-100, 100=perfect>,
  "comments": [
    {
      "severity": "critical|warning|info",
      "category": "bug|security|performance|code_smell|style",
      "file": "path/to/file.ext or null if general",
      "line": <integer line number in diff or null>,
      "message": "Short title (max 80 chars)",
      "description": "Detailed explanation of the issue",
      "suggestion": "Concrete fix or improvement recommendation"
    }
  ]
}

Rules:
- Only report REAL issues — do not be pedantic or flag style in otherwise clean code
- Always prioritize security and bugs over style
- If the diff is clean, return an empty comments array with a positive summary
- Keep descriptions concise but actionable
- Maximum 20 comments per review`;

const truncateDiff = (diff, maxChars = 12000) => {
  if (diff.length <= maxChars) {
    return diff;
  }
  const half = Math.floor(maxChars / 2);
  return (
    diff.slice(0, half) +
    '\n\n... [diff truncated for length] ...\n\n' +
    diff.slice(-half)
  );
};

const buildUserPrompt = (diff, languages, userSettings) => {
  const langStr = languages.length > 0 ? languages.join(', ') : 'unknown';
  const checks = [];

  if (userSettings.checkSecurity !== false) {
    checks.push('security vulnerabilities');
  }
  if (userSettings.checkPerformance !== false) {
    checks.push('performance issues');
  }
  if (userSettings.checkCodeSmells !== false) {
    checks.push('code smells and style issues');
  }
  checks.push('bugs'); // always check for bugs

  return `Review this pull request diff. Detected languages: ${langStr}.
Focus on: ${checks.join(', ')}.

<diff>
${truncateDiff(diff)}
</diff>

Respond with ONLY the JSON object, no markdown fences or extra text.`;
};

export const reviewDiff = async (diff, languages, userSettings) => {
  try {
    const userPrompt = buildUserPrompt(diff, languages, userSettings);

    const response = await axios.post(
      `${config.groq.baseUrl}/chat/completions`,
      {
        model: config.groq.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      },
      {
        headers: {
          Authorization: `Bearer ${config.groq.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let raw = response.data.choices[0].message.content.trim();

    // Strip markdown code fences if model added them
    raw = raw.replace(/^```(?:json)?\s*/, '');
    raw = raw.replace(/\s*```$/, '');

    try {
      const result = JSON.parse(raw);
      return result;
    } catch (parseError) {
      console.error('Failed to parse AI response:', raw);
      return {
        summary: 'AI review completed but response could not be parsed.',
        score: 50,
        comments: [],
      };
    }
  } catch (error) {
    console.error('Groq API error:', error.message);
    throw new Error(`AI review failed: ${error.message}`);
  }
};

export const buildGitHubComment = (review, prTitle) => {
  const severityEmoji = {
    critical: '🔴',
    warning: '🟡',
    info: '🔵',
  };

  const categoryEmoji = {
    bug: '🐛',
    security: '🔒',
    performance: '⚡',
    code_smell: '🌿',
    style: '✨',
  };

  const score = review.score || 0;
  const scoreBar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
  const summary = review.summary || '';
  const comments = review.comments || [];

  const lines = [
    `## 🛡️ Sentinel AI Review — \`${prTitle}\``,
    '',
    `**Quality Score:** \`${score}/100\` \`[${scoreBar}]\``,
    '',
    `> ${summary}`,
    '',
  ];

  if (comments.length === 0) {
    lines.push('✅ **No significant issues found. Great work!**');
  } else {
    const criticals = comments.filter((c) => c.severity === 'critical');
    const warnings = comments.filter((c) => c.severity === 'warning');
    const infos = comments.filter((c) => c.severity === 'info');

    lines.push(
      `**Found:** 🔴 ${criticals.length} Critical · 🟡 ${warnings.length} Warnings · 🔵 ${infos.length} Info`
    );
    lines.push('');
    lines.push('---');
    lines.push('');

    for (const comment of comments) {
      const sev = comment.severity || 'info';
      const cat = comment.category || 'style';
      const file = comment.file;
      const line = comment.line;
      const msg = comment.message || '';
      const desc = comment.description || '';
      const suggestion = comment.suggestion || '';

      let loc = file ? `\`${file}\`` : '';
      if (line) {
        loc += ` line ${line}`;
      }

      lines.push(
        `### ${severityEmoji[sev] || '⚪'} ${categoryEmoji[cat] || '📌'} ${msg}`
      );
      if (loc) {
        lines.push(`**Location:** ${loc}`);
      }
      lines.push('');
      lines.push(desc);
      if (suggestion) {
        lines.push('');
        lines.push(`**💡 Suggestion:** ${suggestion}`);
      }
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  lines.push('');
  lines.push('*Powered by Sentinel · AI Pull Request Guardian*');

  return lines.join('\n');
};
