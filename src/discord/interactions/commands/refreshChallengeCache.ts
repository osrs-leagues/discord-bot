import { SlashCommandBuilder } from '@discordjs/builders';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { Command } from './types';
import { loadChallengeCache } from '../../../challenges';

const refreshChallengeCacheCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('refresh_challenge_cache')
    .setDescription('Refresh the challenge cache.'),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      await loadChallengeCache();
      interaction.editReply('Challenge cache refreshed.');
    } catch (error) {
      console.error(`Error refreshing challenge cache: ${error}`);
      interaction?.editReply(
        'An error occurred while refreshing the challenge cache.',
      );
    }
  },
};

export default refreshChallengeCacheCommand;
