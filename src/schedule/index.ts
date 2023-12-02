import cron from 'node-cron';

import config from '../config';
import {
  leaguePointRankingsJob,
  updateUsersJob,
  postLeagueRankingsJob,
  updateRolesJob,
} from './jobs';
import { Job } from './types';

const jobs: Job[] = [
  leaguePointRankingsJob,
  updateRolesJob,
  updateUsersJob,
  postLeagueRankingsJob,
];

export const scheduleJobs = () => {
  try {
    let jobsStarted = 0;
    jobs.forEach((job) => {
      if (job.enabled) {
        const interval = job.interval[config.environment];
        if (interval) {
          cron.schedule(interval, job.execute);
        }
        if (job.runOnStart) job.execute();
        jobsStarted++;
      }
    });
    console.log(`Scheduled ${jobsStarted} jobs for execution!`);
  } catch (error) {
    console.error('Error scheduling jobs: ', error);
  }
};

export default jobs;
