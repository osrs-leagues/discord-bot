import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  ThreadChannel,
} from 'discord.js';

import { Button } from './types';
import blockDMUser from '../../actions/blockDMUser';
import { client } from '../../index';
import Role from '../../Role';

const blockUserButton: Button = {
  buttons: ['block_user', 'unblock_user'],
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  onButtonInteraction: async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const { customId } = interaction;
    const [action, userId] = customId.split(' ');

    try {
      const thread = interaction.channel as ThreadChannel;
      if (!thread?.isThread()) return;

      if (action === 'block_user') {
        const success = await blockDMUser({
          userId,
          isBlocked: true,
          blockedBy: interaction.user.id,
        });

        if (!success) {
          await interaction.followUp({
            content: 'Failed to block user. Ticket not found.',
            ephemeral: true,
          });
          return;
        }

        // Try to DM the user about the block
        try {
          const user = await client.users.fetch(userId);
          await user.send(
            'You have been blocked from sending further messages to this server.',
          );
        } catch {
          // User may have DMs disabled
        }

        // Update the pinned message buttons before archiving
        if (interaction.message instanceof Message) {
          const updatedRow = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId(`close_ticket ${userId}`)
              .setLabel('Close Ticket')
              .setStyle('SECONDARY')
              .setDisabled(true),
            new MessageButton()
              .setCustomId(`unblock_user ${userId}`)
              .setLabel('Unblock User')
              .setStyle('SUCCESS'),
          );
          await interaction.message.edit({ components: [updatedRow] });
        }

        // Archive the thread after editing
        await thread.setArchived(true);
      } else if (action === 'unblock_user') {
        const success = await blockDMUser({
          userId,
          isBlocked: false,
        });

        if (!success) {
          await interaction.followUp({
            content: 'Failed to unblock user. Ticket not found.',
            ephemeral: true,
          });
          return;
        }

        // Unarchive the thread
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
      console.error('Error handling block/unblock user button:', error);
    }
  },
};

export default blockUserButton;
