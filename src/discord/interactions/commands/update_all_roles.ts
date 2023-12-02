import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { getLeagueName } from '../../../leagues';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { updateRolesJob } from '../../../schedule/jobs';

const updateAllRolesCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('update_all_roles')
    .setDescription(
      `Update all discord roles for ${getLeagueName()} rankings.`,
    ),
  execute: async (interaction) => {
    await interaction.reply('Attempting to update all user roles!');
    updateRolesJob.execute();
  },
};

export default updateAllRolesCommand;
