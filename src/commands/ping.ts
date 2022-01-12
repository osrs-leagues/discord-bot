import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction) => {
    await interaction.reply('Pong!');
  },
};

export { pingCommand };
