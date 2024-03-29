import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser } from '../../../database/models';
import {
  getLeagueAttributes,
  getLeagueDiscordColumn,
  getLeagueName,
  getRank,
  League,
} from '../../../leagues';
import setLeagueRole from '../../actions/setLeagueRole';
import getRankedMessage from '../../messages/ranked';
import getUnrankedMessage from '../../messages/unranked';
import { Command } from './types';
import { channelGroups } from '../../Channel';

const leagueNameLocal = (league: League): Command => {
  const leagueName = getLeagueName(league);
  const leagueNameIdentifier = getLeagueDiscordColumn(league);
  return {
    channels: channelGroups.BOT_COMMANDS,
    data: new SlashCommandBuilder()
      .setName(leagueNameIdentifier)
      .setDescription(
        `Set your ${leagueName} League username and discord role.`,
      )
      .addStringOption((option: SlashCommandStringOption) =>
        option
          .setName('username')
          .setDescription(`Enter your ${leagueName} League username.`)
          .setRequired(true),
      ) as SlashCommandBuilder,
    execute: async (interaction) => {
      let username = interaction.options.getString('username');
      if (!username) {
        return interaction.reply('Please enter a valid username.');
      }
      username = username.toLocaleLowerCase();
      const discordMember = interaction.member;
      const result = await DiscordUser.upsert({
        user_id: discordMember.user.id,
        [leagueNameIdentifier]: username,
      });
      const discordUser = result[0];
      if (discordUser) {
        const leagueUser = await getLeagueAttributes(league, username);
        if (leagueUser) {
          const rank = getRank(leagueUser.points, league);
          const rankResult = await setLeagueRole({
            league,
            rank: rank,
            member: interaction.member as GuildMember,
            guild: interaction.guild,
          });
          if (rankResult) {
            const message = getRankedMessage({
              guild: interaction.guild,
              league,
              rank: rankResult,
              username,
            });
            return interaction.reply({ embeds: [message] });
          }
        } else {
          const message = getUnrankedMessage({
            league,
            username,
          });
          return interaction.reply({ embeds: [message] });
        }
      } else {
        return interaction.reply({
          content: 'There was an error setting your username, try again.',
          ephemeral: true,
        });
      }
    },
  };
};

export default leagueNameLocal;
