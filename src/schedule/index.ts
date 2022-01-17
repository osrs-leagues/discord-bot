import { Job } from './types';

const jobs: Job[] = [
  //leaguePointRankingsJob - Disabled until league hiscores are working.
];

export const scheduleJobs = () => {
  jobs.forEach((job) => {
    job.schedule();
  });
  console.log('Scheduled all jobs for execution!');
};

export default jobs;
