import { ButtonInteraction, CommandInteraction } from 'discord.js';

import * as challenges from '../../challenges';
import { ChallengeCardStatus, ChallengeDifficulty } from '../../database';

const rejectChallenge = async (
  interaction: CommandInteraction | ButtonInteraction,
  userId: string,
  difficulty: ChallengeDifficulty,
  reason?: string,
) => {
  const challengeCard = await challenges.loadChallengeCardByStatus(
    userId,
    difficulty,
    ChallengeCardStatus.APPROVAL,
  );
  if (challengeCard) {
    await challengeCard.update({
      status: ChallengeCardStatus.STARTED,
    });
    // Standard rejection reason
    const standardReason =
      'Your evidence did not meet the requirements for the challenges set in your Challenge Card.';
    await interaction.editReply('Successfully rejected the challenge card.');
    interaction.followUp({
      content: `<@${userId}> Your challenge card has been rejected for the difficulty tier: ${challenges.getDifficultyName(
        challengeCard.difficulty,
      )}. Reason: ${reason ?? standardReason}`,
      ephemeral: false,
    });
  } else {
    interaction.editReply({
      content: `User does not have a challenge card pending approval with ${challenges.getDifficultyName(
        difficulty,
      )} difficulty.`,
    });
  }
};

export default rejectChallenge;
