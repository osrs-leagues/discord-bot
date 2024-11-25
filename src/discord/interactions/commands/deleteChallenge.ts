import { SlashCommandBuilder } from '@discordjs/builders';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { Command } from './types';
import { Challenge } from '../../../database';
import { deleteChallenge } from '../../../challenges';

const deleteChallengeCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('delete_challenge')
    .setDescription('Delete a challenge.')
    .addIntegerOption((option) =>
      option
        .setName('challenge_id')
        .setDescription('The ID of the challenge to delete.')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    try {
      const challengeId = interaction.options.getInteger('challenge_id');
      if (challengeId) {
        const challenge = await Challenge.findByPk(challengeId);
        if (challenge) {
          await deleteChallenge(challenge);
          interaction.reply({
            content: `Deleted challenge with ID ${challengeId}.`,
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: `Challenge with ID ${challengeId} not found.`,
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content: 'Challenge ID is required.',
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'An error occurred while deleting the challenge.',
        ephemeral: true,
      });
    }
  },
};

export default deleteChallengeCommand;
