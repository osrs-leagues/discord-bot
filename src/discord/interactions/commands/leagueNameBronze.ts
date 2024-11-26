import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser } from '../../../database/models';
import {
  getLeagueDiscordColumn,
  getLeagueName,
  League,
  Rank,
} from '../../../leagues';
import setLeagueRole from '../../actions/setLeagueRole';
import getRankedMessage from '../../messages/ranked';
import { Command } from './types';
import { channelGroups } from '../../Channel';

const leagueNameBronze = (league: League): Command => {
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
      try {
        let username = interaction.options.getString('username');
        if (interaction) {
          if (!username) {
            return interaction.reply('Please enter a valid username.');
          }
          username = username.toLocaleLowerCase();
          const discordMember = interaction.member;
          await DiscordUser.upsert({
            user_id: discordMember.user.id,
            [leagueNameIdentifier]: username,
          });
          const rankResult = await setLeagueRole({
            league,
            rank: Rank.BRONZE,
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
        }
      } catch (error) {
        console.error(`Error setting league role: ${error}`);
        interaction?.reply({
          content:
            'There was a problem setting your league role. Please try again.',
          ephemeral: true,
        });
      }
    },
  };
};

export default leagueNameBronze;
