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
    .setDescription('Remove all of your league rank roles.'),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const discordMember = interaction.member;
      const result = await DiscordUser.findByPk(discordMember.user.id);
      if (result) {
        result.update({
          twisted_name: null,
          trailblazer_name: null,
          shattered_relics_name: null,
          trailblazer_reloaded_name: null,
          raging_echoes_name: null,
          demonic_pacts_name: null,
        });
      }
      removeLeagueRoles({
        member: discordMember as GuildMember,
      });
      interaction.editReply('Your league rank roles have been removed.');
    } catch (error) {
      console.error(
        `Error responding to remove league roles command: ${error}`,
      );
      interaction?.editReply(
        'There was a problem removing your league rank roles. Please try again.',
      );
    }
  },
};

export default removeLeagueRolesCommand;
