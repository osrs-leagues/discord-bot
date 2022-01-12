import { Client, Collection, Intents } from 'discord.js';
import { commandData } from './commands';

import { Command } from './commands';

import config from './config';

export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

export const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

export const initializeDiscord = () => {
  client.once('ready', () => {
    console.log('Started OSRS Leagues Bot!');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  });

  client.login(config.discord_bot.token);
};
