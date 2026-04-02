import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  ThreadChannel,
} from 'discord.js';

import { Button } from './types';

const closeTicketButton: Button = {
  buttons: ['close_ticket', 'reopen_ticket'],
  onButtonInteraction: async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const { customId } = interaction;
    const [action, userId] = customId.split(' ');

    try {
      const thread = interaction.channel as ThreadChannel;
      if (!thread?.isThread()) return;

      const hasAdminPermission = interaction.memberPermissions?.has('ADMINISTRATOR');
      const hasModeratorPermission = interaction.memberPermissions?.has('MANAGE_THREADS');

      if (!hasAdminPermission && !hasModeratorPermission) {
        await interaction.followUp({
          content: 'You do not have permission to perform this action.',
          ephemeral: true,
        });
        return;
      }

      if (action === 'close_ticket') {
        // Update the pinned message buttons before archiving
        if (interaction.message instanceof Message) {
          const updatedRow = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId(`reopen_ticket ${userId}`)
              .setLabel('Reopen Ticket')
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId(`block_user ${userId}`)
              .setLabel('Block User')
              .setStyle('DANGER'),
          );
          await interaction.message.edit({ components: [updatedRow] });
        }

        // Archive the thread after editing
        await thread.setArchived(true);
      } else if (action === 'reopen_ticket') {
        // Unarchive the thread before editing
        await thread.setArchived(false);

        // Update the pinned message buttons
        if (interaction.message instanceof Message) {
          const updatedRow = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId(`close_ticket ${userId}`)
              .setLabel('Close Ticket')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId(`block_user ${userId}`)
              .setLabel('Block User')
              .setStyle('DANGER'),
          );
          await interaction.message.edit({ components: [updatedRow] });
        }
      }
    } catch (error) {
      console.error('Error handling close/reopen ticket button:', error);
    }
  },
};

export default closeTicketButton;
