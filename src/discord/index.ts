import { Client, Intents } from 'discord.js';

import config from '../config';
import { handleInteraction } from './interactionRouter';
import { handleMessageCreate } from './listeners';

export const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

export const initializeDiscord = (callback?: () => void) => {
  client.once('ready', () => {
    console.log('Started OSRS Leagues Bot!');
    callback?.();
  });

  client.on('messageCreate', handleMessageCreate);

  client.on('interactionCreate', handleInteraction);

  client.login(config.discord_bot.token);
};
