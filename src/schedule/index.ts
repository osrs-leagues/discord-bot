import cron from 'node-cron';

import config from '../config';
import { leaguePointRankingsJob, updateUsersJob } from './jobs';
import { Job } from './types';

const jobs: Job[] = [leaguePointRankingsJob, updateUsersJob];

export const scheduleJobs = () => {
  try {
    jobs.forEach((job) => {
      const interval = job.interval[config.environment];
      if (interval) {
        cron.schedule(interval, job.execute);
      }
      if (job.runOnStart) job.execute();
    });
    console.log('Scheduled all jobs for execution!');
  } catch (error) {
    console.error('Error scheduling jobs: ', error);
  }
};

export default jobs;
