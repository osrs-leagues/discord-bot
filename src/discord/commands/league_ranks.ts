import { SlashCommandBuilder } from '@discordjs/builders';

import { CURRENT_LEAGUE } from '../../leagues';
import getPointRankingsMessage from '../messages/pointRankings';
import { Command } from './types';

const channels = [
  /**
   * OSRS Leagues server
   */
  '769283619595485224', // #bot-commands
  '636193036195463178', // #bot-commands-test

  /**
   * Bot testing server
   */
  '931963036896464946', // #bot-commands
];

const leagueRanksCommand: Command = {
  channels,
  data: new SlashCommandBuilder()
    .setName('league_ranks')
    .setDescription('Display the current League point ranking!'),
  execute: async (interaction) => {
    const message = getPointRankingsMessage({ league: CURRENT_LEAGUE });
    await interaction.reply({ embeds: [message] });
  },
};

export default leagueRanksCommand;
