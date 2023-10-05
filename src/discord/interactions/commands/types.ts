import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import { League } from '../../../leagues';

export type Command = {
  channels?: string[];
  roles?: string[];
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: CommandInteraction<CacheType>) => void;
};

export type LeagueNameCommand = (league: League) => Command;
