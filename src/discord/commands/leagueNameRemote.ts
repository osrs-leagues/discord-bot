import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser } from '../../database/models';
import {
  CURRENT_LEAGUE,
  getLeagueDiscordColumn,
  getLeagueName,
  getRank,
  insertLeagueName,
  League,
} from '../../leagues';
import setLeagueRole from '../actions/setLeagueRole';
import getRankedMessage from '../messages/ranked';
import getUnrankedMessage from '../messages/unranked';
import { fetchHiscoreUser } from '../../tasks';
import { Command } from './types';
import { channelGroups } from '../Channel';
import Role from '../Role';

const leagueNameRemote = (league: League): Command => {
  const leagueName = getLeagueName(league);
  const leagueNameIdentifier = getLeagueDiscordColumn(league);
  return {
    channels: channelGroups.BOT_COMMANDS,
    roles: [Role.Administrator, Role.Moderator, Role.Tester],
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
        trailblazer_reloaded_name: username,
      });
      const discordUser = result[0];
      if (discordUser) {
        const league: League = CURRENT_LEAGUE;
        const hiscoreResults = await fetchHiscoreUser.execute({ username });
        if (hiscoreResults) {
          const leagueUserResult = await insertLeagueName(
            league,
            username,
            hiscoreResults.league_points,
          );
          const leagueUser = leagueUserResult[0];
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

export default leagueNameRemote;
