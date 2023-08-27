import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../Channel';
import Role from '../Role';

const pingCommand: Command = {
  channels: channelGroups.TESTING,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction) => {
    await interaction.reply('Pong!');
  },
};

export default pingCommand;
