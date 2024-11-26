import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import { CURRENT_LEAGUE, CURRENT_LEAGUE_STARTED } from '../../../leagues';
import leagueNameRemote from './leagueNameRemote';
import leagueNameBronze from './leagueNameBronze';

const leagueNameCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('league_name')
    .setDescription(
      'Set your username and discord role for the current & active league.',
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('username')
        .setDescription('Enter your username for the current & active league.')
        .setRequired(true),
    ) as SlashCommandBuilder,
  execute: (CURRENT_LEAGUE_STARTED
    ? leagueNameRemote(CURRENT_LEAGUE)
    : leagueNameBronze(CURRENT_LEAGUE)
  ).execute,
};

export default leagueNameCommand;
