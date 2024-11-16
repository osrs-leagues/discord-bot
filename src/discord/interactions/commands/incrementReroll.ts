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
    const userId = interaction.options.getUser('user')?.id;
    if (userId) {
      const challengeCard = await challenges.loadChallengeCard(userId);
      if (challengeCard) {
        try {
          if (challengeCard.rerollsRemaining < 2) {
            await challengeCard.incrementRerolls();
            interaction.reply({
              content: 'Reroll added.',
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: 'User already has the maximum number of rerolls.',
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error(error);
          interaction.reply({
            content: 'Failed to add reroll.',
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content: 'User has no challenge card.',
          ephemeral: true,
        });
        return;
      }
    } else {
      interaction.reply({
        content: 'User not found.',
        ephemeral: true,
      });
    }
  },
};

export default incrementRerollCommand;
