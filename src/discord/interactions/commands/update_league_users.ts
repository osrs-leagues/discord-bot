import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { getLeagueName } from '../../../leagues';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { updateUsersJob } from '../../../schedule/jobs';

const updateLeagueUsersCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('update_league_users')
    .setDescription(
      `Update all league user points for ${getLeagueName()} from hiscores.`,
    ),
  execute: async (interaction) => {
    await interaction.reply('Attempting to update all league user points!');
    updateUsersJob.execute();
  },
};

export default updateLeagueUsersCommand;
