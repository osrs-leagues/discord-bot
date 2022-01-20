import { updateDiscordRoles, updateLeagueUsers } from '../../tasks';
import { Job } from '../types';

const updateUsersJob: Job = {
  interval: {
    testing: undefined,
    development: undefined, //'* * * * *',
    stage: undefined, // '* * *',
    production: '2 */12 * * *',
  },
  runOnStart: false,
  execute: async () => {
    try {
      await updateLeagueUsers.execute();
      await updateDiscordRoles.execute();
    } catch (error) {
      console.error('Error executing updateUsersJob.', error);
    }
  },
};

export default updateUsersJob;
