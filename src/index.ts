import { initializeDatabase } from './database';
import { initializeDiscord } from './discord';
import { scheduleJobs } from './schedule';

console.log('Starting Leagues Discord Bot...');

initializeDatabase().then(() => {
  initializeDiscord(scheduleJobs);
});
