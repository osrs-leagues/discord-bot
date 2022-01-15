import { Collection } from 'discord.js';
import { pingCommand } from './ping';
import { Command } from './types';

const commandData = [pingCommand];

const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

export { commandData, commands };
