import { Client, Intents } from 'discord.js';

import config from '../config';
import { handleMessageCreate } from './listeners';
import interactions from './interactions';
import { loadChallengeCache } from '../challenges';

export const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

export const initializeDiscord = (callback?: () => void) => {
  loadChallengeCache();
  client.once('ready', () => {
    console.log('Started OSRS Leagues Bot!');
    callback?.();
  });

  client.on('messageCreate', handleMessageCreate);

  interactions.forEach((interactionHandler) => {
    client.on('interactionCreate', interactionHandler);
  });

  client.login(config.discord_bot.token);
};
