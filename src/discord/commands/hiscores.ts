import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';

import { fetchHiscoreUser } from '../../tasks';
import getHiscoreRankingMessage from '../messages/hiscoreRanking';
import { Command } from './types';

const channels = [
  /**
   * OSRS Leagues server
   */
  '769283619595485224', // #bot-commands
  '636193036195463178', // #bot-commands-test

  /**
   * Bot Testing Server
   */
  '931963036896464946', // #bot-commands
];

const hiscoresCommand: Command = {
  channels,
  data: new SlashCommandBuilder()
    .setName('hiscores')
    .setDescription(
      'Show the league points & rank of a user from the League hiscores.',
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('username')
        .setDescription('Enter a Shattered Relics League username.')
        .setRequired(true),
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    const username = interaction.options.getString('username');
    if (!username) {
      return interaction.reply('Please enter a valid username.');
    }
    try {
      const hiscoreResult = await fetchHiscoreUser.execute({
        username,
      });
      if (hiscoreResult) {
        const message = getHiscoreRankingMessage({
          username,
          points: hiscoreResult.league_points,
          rank: hiscoreResult.league_rank,
        });
        return interaction.reply({ embeds: [message] });
      } else {
        return interaction.reply('Unable to find user on hiscores.');
      }
    } catch (error) {
      return interaction.reply('Unable to find user on hiscores.');
    }
  },
};

export default hiscoresCommand;
