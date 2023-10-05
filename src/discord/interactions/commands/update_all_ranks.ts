import { SlashCommandBuilder } from '@discordjs/builders';

import { updateDiscordRoles, updateLeagueUsers } from '../../../tasks';
import { Command } from './types';
import { getLeagueName } from '../../../leagues';
import { channelGroups } from '../../Channel';
import Role from '../../Role';

const updateAllRanksCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('update_all_ranks')
    .setDescription(`Update all user roles for ${getLeagueName()} rankings.`),
  execute: async (interaction) => {
    await interaction.reply('Attempting to update all user roles!');
    await updateLeagueUsers.execute();
    const amountUpdated = await updateDiscordRoles.execute();
    await interaction.editReply(`Updated ${amountUpdated} discord user roles!`);
  },
};

export default updateAllRanksCommand;
