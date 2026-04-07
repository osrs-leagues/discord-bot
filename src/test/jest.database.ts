import sequelize, { initializeDatabase } from '../database';
import * as challenges from '../challenges';
import * as turtles from '../turtles';

beforeAll(async () => {
  await initializeDatabase();

  await challenges.loadChallengeCache();
  await turtles.loadTurtleCache();
});

afterAll(() => sequelize.close());
