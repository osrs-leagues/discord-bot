import { ButtonInteraction, Message, GuildMember } from 'discord.js';
import * as challenges from '../../../challenges';
import * as raffles from '../../../raffles';
import { Button } from './types';
import { ChallengeCardStatus, ChallengeDifficulty } from '../../../database';

const challengeApprovalButton: Button = {
  buttons: ['approve', 'reject'],
  onButtonInteraction: async (interaction: ButtonInteraction) => {
    const { customId } = interaction;
    const [action, userId, difficultyTier] = customId.split(' ');

    const parsedDifficultyTier = parseInt(difficultyTier, 10);
    // Check if the interaction is from a guild and if the member is an admin
    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.permissions.has('ADMINISTRATOR')
    ) {
      return; // Do nothing if the user is not an admin
    }
    try {
      if (action === 'approve') {
        const challengeCard = await challenges.loadChallengeCard(userId);
        if (challengeCard) {
          await challengeCard.update({
            status: ChallengeCardStatus.COMPLETED,
          });
          raffles.saveRaffleTickets(
            userId,
            parsedDifficultyTier,
            challengeCard.id,
          );
          if (
            parsedDifficultyTier === ChallengeDifficulty.MASTER ||
            parsedDifficultyTier === ChallengeDifficulty.GRANDMASTER
          ) {
            await challenges.assignSageRole(
              interaction.guild,
              userId,
              parsedDifficultyTier,
            );
          }
          // Send a DM to the user
          try {
            const targetUser = await interaction.client.users.fetch(userId);
            await targetUser.send(
              `Your challenge card has been approved for the difficulty tier: ${challenges.getDifficultyName(
                parsedDifficultyTier,
              )}. Congratulations!\nYour raffle tickets have been added to the draw.\nPlease use the /challenge command in the #challenge-commands channel in the OSRS Leagues discord to generate your next Challenge Card.`,
            );
            await interaction.reply({
              content: 'Challenge approved and user notified.',
              ephemeral: true,
            });
          } catch (dmError) {
            await interaction.reply({
              content: `<@${userId}> Your challenge card has been approved for the difficulty tier: ${challenges.getDifficultyName(
                parsedDifficultyTier,
              )}. Congratulations!\nYour raffle tickets have been added to the draw.\nPlease use the /challenge command in the #challenge-commands channel to generate your next Challenge Card.`,
              ephemeral: false,
            });
          }
          // Remove the buttons from the original message
          if (interaction.message instanceof Message) {
            await interaction.message.edit({ components: [] });
          }
        }
      } else if (action === 'reject') {
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
            await targetUser.send(
              `Your challenge card has been rejected for the difficulty tier: ${challenges.getDifficultyName(
                parsedDifficultyTier,
              )}. Reason: ${standardReason}`,
            );
          } catch (dmError) {
            await interaction.reply({
              content: `<@${userId}> Your challenge card has been rejected for the difficulty tier: ${challenges.getDifficultyName(
                parsedDifficultyTier,
              )}. Reason: ${standardReason}`,
              ephemeral: false,
            });
          }
          // Remove the buttons from the original message
          if (interaction.message instanceof Message) {
            await interaction.message.edit({ components: [] });
          }
          await interaction.reply({
            content: 'Challenge rejected and user notified.',
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error('Error in Challenge Approval Button listener: ', error);
      await interaction.reply({
        content: 'An error occurred while processing your request.',
        ephemeral: true,
      });
    }
  },
};

export default challengeApprovalButton;
