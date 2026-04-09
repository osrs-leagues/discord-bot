import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import {
  turtleCache,
  selectWeightedTurtle,
  recordTurtleDiscovery,
} from '../../../turtles';
import getTurtleMessage from '../../messages/turtle';

const turtleCommand: Command = {
  cooldown: {
    duration: 10 * 60 * 1000,
    exemptChannels: channelGroups.TURTLES,
  },
  data: new SlashCommandBuilder()
    .setName('turtle')
    .setDescription('Roll a random turtle!'),
  execute: async (interaction) => {
    await interaction.deferReply();
    try {
      const turtles = turtleCache.turtles;

      if (turtles.length === 0) {
        interaction.editReply('No turtles available yet!');
        return;
      }

      const turtle = selectWeightedTurtle(turtles);
      const isNewDiscovery = await recordTurtleDiscovery(
        interaction.user.id,
        turtle.id,
      );
      const embed = getTurtleMessage({ turtle, isNewDiscovery });
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error rolling turtle: ${error}`);
      interaction.editReply('An error occurred while rolling a turtle.');
    }
  },
};

export default turtleCommand;
