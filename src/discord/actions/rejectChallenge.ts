import { ButtonInteraction, CommandInteraction } from 'discord.js';

import * as challenges from '../../challenges';
import { ChallengeCardStatus } from '../../database';

const rejectChallenge = async (
  interaction: CommandInteraction | ButtonInteraction,
  userId: string,
  reason?: string,
) => {
  const challengeCard = await challenges.loadChallengeCard(userId);
  if (challengeCard) {
    await challengeCard.update({
      status: ChallengeCardStatus.STARTED,
    });
    // Standard rejection reason
    const standardReason =
      'Your evidence did not meet the requirements for the challenges set in your Challenge Card.';

    // Send a DM to the user with the standard rejection reason
    try {
      const targetUser = await interaction.client.users.fetch(userId);
      targetUser.send(
        `Your challenge card has been rejected for the difficulty tier: ${challenges.getDifficultyName(
          challengeCard.difficulty,
        )}. Reason: ${reason ?? standardReason}`,
      );
    } catch (dmError) {
      interaction.reply({
        content: `<@${userId}> Your challenge card has been rejected for the difficulty tier: ${challenges.getDifficultyName(
          challengeCard.difficulty,
        )}. Reason: ${reason ?? standardReason}`,
        ephemeral: false,
      });
    }
    interaction.reply({
      content: 'Challenge rejected and user notified.',
      ephemeral: true,
    });
  } else {
    interaction.reply({
      content: 'User does not have a challenge card.',
      ephemeral: true,
    });
  }
};

export default rejectChallenge;
