import axios from 'axios';

export const sendDiscordNotification = async (
  webhookUrl,
  reviewData,
  prTitle,
  prUrl,
  repo
) => {
  try {
    const score = reviewData.score || 0;
    const critical = reviewData.critical_count || 0;
    const warning = reviewData.warning_count || 0;
    const info = reviewData.info_count || 0;
    const summary = reviewData.ai_summary || '';

    let color;
    let statusEmoji;
    let status;

    if (critical > 0) {
      color = 0xff4444; // Red
      statusEmoji = '🔴';
      status = 'Needs Attention';
    } else if (warning > 0) {
      color = 0xffaa00; // Amber
      statusEmoji = '🟡';
      status = 'Warnings Found';
    } else {
      color = 0x22cc88; // Green
      statusEmoji = '✅';
      status = 'Looks Good';
    }

    const scoreBar =
      '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));

    const embed = {
      title: `🛡️ Sentinel Review — ${prTitle}`,
      url: prUrl,
      description:
        summary.slice(0, 300) || 'AI review complete.',
      color,
      fields: [
        {
          name: 'Repository',
          value: `\`${repo}\``,
          inline: true,
        },
        {
          name: 'Status',
          value: `${statusEmoji} ${status}`,
          inline: true,
        },
        {
          name: 'Quality Score',
          value: `\`${score}/100\` \`[${scoreBar}]\``,
          inline: false,
        },
        {
          name: 'Issues Found',
          value: `🔴 ${critical} Critical · 🟡 ${warning} Warnings · 🔵 ${info} Info`,
          inline: false,
        },
      ],
      footer: {
        text: 'Sentinel · AI PR Guardian',
      },
    };

    const payload = { embeds: [embed] };

    const response = await axios.post(webhookUrl, payload, {
      timeout: 10000,
    });

    return [200, 204].includes(response.status);
  } catch (error) {
    console.error('Discord notification failed:', error.message);
    return false;
  }
};
