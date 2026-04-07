import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { getTurtleRarityName } from '../../../database/models/Turtle';
import TurtleCollection from '../../../database/models/TurtleCollection';
import { getTurtleByUuid } from '../../../turtles';

const turtleStatsCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('turtle_stats')
    .setDescription('View stats for a turtle.')
    .addStringOption((option) =>
      option
        .setName('uuid')
        .setDescription('The UUID of the turtle')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const uuid = interaction.options.getString('uuid');

      const turtle = getTurtleByUuid(uuid);

      if (!turtle) {
        interaction.editReply(`No turtle found with UUID \`${uuid}\`.`);
        return;
      }

      const encounterCount = await TurtleCollection.count({
        where: { turtle_id: turtle.id },
      });

      const rarityName = getTurtleRarityName(turtle.rarity);
      const displayName = turtle.name ?? `Turtle #${turtle.id}`;

      const embed = new MessageEmbed()
        .setTitle(`🐢 ${displayName}`)
        .setDescription(
          [
            `**Rarity:** ${rarityName}`,
            `**Encounters:** ${encounterCount} player${
              encounterCount !== 1 ? 's' : ''
            }`,
            `**UUID:** \`${turtle.uuid}\``,
          ].join('\n'),
        )
        .setImage(turtle.image_url);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error fetching turtle stats: ${error}`);
      interaction.editReply('An error occurred while fetching turtle stats.');
    }
  },
};

export default turtleStatsCommand;
