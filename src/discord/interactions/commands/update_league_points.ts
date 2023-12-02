import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { getLeagueName } from '../../../leagues';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { updateUsersJob } from '../../../schedule/jobs';

const updateLeaguePointsCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('update_league_points')
    .setDescription(
      `Update all league points for ${getLeagueName()} rankings.`,
    ),
  execute: async (interaction) => {
    await interaction.reply('Attempting to scrape hiscores for league points!');
    updateUsersJob.execute();
  },
};

export default updateLeaguePointsCommand;
