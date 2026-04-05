import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Turtle, { TURTLE_RARITY_WEIGHTS } from '../../../database/models/Turtle';
import TurtleCollection from '../../../database/models/TurtleCollection';
import getTurtleMessage from '../../messages/turtle';

const selectWeightedTurtle = (turtles: Turtle[]): Turtle => {
  let totalWeight = 0;
  for (const turtle of turtles) {
    totalWeight += TURTLE_RARITY_WEIGHTS[turtle.rarity];
  }

  let roll = Math.random() * totalWeight;
  for (const turtle of turtles) {
    roll -= TURTLE_RARITY_WEIGHTS[turtle.rarity];
    if (roll <= 0) {
      return turtle;
    }
  }

  return turtles[turtles.length - 1];
};

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
      const turtles = await Turtle.findAll();

      if (turtles.length === 0) {
        interaction.editReply('No turtles available yet!');
        return;
      }

      const turtle = selectWeightedTurtle(turtles);
      const [, created] = await TurtleCollection.findOrCreate({
        where: { user_id: interaction.user.id, turtle_id: turtle.id },
      });
      const embed = getTurtleMessage({ turtle, isNewDiscovery: created });
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error rolling turtle: ${error}`);
      interaction.editReply('An error occurred while rolling a turtle.');
    }
  },
};

export { selectWeightedTurtle };
export default turtleCommand;
