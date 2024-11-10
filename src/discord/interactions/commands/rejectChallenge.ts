import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { rejectChallenge } from '../../actions';
import { ChallengeDifficulty } from '../../../database';
import { getDifficultyName } from '../../../challenges';

const rejectChallengeCommand: Command = {
  channels: channelGroups.SAGE_CHALLENGE_APPROVAL,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('reject_challenge')
    .setDescription("Reject a user's Sage Challenge Card.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to reject')
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
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason for rejecting the challenge')
        .setRequired(false),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const reason = interaction.options.getString('reason');
    const difficulty = parseInt(interaction.options.getString('difficulty'));
    if (userId) {
      rejectChallenge(interaction, userId, difficulty, reason);
    } else {
      interaction.reply({
        content: 'User not found.',
        ephemeral: true,
      });
    }
  },
};

export default rejectChallengeCommand;
