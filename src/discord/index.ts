import { Client, Intents } from 'discord.js';

import config from '../config';
import { handleMessageCreate, handleReactionAdd } from './listeners';
import interactions from './interactions';
import { loadChallengeCache } from '../challenges';

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
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

  client.on('messageReactionAdd', handleReactionAdd);

  client.login(config.discord_bot.token);
};
