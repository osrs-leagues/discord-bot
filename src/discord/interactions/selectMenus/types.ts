import { CacheType, SelectMenuInteraction } from 'discord.js';

export type SelectMenu = {
  identifier: string;
  channels?: string[];
  roles?: string[];
  execute: (interaction: SelectMenuInteraction<CacheType>) => void;
};
