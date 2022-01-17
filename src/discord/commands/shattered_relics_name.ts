import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser, ShatteredRelicsLeague } from '../../database/models';
import { getRank, League } from '../../leagues';
import setLeagueRole from '../actions/setLeagueRole';
import getRankedMessage from '../messages/ranked';
import getUnrankedMessage from '../messages/unranked';
import { fetchHiscoreUser } from '../../tasks';
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

const shatteredRelicsNameCommand: Command = {
  channels,
  data: new SlashCommandBuilder()
    .setName('shattered_relics_name')
    .setDescription(
      'Set your Shattered Relics League username and discord role.',
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('username')
        .setDescription('Enter your Shattered Relics League username.')
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
      shattered_relics_name: username,
    });
    const discordUser = result[0];
    if (discordUser) {
      const league: League = 'shattered_relics';
      const hiscoreResults = await fetchHiscoreUser.execute({ username });
      if (hiscoreResults) {
        const leagueUserResult = await ShatteredRelicsLeague.upsert({
          name: username,
          points: hiscoreResults.league_points,
        });
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

export default shatteredRelicsNameCommand;
