import { postLeagueRankings } from '../../tasks';
import { Job } from '../types';

const postLeagueRankingsJob: Job = {
  interval: {
    testing: undefined,
    development: '*/1 * * * *', //'* * * * *',
    stage: '*/10 * * * *',
    production: '0 */6 * * *',
  },
  runOnStart: true,
  execute: () => {
    try {
      postLeagueRankings.execute();
    } catch (error) {
      console.error('Error executing postLeagueRankingsJob.', error);
    }
  },
};

export default postLeagueRankingsJob;
