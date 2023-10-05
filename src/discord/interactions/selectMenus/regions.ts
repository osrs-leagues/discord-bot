import { SelectMenu } from './types';
import { channelGroups } from '../../Channel';

const regionsSelectMenu: SelectMenu = {
  identifier: 'regions',
  channels: channelGroups.BOT_COMMANDS,
  execute: async (interaction) => {
    await interaction.reply(`Answered: ${JSON.stringify(interaction.values)}`);
  },
};

export default regionsSelectMenu;
