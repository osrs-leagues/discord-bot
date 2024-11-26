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
    try {
      const message = getPointRankingsMessage({ league: CURRENT_LEAGUE });
      interaction.reply({ embeds: [message] });
    } catch (error) {
      console.error(`Error responding to league ranks command: ${error}`);
      interaction?.reply({
        content:
          'There was a problem displaying the league ranks. Please try again.',
        ephemeral: true,
      });
    }
  },
};

export default leagueRanksCommand;
