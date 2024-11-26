import { SlashCommandBuilder } from '@discordjs/builders';

import { CURRENT_LEAGUE, getLeagueName } from '../../../leagues';
import { Command } from './types';
import { channelGroups } from '../../Channel';
import { GuildMember } from 'discord.js';
import getCombatMasteriesMessage from '../../messages/combatMasteries';

function getRandomMasteries() {
  const masteries = [0, 0, 0];
  for (let i = 0; i < 10; i++) {
    const randomMastery = Math.floor(Math.random() * 3);
    masteries[randomMastery] += 1;
  }
  return masteries;
}

const randomCombatMasteriesCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('random_combat_masteries')
    .setDescription(
      `Randomly select your ${getLeagueName(CURRENT_LEAGUE)} combat masteries.`,
    ),
  execute: async (interaction) => {
    try {
      const meleeEmoji = interaction.guild.emojis.cache
        .find((emoji) => emoji.name === 'crmelee_t6')
        ?.toString();
      const rangedEmoji = interaction.guild.emojis.cache
        .find((emoji) => emoji.name === 'crranged_t6')
        ?.toString();
      const magicEmoji = interaction.guild.emojis.cache
        .find((emoji) => emoji.name === 'crmagic_t6')
        ?.toString();
      const randomMasteries = getRandomMasteries();
      interaction.reply({
        embeds: [
          getCombatMasteriesMessage({
            member: interaction.member as GuildMember,
            emojis: [meleeEmoji, rangedEmoji, magicEmoji],
            masteries: randomMasteries,
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

export default randomCombatMasteriesCommand;
