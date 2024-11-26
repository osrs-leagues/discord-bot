import { SlashCommandBuilder } from '@discordjs/builders';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { Command } from './types';
import { Challenge } from '../../../database';
import { updateChallenge } from '../../../challenges';

const editChallengeCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('edit_challenge')
    .setDescription('Edit a challenge.')
    .addIntegerOption((option) =>
      option
        .setName('challenge_id')
        .setDescription('The ID of the challenge to edit.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('The new description of the challenge.')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const challengeId = interaction.options.getInteger('challenge_id');
      const description = interaction.options
        .getString('description')
        .replace(/\\n/g, '\n');

      const challenge = await Challenge.findByPk(challengeId);
      if (challenge) {
        await updateChallenge(challenge, description);
        interaction.editReply(`Challenge updated with ID: ${challenge.id}`);
      } else {
        interaction.editReply(`Challenge with ID ${challengeId} not found.`);
      }
    } catch (error) {
      console.error(`Error updating challenge: ${error}`);
      interaction?.editReply('An error occurred while updating the challenge.');
    }
  },
};

export default editChallengeCommand;
