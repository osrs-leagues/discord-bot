import * as dotenv from 'dotenv';

dotenv.config();

export type BotConfig = {
  discord_bot: {
    application_id: string;
    token: string;
  };
  database: {
    database: string;
    host: string;
    password: string;
    username: string;
  };
  environment: string;
  guild_id: string;
};

const config: BotConfig = {
  discord_bot: {
    application_id: process.env.APPLICATION_ID,
    token: process.env.TOKEN,
  },
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  environment: process.env.NODE_ENV,
  guild_id: process.env.GUILD_ID,
};

export default config;
