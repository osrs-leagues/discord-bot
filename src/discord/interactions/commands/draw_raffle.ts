import { SlashCommandBuilder } from '@discordjs/builders';
import * as raffles from '../../../raffles';
import { channelGroups } from '../../Channel';
import { Command } from './types';
import getRaffleDrawMessage from '../../messages/draw_raffle';
import Role from '../../Role';

const raffleDrawCommand: Command = {
  channels: channelGroups.SAGE_CHALLENGE_RAFFLE,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('draw_raffle')
    .setDescription(
      "Draws the winning Low Level and High Level Raffle tickets for Sage's Challenge",
    )
    .addIntegerOption((option) =>
      option
        .setName('low_level_winners')
        .setDescription('Number of winners for the low-level raffle')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('high_level_winners')
        .setDescription('Number of winners for the high-level raffle')
        .setRequired(true),
    ),

  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      // Retrieve the options for the number of low and high level winners
      const lowLevelWinnersCount =
        interaction.options.getInteger('low_level_winners');
      const highLevelWinnersCount =
        interaction.options.getInteger('high_level_winners');

      if (lowLevelWinnersCount === null || highLevelWinnersCount === null) {
        interaction.editReply(
          'Please specify valid numbers for the winners count.',
        );
        return;
      }
      try {
        const { lowLevelWinners, highLevelWinners } = await raffles.drawWinners(
          lowLevelWinnersCount,
          highLevelWinnersCount,
        );

        const raffleEmbed = getRaffleDrawMessage({
          lowLevelWinners: lowLevelWinners,
          highLevelWinners: highLevelWinners,
        });

        await interaction.editReply('The raffle winners have been drawn!');
        interaction.followUp({ embeds: [raffleEmbed] });
      } catch (error) {
        console.error('Error drawing raffle winners:', error);
        interaction.editReply(
          'An error occurred while drawing raffle winners. Please try again later.',
        );
      }
    } catch (error) {
      console.error(`Error drawing raffle: ${error}`);
      interaction?.editReply('An error occurred while drawing the raffle.');
    }
  },
};

export default raffleDrawCommand;
