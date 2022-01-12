import { SlashCommandBuilder } from '@discordjs/builders';

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: any) => void;
};
