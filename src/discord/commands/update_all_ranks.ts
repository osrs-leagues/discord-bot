import { SlashCommandBuilder } from '@discordjs/builders';

import { updateDiscordRoles, updateLeagueUsers } from '../../tasks';
import { Command } from './types';

const roles = [
  /**
   * OSRS Leagues server
   */
  '636007821661569064', // Administrator

  /**
   * Bot testing server
   */
  '931999272738619473', // Tester
];

const channels = [
  /**
   * OSRS Leagues server
   */
  '636193036195463178', // #bot-commands-test
  '763899863280648252', // #staff-casual
  '931930206225178724', // #staff-admin

  /**
   * Bot testing server
   */
  '931963036896464946', // #bot-commands
];

const updateAllRanksCommand: Command = {
  channels,
  roles,
  data: new SlashCommandBuilder()
    .setName('update_all_ranks')
    .setDescription('Update all user roles for Shattered Relics rankings.'),
  execute: async (interaction) => {
    await interaction.reply('Attempting to update all user roles!');
    await updateLeagueUsers.execute();
    const amountUpdated = await updateDiscordRoles.execute();
    await interaction.editReply(`Updated ${amountUpdated} discord user roles!`);
  },
};

export default updateAllRanksCommand;
