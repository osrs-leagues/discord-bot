import { Sequelize } from 'sequelize';

import config from '../config';
import databaseConfig from './config';
import models from './models';

const sequelize = new Sequelize(databaseConfig);

export const initializeDatabase = async () => {
  console.log('Connecting to database...');
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    models.forEach((model) => model(sequelize));
    if (config.environment !== 'production') {
      await sequelize.sync({ force: config.environment === 'testing' });
      console.log('Synced sequelize models.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
