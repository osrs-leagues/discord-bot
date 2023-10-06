import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';

import { DiscordUser } from '../../../database/models';
import { Command } from './types';
import { channelGroups } from '../../Channel';
import { removeLeagueRoles } from '../../actions';

const removeLeagueRolesCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('remove_league_roles')
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
    await interaction.reply({
      content: 'All of your league rank roles have been removed.',
      ephemeral: true,
    });
  },
};

export default removeLeagueRolesCommand;
