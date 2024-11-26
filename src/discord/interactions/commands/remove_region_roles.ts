import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import { setRegionRoles } from '../../actions';

const removeRegionRolesCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('remove_region_roles')
    .setDescription('Remove you region role(s).'),
  execute: async (interaction) => {
    try {
      await setRegionRoles({
        guild: interaction.guild,
        member: interaction.member as GuildMember,
        regions: [],
      });
      interaction.reply({
        content: 'Your region role(s) have been removed.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error responding to remove region role command: ${error}`);
      interaction?.reply({
        content:
          'There was a problem removing your region role(s). Please try again.',
        ephemeral: true,
      });
    }
  },
};

export default removeRegionRolesCommand;
