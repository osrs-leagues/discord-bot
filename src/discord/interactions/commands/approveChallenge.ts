import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { approveChallenge } from '../../actions';
import { ChallengeDifficulty } from '../../../database';
import { getDifficultyName } from '../../../challenges';

const approveChallengeCommand: Command = {
  channels: channelGroups.SAGE_CHALLENGE_APPROVAL,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('approve_challenge')
    .setDescription("Approve a user's Sage Challenge Card.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to approve')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('difficulty')
        .setDescription('The difficulty of the challenge to approve')
        .addChoices(
          Object.values(ChallengeDifficulty)
            .map((difficulty) => [
              getDifficultyName(difficulty as ChallengeDifficulty),
              difficulty.toString(),
            ])
            .filter<[name: string, value: string]>(
              (difficulty): difficulty is [string, string] =>
                difficulty[0] !== 'Unknown',
            ),
        )
        .setRequired(true),
    ),
  execute: async (interaction) => {
    try {
      const userId = interaction.options.getUser('user')?.id;
      const difficulty = parseInt(interaction.options.getString('difficulty'));
      if (userId) {
        approveChallenge(interaction, userId, difficulty);
      } else {
        interaction.reply({
          content: 'User not found.',
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Error approving challenge: ${error}`);
      interaction?.reply({
        content: 'An error occurred while approving the challenge.',
        ephemeral: true,
      });
    }
  },
};

export default approveChallengeCommand;
