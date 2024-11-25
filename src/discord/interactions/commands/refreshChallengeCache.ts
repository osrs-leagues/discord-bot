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
    try {
      await loadChallengeCache();
      interaction.reply({
        content: 'Challenge cache refreshed.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'An error occurred while refreshing the challenge cache.',
        ephemeral: true,
      });
    }
  },
};

export default refreshChallengeCacheCommand;
