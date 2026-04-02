import {
  SlashCommandBuilder,
  SlashCommandUserOption,
} from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import blockDMUser from '../../actions/blockDMUser';

const unblockDmCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Moderator],
  data: new SlashCommandBuilder()
    .setName('unblock_dm')
    .setDescription('Unblock a user from sending DMs to the bot.')
    .addUserOption((option: SlashCommandUserOption) =>
      option
        .setName('user')
        .setDescription('The user to unblock.')
        .setRequired(true),
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const user = interaction.options.getUser('user');
      if (!user) {
        return interaction.editReply('Please provide a valid user.');
      }

      const success = await blockDMUser({
        userId: user.id,
        isBlocked: false,
      });

      if (success) {
        interaction.editReply(
          `Successfully unblocked <@${user.id}> from DM appeals.`,
        );
      } else {
        interaction.editReply(
          `No DM ticket found for <@${user.id}>. The user may not have opened an appeal.`,
        );
      }
    } catch (error) {
      console.error('Error executing unblock_dm command:', error);
      interaction?.editReply('There was an error while unblocking the user.');
    }
  },
};

export default unblockDmCommand;
