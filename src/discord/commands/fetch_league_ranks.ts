import { SlashCommandBuilder } from '@discordjs/builders';

import { fetchLeaguePointRankings } from '../../tasks';
import { Command } from './types';

const roles = [
  /**
   * OSRS Leagues server
   */
  '636007821661569064', // Administrator
  '636002727163592751', // Moderator

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

  /**
   * Bot testing server
   */
  '931963036896464946', // #bot-commands
];

const fetchLeagueRanksCommand: Command = {
  channels,
  roles,
  data: new SlashCommandBuilder()
    .setName('fetch_league_ranks')
    .setDescription('Refetch the current league point ranking.'),
  execute: async (interaction) => {
    fetchLeaguePointRankings.execute();
    await interaction.reply('League points ranking fetch began!');
  },
};

export default fetchLeagueRanksCommand;
