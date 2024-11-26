import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import * as challenges from '../../../challenges';

const incrementRerollCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('increment_reroll')
    .setDescription(
      "Add a reroll to a user's challenge card and reset their reroll usage for the card.",
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to add a reroll to.')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const userId = interaction.options.getUser('user')?.id;
      if (userId) {
        const challengeCard = await challenges.loadChallengeCard(userId);
        if (challengeCard) {
          try {
            if (challengeCard.rerollsRemaining < 2) {
              await challengeCard.incrementRerolls();
              interaction.editReply('Reroll added.');
            } else {
              interaction.editReply(
                'User already has the maximum number of rerolls.',
              );
            }
          } catch (error) {
            console.error(error);
            interaction.editReply({
              content: 'Failed to add reroll.',
            });
          }
        } else {
          interaction.editReply('User has no challenge card.');
          return;
        }
      } else {
        interaction.editReply('User not found.');
      }
    } catch (error) {
      console.error(`Error incrementing reroll: ${error}`);
      interaction?.editReply(
        'An error occurred while incrementing the reroll.',
      );
    }
  },
};

export default incrementRerollCommand;
