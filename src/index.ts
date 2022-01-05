import { initializeDatabase } from './database';

console.log('Starting Leagues Discord Bot...');

initializeDatabase().then(() => {
  console.log('connected');
});
