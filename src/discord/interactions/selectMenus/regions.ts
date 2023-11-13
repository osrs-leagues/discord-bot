import { GuildMember } from 'discord.js';

import { SelectMenu } from './types';
import { channelGroups } from '../../Channel';
import { setRegionRole } from '../../actions';
import getRegionRoleMessage from '../../messages/regionRole';

const regionsSelectMenu: SelectMenu = {
  identifier: 'regions',
  channels: channelGroups.BOT_COMMANDS,
  execute: async (interaction) => {
    const role = await setRegionRole({
      guild: interaction.guild,
      member: interaction.member as GuildMember,
      values: interaction.values,
    });
    if (interaction) {
      if (role) {
        return interaction.reply({
          embeds: [
            getRegionRoleMessage({
              member: interaction.member as GuildMember,
              role,
            }),
          ],
        });
      } else {
        return interaction.reply({
          content:
            'There was a problem setting your region role. Please try again.',
          ephemeral: true,
        });
      }
    }
  },
};

export default regionsSelectMenu;
