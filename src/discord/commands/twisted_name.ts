import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser, TwistedLeague } from '../../database/models';
import { getRank, League } from '../../leagues';
import setLeagueRole from '../actions/setLeagueRole';
import getRankedMessage from '../messages/ranked';
import getUnrankedMessage from '../messages/unranked';
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

const twistedNameCommand: Command = {
  channels,
  data: new SlashCommandBuilder()
    .setName('twisted_name')
    .setDescription('Set your Twisted League username and discord role.')
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('username')
        .setDescription('Enter your Twisted League username.')
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
      twisted_name: username,
    });
    const discordUser = result[0];
    if (discordUser) {
      const league: League = 'twisted';
      const twistedLeagueUser = await TwistedLeague.findOne({
        where: { name: username },
      });
      if (twistedLeagueUser) {
        const rank = getRank(twistedLeagueUser.points, league);
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

export default twistedNameCommand;
