import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { reverseApproval } from '../../actions';
import { ChallengeDifficulty } from '../../../database';
import { getDifficultyName } from '../../../challenges';

const reverseApprovalCommand: Command = {
  channels: channelGroups.SAGE_CHALLENGE_APPROVAL,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('reverse_approval')
    .setDescription("Reverse a user's Sage Challenge Card approval.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to reverse the approval for')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('difficulty')
        .setDescription('The difficulty of the approved challenge to reverse')
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
    await interaction.deferReply({ ephemeral: true });
    try {
      const userId = interaction.options.getUser('user')?.id;
      const difficulty = parseInt(interaction.options.getString('difficulty'));
      if (userId) {
        reverseApproval(interaction, userId, difficulty);
      } else {
        interaction.editReply('User not found.');
      }
    } catch (error) {
      console.error(`Error reversing challenge approval: ${error}`);
      interaction?.editReply(
        'An error occurred while reversing the challenge approval.',
      );
    }
  },
};

export default reverseApprovalCommand;
