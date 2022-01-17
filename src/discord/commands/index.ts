import { Collection } from 'discord.js';

import pingCommand from './ping';
import twistedNameCommand from './twisted_name';
import { Command } from './types';

const commandData = [pingCommand, twistedNameCommand];

const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

export { commandData, commands };
