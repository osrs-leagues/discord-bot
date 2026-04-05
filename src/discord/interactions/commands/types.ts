import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import { League } from '../../../leagues';

export type CommandCooldown = {
  /** Cooldown duration in milliseconds */
  duration: number;
  /** Channels exempt from cooldown */
  exemptChannels?: string[];
};

export type Command = {
  channels?: string[];
  roles?: string[];
  cooldown?: CommandCooldown;
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: CommandInteraction<CacheType>) => void;
};

export type LeagueNameCommand = (league: League) => Command;
