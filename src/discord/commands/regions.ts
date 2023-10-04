import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../Channel';
import { CURRENT_LEAGUE, getLeagueName } from '../../leagues';
import { MessageActionRow, MessageButton } from 'discord.js';

const regionCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('regions')
    .setDescription(`Set your ${getLeagueName(CURRENT_LEAGUE)}`)
    .addStringOption((option) =>
      option
        .setName('region1')
        .setDescription('First Region')
        .setRequired(true)
        .addChoices([
          ['Test', 'test'],
          ['Test1', 'test1'],
        ]),
    )
    .addStringOption((option) =>
      option
        .setName('region2')
        .setDescription('Second Region')
        .setRequired(true)
        .addChoices([
          ['Test', 'test'],
          ['Test1', 'test1'],
        ]),
    )
    .addStringOption((option) =>
      option
        .setName('region3')
        .setDescription('Third Region')
        .setRequired(true)
        .addChoices([
          ['Test', 'test'],
          ['Test1', 'test1'],
        ]),
    ),
  execute: async (interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('asgarnia')
        .setLabel('Asgarnia')
        .setStyle('PRIMARY'),
    );
    await interaction.reply({
      content: 'Choose your region roles by clicking the buttons below: ',
      components: [row],
    });
  },
};

export default regionCommand;
