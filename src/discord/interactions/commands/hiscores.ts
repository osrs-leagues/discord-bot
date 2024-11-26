import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';

import { fetchHiscoreUser } from '../../../tasks';
import getHiscoreRankingMessage from '../../messages/hiscoreRanking';
import { Command } from './types';
import { getLeagueName } from '../../../leagues';
import { channelGroups } from '../../Channel';

const hiscoresCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('hiscores')
    .setDescription(
      'Show the league points & rank of a user from the League hiscores.',
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('username')
        .setDescription(`Enter a ${getLeagueName()} League username.`)
        .setRequired(true),
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    await interaction.deferReply();
    try {
      const username = interaction.options.getString('username');
      if (!username) {
        return interaction.editReply('Please enter a valid username.');
      }
      const hiscoreResult = await fetchHiscoreUser.execute({
        username,
      });
      if (hiscoreResult) {
        const message = getHiscoreRankingMessage({
          username,
          points: hiscoreResult.league_points,
          rank: hiscoreResult.league_rank,
        });
        interaction.editReply({ embeds: [message] });
      } else {
        interaction.editReply(`Unable to find ${username} on hiscores.`);
      }
    } catch (error) {
      interaction?.editReply('Unable to find user on hiscores.');
    }
  },
};

export default hiscoresCommand;
