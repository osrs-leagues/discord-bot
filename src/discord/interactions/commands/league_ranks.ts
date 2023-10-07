import { SlashCommandBuilder } from '@discordjs/builders';

import { CURRENT_LEAGUE } from '../../../leagues';
import getPointRankingsMessage from '../../messages/pointRankings';
import { Command } from './types';
import { channelGroups } from '../../Channel';

const leagueRanksCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('league_ranks')
    .setDescription('Display the current League point ranking!'),
  execute: async (interaction) => {
    const message = getPointRankingsMessage({ league: CURRENT_LEAGUE });
    await interaction.reply({ embeds: [message] });
  },
};

export default leagueRanksCommand;
