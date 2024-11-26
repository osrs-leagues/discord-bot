import { SlashCommandBuilder } from '@discordjs/builders';

import { CURRENT_LEAGUE, getLeagueName } from '../../../leagues';
import { Command } from './types';
import { channelGroups } from '../../Channel';
import getRegionRoleMessage from '../../messages/regionRole';
import { GuildMember } from 'discord.js';
import { capitalize } from '../../../utils/strings';
import { setRegionRoles } from '../../actions';
import { getRandomRegions } from '../../../challenges';

const randomRegionsCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('random_regions')
    .setDescription(
      `Randomly select your ${getLeagueName(
        CURRENT_LEAGUE,
      )} region roles. Note: this will override any existing region roles.`,
    ),
  execute: async (interaction) => {
    try {
      const randomRegions = getRandomRegions();
      const regionNames = randomRegions.map((region) =>
        capitalize(region.name),
      );
      setRegionRoles({
        guild: interaction.guild,
        member: interaction.member as GuildMember,
        regions: regionNames,
      });
      interaction.reply({
        embeds: [
          getRegionRoleMessage({
            member: interaction.member as GuildMember,
            role: regionNames.join(', '),
          }),
        ],
      });
    } catch (error) {
      console.error(`Error responding to random regions command: ${error}`);
      interaction?.reply({
        content:
          'There was a problem setting your region roles. Please try again.',
        ephemeral: true,
      });
    }
  },
};

export default randomRegionsCommand;
