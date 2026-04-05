import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Turtle from '../../../database/models/Turtle';
import TurtleCollection from '../../../database/models/TurtleCollection';
import getTurtleLogMessage from '../../messages/turtleLog';

const turtleClogCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('turtle_clog')
    .setDescription('View your turtle collection log.'),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const turtles = await Turtle.findAll();

      if (turtles.length === 0) {
        interaction.editReply('No turtles available yet!');
        return;
      }

      const userCollection = await TurtleCollection.findAll({
        where: { user_id: interaction.user.id },
      });

      const collected = new Set(
        userCollection.map((entry) => Number(entry.turtle_id)),
      );

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
