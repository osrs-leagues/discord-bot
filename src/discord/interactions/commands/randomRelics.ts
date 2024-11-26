import { SlashCommandBuilder } from '@discordjs/builders';

import { CURRENT_LEAGUE, getLeagueName } from '../../../leagues';
import { Command } from './types';
import { channelGroups } from '../../Channel';
import { GuildMember } from 'discord.js';
import { getRandomRelics, getRelicEmoji } from '../../../relics';
import getRelicsMessage from '../../messages/relics';

const randomRelicsCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('random_relics')
    .setDescription(
      `Randomly select your ${getLeagueName(CURRENT_LEAGUE)} relics.`,
    ),
  execute: async (interaction) => {
    try {
      const randomRelics = getRandomRelics();
      const relicEmojis = randomRelics.map((relic) => {
        const emoji = interaction.guild.emojis.cache.find(
          (emoji) => emoji.name === getRelicEmoji(relic),
        );
        return emoji ? `${emoji}` : undefined;
      });
      return interaction.reply({
        embeds: [
          getRelicsMessage({
            member: interaction.member as GuildMember,
            emojis: relicEmojis,
            relics: randomRelics,
          }),
        ],
      });
    } catch (error) {
      console.error(`Error responding to random relics command: ${error}`);
      interaction?.reply({
        content:
          'There was a problem generating your random relics. Please try again.',
        ephemeral: true,
      });
    }
  },
};

export default randomRelicsCommand;
