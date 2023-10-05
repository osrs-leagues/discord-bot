import { SlashCommandBuilder } from '@discordjs/builders';

import { fetchLeaguePointRankings } from '../../../tasks';
import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';

const fetchLeagueRanksCommand: Command = {
  channels: channelGroups.TESTING,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('fetch_league_ranks')
    .setDescription('Refetch the current league point ranking.'),
  execute: async (interaction) => {
    fetchLeaguePointRankings.execute();
    await interaction.reply('League points ranking fetch began!');
  },
};

export default fetchLeagueRanksCommand;
