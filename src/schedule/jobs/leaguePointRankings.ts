import cron from 'node-cron';

import config from '../../config';
import { fetchLeaguePointRankings } from '../../tasks';
import { Job } from '../types';

const leaguePointRankingsJob: Job = {
  interval: {
    testing: undefined,
    development: undefined, //'* * * * *',
    stage: '0 0 * * *',
    production: '0 */1 * * *',
  },
  schedule: () => {
    const intervalMap = leaguePointRankingsJob.interval;
    const interval = intervalMap[config.environment];
    if (interval) {
      cron.schedule(interval, () => {
        try {
          fetchLeaguePointRankings.execute();
        } catch (error) {
          console.error('Error executing leaguePointRankingsJob.', error);
        }
      });
    }
  },
};

export default leaguePointRankingsJob;
