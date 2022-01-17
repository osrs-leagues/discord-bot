import { Job } from './types';

const jobs: Job[] = [
  /* Disabled until league starts
  leaguePointRankingsJob,
  updateUsersJob
  */
];

export const scheduleJobs = () => {
  jobs.forEach((job) => {
    job.schedule();
  });
  console.log('Scheduled all jobs for execution!');
};

export default jobs;
