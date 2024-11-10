import { ButtonInteraction, CommandInteraction } from 'discord.js';

import * as challenges from '../../challenges';
import * as raffles from '../../raffles';
import { ChallengeCardStatus, ChallengeDifficulty } from '../../database';
import { setSageRole } from './setSageRole';

const approveChallenge = async (
  interaction: CommandInteraction | ButtonInteraction,
  userId: string,
) => {
  const challengeCard = await challenges.loadChallengeCardByStatus(
    userId,
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
    }
    // Send a DM to the user
    try {
      const targetUser = await interaction.client.users.fetch(userId);
      targetUser.send(
        `Your challenge card has been approved for the difficulty tier: ${challenges.getDifficultyName(
          challengeCard.difficulty,
        )}. Congratulations!\nYour raffle tickets have been added to the draw.\nPlease use the /challenge command in the #challenge-commands channel in the OSRS Leagues discord to generate your next Challenge Card.`,
      );
      interaction.reply({
        content: 'Challenge approved and user notified.',
        ephemeral: true,
      });
    } catch (dmError) {
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
      content: 'User does not have a challenge card.',
      ephemeral: true,
    });
    return false;
  }
};

export default approveChallenge;
