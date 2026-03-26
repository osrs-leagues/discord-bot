import { ButtonInteraction, CommandInteraction } from 'discord.js';

import * as challenges from '../../challenges';
import {
  ChallengeCardStatus,
  ChallengeDifficulty,
  RaffleTicket,
} from '../../database';

const approveChallenge = async (
  interaction: CommandInteraction | ButtonInteraction,
  userId: string,
  difficulty: ChallengeDifficulty,
) => {
  try {
    const challengeCard = await challenges.loadChallengeCardByStatus(
      userId,
      difficulty,
      ChallengeCardStatus.COMPLETED,
    );
    if (challengeCard) {
      await challengeCard.update({
        status: ChallengeCardStatus.APPROVAL,
      });
      // Remove all raffle tickets from the database
      await RaffleTicket.destroy({
        where: { discordUserId: userId, challengeCardId: challengeCard.id },
      });
      await interaction.editReply(
        'Successfully reversed approval for the challenge card. Please remove master or grandmaster roles accordingly.',
      );
      interaction.followUp({
        content: `<@${userId}> Your challenge card approval has been revoked for the difficulty tier: ${challenges.getDifficultyName(
          challengeCard.difficulty,
        )}.`,
      });
      return true;
    } else {
      interaction.editReply({
        content: `User does not have a challenge card that was previously approved with ${challenges.getDifficultyName(
          difficulty,
        )} difficulty.`,
      });
      return false;
    }
  } catch (error) {
    console.error(`Error reversing challenge approval: ${error}`);
    interaction.editReply(
      'An error occurred while reversing the challenge approval.',
    );
    return false;
  }
};

export default approveChallenge;
