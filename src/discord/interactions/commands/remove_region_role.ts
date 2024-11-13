import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import { setRegionComboRole } from '../../actions';

const removeRegionRoleCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('remove_region_role')
    .setDescription('Remove you region role.'),
  execute: async (interaction) => {
    await setRegionComboRole({
      guild: interaction.guild,
      member: interaction.member as GuildMember,
      values: undefined,
    });
    interaction.reply({
      content: 'Your region role has been removed.',
      ephemeral: true,
    });
  },
};

export default removeRegionRoleCommand;
