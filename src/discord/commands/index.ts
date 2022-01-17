import { Collection } from 'discord.js';

import pingCommand from './ping';
import shatteredRelicsNameCommand from './shattered_relics_name';
import trailblazerNameCommand from './trailblazer_name';
import twistedNameCommand from './twisted_name';
import { Command } from './types';

const commandData = [
  pingCommand,
  shatteredRelicsNameCommand,
  trailblazerNameCommand,
  twistedNameCommand,
];

const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

export { commandData, commands };
