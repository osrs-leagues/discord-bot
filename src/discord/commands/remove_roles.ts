import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser } from '../../database/models';
import removeLeagueRoles from '../actions/removeLeagueRoles';
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

const removeRolesCommand: Command = {
  channels,
  data: new SlashCommandBuilder()
    .setName('remove_roles')
    .setDescription('Remove all of your league rank roles'),
  execute: async (interaction) => {
    const discordMember = interaction.member;
    const result = await DiscordUser.findByPk(discordMember.user.id);
    if (result) {
      await result.update({
        twisted_name: null,
        trailblazer_name: null,
        shattered_relics_name: null,
        trailblazer_reloaded_name: null,
      });
    }
    await removeLeagueRoles({
      member: discordMember as GuildMember,
    });
    await interaction.reply('All of your league rank roles have been removed.');
  },
};

export default removeRolesCommand;
