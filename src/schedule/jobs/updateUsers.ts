import cron from 'node-cron';

import config from '../../config';
import { updateDiscordRoles, updateLeagueUsers } from '../../tasks';
import { Job } from '../types';

const updateUsersJob: Job = {
  interval: {
    testing: undefined,
    development: undefined, //'* * * * *',
    stage: '* * *',
    production: '* * *',
  },
  schedule: () => {
    const interval = updateUsersJob.interval;
    cron.schedule(interval[config.environment], async () => {
      try {
        await updateLeagueUsers.execute();
        await updateDiscordRoles.execute();
      } catch (error) {
        console.error('Error executing update all users job.', error);
      }
    });
  },
};

export default updateUsersJob;
