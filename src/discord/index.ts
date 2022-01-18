import { Client, Intents } from 'discord.js';

import config from '../config';
import { handleInteraction } from './interactionRouter';
import { deleteMessageOnDelay } from './listeners/deleteMessageOnDelay';

export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

export const initializeDiscord = (callback?: () => void) => {
  client.once('ready', () => {
    console.log('Started OSRS Leagues Bot!');
    callback?.();
  });
  
  client.on('messageCreate', deleteMessageOnDelay);

  client.on('interactionCreate', handleInteraction);

  client.login(config.discord_bot.token);
};
