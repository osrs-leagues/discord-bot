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
    try {
      const challengeId = interaction.options.getInteger('challenge_id');

      const challenge = await Challenge.findByPk(challengeId);
      if (challenge) {
        interaction.reply({
          embeds: [getChallengeMessage({ challenge })],
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `Challenge with ID ${challengeId} not found.`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'An error occurred while viewing the challenge.',
        ephemeral: true,
      });
    }
  },
};

export default viewChallengeCommand;
