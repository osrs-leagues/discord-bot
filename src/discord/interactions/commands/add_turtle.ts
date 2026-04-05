import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import Turtle, {
  TurtleRarity,
  getTurtleRarityName,
} from '../../../database/models/Turtle';

const addTurtleCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Moderator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('add_turtle')
    .setDescription('Add a turtle image with a rarity.')
    .addStringOption((option) =>
      option
        .setName('image_url')
        .setDescription('Externally hosted image URL (e.g., Imgur)')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('rarity')
        .setDescription('The rarity of the turtle')
        .addChoices(
          Object.values(TurtleRarity).map((rarity) => [
            getTurtleRarityName(rarity),
            rarity,
          ]),
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Optional display name for the turtle'),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const imageUrl = interaction.options.getString('image_url');
      const rarity = interaction.options.getString('rarity') as TurtleRarity;
      const name = interaction.options.getString('name');

      try {
        new URL(imageUrl);
      } catch {
        interaction.editReply('Invalid image URL provided.');
        return;
      }

      const turtle = await Turtle.create({
        image_url: imageUrl,
        rarity,
        name: name ?? undefined,
        added_by: interaction.user.id,
      });

      const rarityName = getTurtleRarityName(rarity);
      interaction.editReply(
        `Turtle added (ID: ${turtle.id})${
          name ? ` — "${name}"` : ''
        } with rarity **${rarityName}**.`,
      );
    } catch (error) {
      console.error(`Error adding turtle: ${error}`);
      interaction.editReply('An error occurred while adding the turtle.');
    }
  },
};

export default addTurtleCommand;
