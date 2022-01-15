import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';

export type Command = {
  channels?: string[];
  roles?: string[];
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction<CacheType>) => void;
};
