import { SlashCommandBuilder } from '@discordjs/builders';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { Command } from './types';
import { Challenge } from '../../../database';
import getChallengeMessage from '../../messages/challenge';

const viewChallengeCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('view_challenge')
    .setDescription('View a challenge.')
    .addIntegerOption((option) =>
      option
        .setName('challenge_id')
        .setDescription('The ID of the challenge to view.')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const challengeId = interaction.options.getInteger('challenge_id');

      const challenge = await Challenge.findByPk(challengeId);
      if (challenge) {
        interaction.editReply({
          embeds: [getChallengeMessage({ challenge })],
        });
      } else {
        interaction.editReply(`Challenge with ID ${challengeId} not found.`);
      }
    } catch (error) {
      console.error(`Error viewing challenge: ${error}`);
      interaction?.editReply('An error occurred while viewing the challenge.');
    }
  },
};

export default viewChallengeCommand;
