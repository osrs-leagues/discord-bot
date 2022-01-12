import { initializeDatabase } from './database';
import { initializeDiscord } from './discord';

console.log('Starting Leagues Discord Bot...');

initializeDatabase().then(() => {
  initializeDiscord();
});
