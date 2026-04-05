import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import Turtle, {
  TurtleRarity,
  getTurtleRarityName,
} from '../../../database/models/Turtle';

const editTurtleCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('edit_turtle')
    .setDescription('Edit an existing turtle.')
    .addStringOption((option) =>
      option
        .setName('uuid')
        .setDescription('The UUID of the turtle to edit')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('image_url')
        .setDescription('New externally hosted image URL'),
    )
    .addStringOption((option) =>
      option
        .setName('rarity')
        .setDescription('New rarity')
        .addChoices(
          Object.values(TurtleRarity).map((rarity) => [
            getTurtleRarityName(rarity),
            rarity,
          ]),
        ),
    )
    .addStringOption((option) =>
      option.setName('name').setDescription('New display name for the turtle'),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const uuid = interaction.options.getString('uuid');
      const imageUrl = interaction.options.getString('image_url');
      const rarity = interaction.options.getString('rarity') as TurtleRarity;
      const name = interaction.options.getString('name');

      if (!imageUrl && !rarity && !name) {
        interaction.editReply('You must provide at least one field to update.');
        return;
      }

      const turtle = await Turtle.findOne({ where: { uuid } });

      if (!turtle) {
        interaction.editReply(`No turtle found with UUID \`${uuid}\`.`);
        return;
      }

      if (imageUrl) {
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(imageUrl);
        } catch {
          interaction.editReply('Invalid image URL provided.');
          return;
        }
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          interaction.editReply(
            'Invalid image URL provided. Only http:// and https:// URLs are allowed.',
          );
          return;
        }
        turtle.image_url = imageUrl;
      }
      if (rarity) {
        turtle.rarity = rarity;
      }
      if (name) {
        turtle.name = name;
      }

      await turtle.save();

      const updates: string[] = [];
      if (imageUrl) updates.push('image_url');
      if (rarity) updates.push(`rarity → ${getTurtleRarityName(rarity)}`);
      if (name) updates.push(`name → "${name}"`);

      interaction.editReply(
        `Turtle \`${uuid}\` updated: ${updates.join(', ')}.`,
      );
    } catch (error) {
      console.error(`Error editing turtle: ${error}`);
      interaction.editReply('An error occurred while editing the turtle.');
    }
  },
};

export default editTurtleCommand;
