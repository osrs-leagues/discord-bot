import { Collection } from 'discord.js';

import pingCommand from './ping';
import fetchLeagueRanksCommand from './fetch_league_ranks';
import hiscoresCommand from './hiscores';
import leagueRanksCommand from './league_ranks';
import shatteredRelicsNameCommand from './shattered_relics_name';
import trailblazerNameCommand from './trailblazer_name';
import twistedNameCommand from './twisted_name';
import updateAllRanksCommand from './update_all_ranks';
import { Command } from './types';

const commandData = [
  pingCommand,
  fetchLeagueRanksCommand,
  hiscoresCommand,
  leagueRanksCommand,
  shatteredRelicsNameCommand,
  trailblazerNameCommand,
  twistedNameCommand,
  updateAllRanksCommand,
];

const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

export { commandData, commands };
