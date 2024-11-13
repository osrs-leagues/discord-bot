import sequelize, { initializeDatabase } from '../database';
import * as challenges from '../challenges';

beforeAll(async () => {
  await initializeDatabase();

  await challenges.loadChallengeCache();
});

afterAll(() => sequelize.close());
