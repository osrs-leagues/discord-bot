import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';

const pingRoles = [
  /**
   * OSRS Leagues server
   */
  '636007821661569064', // Administrator
  '636002727163592751', // Moderator

  /**
   * Bot testing server
   */
  '931999272738619473', // Tester
];

const pingChannels = [
  /**
   * OSRS Leagues server
   */
  '636193036195463178', // #bot-commands-test

  /**
   * Bot testing server
   */
  '931963036896464946', // #bot-commands
];

const pingCommand: Command = {
  channels: pingChannels,
  roles: pingRoles,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction) => {
    await interaction.reply('Pong!');
  },
};

export default pingCommand;
