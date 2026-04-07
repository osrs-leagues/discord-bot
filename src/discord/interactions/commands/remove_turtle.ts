import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { removeTurtle } from '../../../turtles';

const removeTurtleCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('remove_turtle')
    .setDescription('Remove a turtle by UUID.')
    .addStringOption((option) =>
      option
        .setName('uuid')
        .setDescription('The UUID of the turtle to remove')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const uuid = interaction.options.getString('uuid');

      const turtle = await removeTurtle(uuid);

      if (!turtle) {
        interaction.editReply(`No turtle found with UUID \`${uuid}\`.`);
        return;
      }

      interaction.editReply(
        `Turtle \`${uuid}\`${
          turtle.name ? ` ("${turtle.name}")` : ''
        } has been removed.`,
      );
    } catch (error) {
      console.error(`Error removing turtle: ${error}`);
      interaction.editReply('An error occurred while removing the turtle.');
    }
  },
};

export default removeTurtleCommand;
