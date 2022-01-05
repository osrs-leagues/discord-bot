import * as dotenv from 'dotenv';

dotenv.config();

export type BotConfig = {
  database: {
    database: string;
    host: string;
    password: string;
    username: string;
  };
  environment: string;
};

const config: BotConfig = {
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  environment: process.env.NODE_ENV,
};

export default config;
