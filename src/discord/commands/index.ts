import { Collection } from 'discord.js';

import pingCommand from './ping';
import fetchLeagueRanksCommand from './fetch_league_ranks';
import hiscoresCommand from './hiscores';
import leagueNameCommand from './league_name';
import leagueRanksCommand from './league_ranks';
import removeRolesCommand from './remove_roles';
import updateAllRanksCommand from './update_all_ranks';
import { Command } from './types';
import leagueNameLocal from './leagueNameLocal';
import leagueNameRemote from './leagueNameRemote';
import { CURRENT_LEAGUE } from '../../leagues';
import regionCommand from './regions';

const commandData = [
  pingCommand,
  fetchLeagueRanksCommand,
  hiscoresCommand,
  leagueNameCommand,
  leagueNameLocal('shattered_relics'),
  leagueNameLocal('trailblazer'),
  leagueNameLocal('twisted'),
  leagueNameRemote(CURRENT_LEAGUE),
  leagueRanksCommand,
  regionCommand,
  removeRolesCommand,
  updateAllRanksCommand,
];

const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

export { commandData, commands };
