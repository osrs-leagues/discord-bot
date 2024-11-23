import { initializeDatabase } from './database';
import { initializeDiscord } from './discord';
import { startApp } from './express';
import { scheduleJobs } from './schedule';

console.log('Starting Leagues Discord Bot...');

initializeDatabase().then(() => {
  initializeDiscord(scheduleJobs);
  startApp();
});
