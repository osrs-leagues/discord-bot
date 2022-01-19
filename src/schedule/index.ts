import { leaguePointRankingsJob } from './jobs';
import { Job } from './types';

const jobs: Job[] = [leaguePointRankingsJob /*, updateUsersJob*/];

export const scheduleJobs = () => {
  try {
    jobs.forEach((job) => {
      if (job.interval) job.schedule();
    });
    console.log('Scheduled all jobs for execution!');
  } catch (error) {
    console.error('Error scheduling jobs: ', error);
  }
};

export default jobs;
