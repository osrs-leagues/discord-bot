import cron from 'node-cron';

import config from '../../config';
import { fetchLeaguePointRankings } from '../../tasks';
import { Job } from '../types';

const leaguePointRankingsJob: Job = {
  interval: {
    testing: undefined,
    development: undefined, //'* * * * *',
    stage: '* * * *',
    production: '* * * *',
  },
  schedule: () => {
    const interval = leaguePointRankingsJob.interval;
    cron.schedule(interval[config.environment], () => {
      try {
        fetchLeaguePointRankings.execute();
      } catch (error) {
        console.error('Error executing league points rankings job.', error);
      }
    });
  },
};

export default leaguePointRankingsJob;
