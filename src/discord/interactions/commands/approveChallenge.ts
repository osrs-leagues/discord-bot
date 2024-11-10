import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { approveChallenge } from '../../actions';

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
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    if (userId) {
      approveChallenge(interaction, userId);
    } else {
      interaction.reply({
        content: 'User not found.',
        ephemeral: true,
      });
    }
  },
};

export default approveChallengeCommand;
