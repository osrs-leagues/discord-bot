import { fetchLeaguePointRankings } from '../../tasks';
import { Job } from '../types';

const leaguePointRankingsJob: Job = {
  interval: {
    testing: undefined,
    development: undefined, //'* * * * *',
    stage: '0 0 * * *',
    production: '0 */1 * * *',
  },
  runOnStart: true,
  execute: () => {
    try {
      fetchLeaguePointRankings.execute();
    } catch (error) {
      console.error('Error executing leaguePointRankingsJob.', error);
    }
  },
};

export default leaguePointRankingsJob;
