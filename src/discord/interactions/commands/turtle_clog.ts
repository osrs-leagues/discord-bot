import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { turtleCache, getCollectedTurtleIds } from '../../../turtles';
import getTurtleLogMessage from '../../messages/turtleLog';

const turtleClogCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('turtle_clog')
    .setDescription('View your turtle collection log.'),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const turtles = turtleCache.turtles;

      if (turtles.length === 0) {
        interaction.editReply('No turtles available yet!');
        return;
      }

      const collected = await getCollectedTurtleIds(interaction.user.id);

      const embed = getTurtleLogMessage({ turtles, collected });
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error fetching turtle log: ${error}`);
      interaction.editReply(
        'An error occurred while fetching your turtle log.',
      );
    }
  },
};

export default turtleClogCommand;
