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
    await interaction.deferReply({ ephemeral: true });
    try {
      const challengeId = interaction.options.getInteger('challenge_id');
      if (challengeId) {
        const challenge = await Challenge.findByPk(challengeId);
        if (challenge) {
          await deleteChallenge(challenge);
          interaction.editReply(`Deleted challenge with ID ${challengeId}.`);
        } else {
          interaction.editReply(`Challenge with ID ${challengeId} not found.`);
        }
      } else {
        interaction.editReply('Challenge ID is required.');
      }
    } catch (error) {
      console.error(`Error deleting challenge: ${error}`);
      interaction?.editReply('An error occurred while deleting the challenge.');
    }
  },
};

export default deleteChallengeCommand;
