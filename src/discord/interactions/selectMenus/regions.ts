import { GuildMember } from 'discord.js';

import { SelectMenu } from './types';
import { channelGroups } from '../../Channel';
import { setRegionRoles } from '../../actions';
import getRegionRoleMessage from '../../messages/regionRole';
import { capitalize } from '../../../utils/strings';

const regionsSelectMenu: SelectMenu = {
  identifier: 'regions',
  channels: channelGroups.BOT_COMMANDS,
  execute: async (interaction) => {
    try {
      if (interaction) {
        setRegionRoles({
          guild: interaction.guild,
          member: interaction.member as GuildMember,
          regions: interaction.values,
        });
        interaction.reply({
          embeds: [
            getRegionRoleMessage({
              member: interaction.member as GuildMember,
              role: interaction.values
                .map((value) => capitalize(value))
                .join(', '),
            }),
          ],
        });
      }
    } catch (error) {
      console.error(`Error responding to region select menu: ${error}`);
      interaction?.reply({
        content:
          'There was a problem setting your region roles. Please try again.',
        ephemeral: true,
      });
    }
  },
};

export default regionsSelectMenu;
