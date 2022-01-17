import { Sequelize } from 'sequelize';

import config from '../config';
import databaseConfig from './config';
import models from './models';

const sequelize = new Sequelize(databaseConfig);

export const initializeDatabase = async () => {
  console.log('Connecting to OSRS Leagues database...');
  try {
    await sequelize.authenticate();
    console.log('Connected to OSRS Leagues database.');

    models.forEach((model) => model(sequelize));
    await sequelize.sync({
      alter: {
        drop: false,
      },
    });
    console.log('Synced sequelize models.');
  } catch (error) {
    console.error('Unable to connect to the OSRS Leagues database:', error);
  }
};

export default sequelize;
