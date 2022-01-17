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
      await updateLeagueUsers.execute();
      await updateDiscordRoles.execute();
    });
  },
};

export default updateUsersJob;
