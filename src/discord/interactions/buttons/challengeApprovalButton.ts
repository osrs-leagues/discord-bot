import { ButtonInteraction, Message, GuildMember } from 'discord.js';
import { Button } from './types';
import { approveChallenge } from '../../actions';
import rejectChallenge from '../../actions/rejectChallenge';

const challengeApprovalButton: Button = {
  buttons: ['approve', 'reject'],
  onButtonInteraction: async (interaction: ButtonInteraction) => {
    const { customId } = interaction;
    const [action, userId] = customId.split(' ');
    // Check if the interaction is from a guild and if the member is an admin
    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.permissions.has('ADMINISTRATOR')
    ) {
      return; // Do nothing if the user is not an admin
    }
    try {
      if (action === 'approve') {
        const approved = await approveChallenge(interaction, userId);
        if (approved && interaction.message instanceof Message) {
          interaction.message.edit({ components: [] });
        }
      } else if (action === 'reject') {
        rejectChallenge(interaction, userId);
      }
    } catch (error) {
      console.error('Error in Challenge Approval Button listener: ', error);
      interaction.reply({
        content: 'An error occurred while processing your request.',
        ephemeral: true,
      });
    }
  },
};

export default challengeApprovalButton;
