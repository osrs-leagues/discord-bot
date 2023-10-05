import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import { CURRENT_LEAGUE, getLeagueName } from '../../../leagues';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';

const regionCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('regions')
    .setDescription(`Set your ${getLeagueName(CURRENT_LEAGUE)} region`),
  execute: async (interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('regions')
        .setPlaceholder('Select 3 regions')
        .setMinValues(3)
        .setMaxValues(3)
        .addOptions([
          {
            label: 'Asgarnia',
            description: 'The asgarnia region',
            value: 'asgarnia',
          },
          {
            label: 'Fremennik Isles',
            description: 'The Fremennik region',
            value: 'fremennik',
          },
          {
            label: 'Kandarin',
            description: 'The Kandarin region',
            value: 'kandarin',
          },
          {
            label: 'Kharidian Desert',
            description: 'The Desert region',
            value: 'desert',
          },
          {
            label: 'Kourend & Kebos',
            description: 'The Kourend & Kebos region',
            value: 'kourend',
          },
          {
            label: 'Morytania',
            description: 'The Morytania region',
            value: 'morytania',
          },
          {
            label: 'Tirannwn',
            description: 'The Tirannwn region',
            value: 'tirannwn',
          },
          {
            label: 'Wilderness',
            description: 'The Wilderness region',
            value: 'wilderness',
          },
        ]),
    );
    await interaction.reply({
      content:
        'Choose your region roles by selecting 3 regions in the dropdown below: ',
      components: [row],
    });
  },
};

export default regionCommand;
