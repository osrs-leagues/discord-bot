import { ButtonInteraction, CommandInteraction } from 'discord.js';

import * as challenges from '../../challenges';
import * as raffles from '../../raffles';
import { ChallengeCardStatus, ChallengeDifficulty } from '../../database';
import { setSageRole } from './setSageRole';

const approveChallenge = async (
  interaction: CommandInteraction | ButtonInteraction,
  userId: string,
  difficulty: ChallengeDifficulty,
) => {
  const challengeCard = await challenges.loadChallengeCardByStatus(
    userId,
    difficulty,
    ChallengeCardStatus.APPROVAL,
  );
  if (challengeCard) {
    await challengeCard.update({
      status: ChallengeCardStatus.COMPLETED,
    });
    raffles.saveRaffleTickets(
      userId,
      challengeCard.difficulty,
      challengeCard.id,
    );
    if (
      challengeCard.difficulty === ChallengeDifficulty.MASTER ||
      challengeCard.difficulty === ChallengeDifficulty.GRANDMASTER
    ) {
      await setSageRole(interaction.guild, userId, challengeCard.difficulty);
      if (challengeCard.difficulty === ChallengeDifficulty.MASTER) {
        interaction.reply({
          content: `<@${userId}> Your challenge card has been approved for the difficulty tier: ${challenges.getDifficultyName(
            challengeCard.difficulty,
          )}. Congratulations! You have become a Sage's Master!\nYour raffle tickets have been added to the draw.\nPlease use the /challenge command in the #challenge-commands channel to generate your next Challenge Card.`,
          ephemeral: false,
        });
      } else if (challengeCard.difficulty === ChallengeDifficulty.GRANDMASTER) {
        interaction.reply({
          content: `<@${userId}> Your challenge card has been approved for the difficulty tier: ${challenges.getDifficultyName(
            challengeCard.difficulty,
          )}. Congratulations! You have become a Sage's Grandmaster and have completed the Sage's Challenge!\nYour raffle tickets have been added to the draw.\nThere is nothing left for you to do`,
          ephemeral: false,
        });
      }
    } else {
      interaction.reply({
        content: `<@${userId}> Your challenge card has been approved for the difficulty tier: ${challenges.getDifficultyName(
          challengeCard.difficulty,
        )}. Congratulations!\nYour raffle tickets have been added to the draw.\nPlease use the /challenge command in the #challenge-commands channel to generate your next Challenge Card.`,
        ephemeral: false,
      });
    }
    return true;
  } else {
    interaction.reply({
      content: `User does not have a challenge card pending approval with ${challenges.getDifficultyName(
        difficulty,
      )} difficulty.`,
      ephemeral: true,
    });
    return false;
  }
};

export default approveChallenge;
