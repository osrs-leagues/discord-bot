import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';

import { Command } from './types';
import trailblazerReloadedNameCommand from './trailblazer_reloaded_name';
import { channelGroups } from '../Channel';

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
  execute: trailblazerReloadedNameCommand.execute,
};

export default leagueNameCommand;
