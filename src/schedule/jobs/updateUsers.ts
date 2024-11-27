import config from '../../config';
import { updateLeagueUsers } from '../../tasks';
import { Job } from '../types';

const updateUsersJob: Job = {
  enabled: config.current_league_active,
  interval: {
    test: undefined,
    development: undefined, //'* * * * *',
    stage: undefined, // '* * *',
    production: '2 */6 * * *',
  },
  runOnStart: false,
  execute: async () => {
    try {
      await updateLeagueUsers.execute();
    } catch (error) {
      console.error('Error executing updateUsersJob.', error);
    }
  },
};

export default updateUsersJob;
