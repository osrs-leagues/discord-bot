import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';

import { Command } from './types';
import trailblazerReloadedNameCommand from './trailblazer_reloaded_name';

const channels = [
  /**
   * OSRS Leagues server
   */
  '769283619595485224', // #bot-commands
  '636193036195463178', // #bot-commands-test

  /**
   * Bot Testing Server
   */
  '931963036896464946', // #bot-commands
];

const leagueNameCommand: Command = {
  channels,
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
  execute: trailblazerReloadedNameCommand.execute,
};

export default leagueNameCommand;
