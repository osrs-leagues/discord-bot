import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import { CURRENT_LEAGUE, getLeagueName } from '../../../leagues';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';

const regionCommand: Command = {
  channels: channelGroups.BOT_COMMANDS,
  data: new SlashCommandBuilder()
    .setName('regions')
    .setDescription(
      `Set your ${getLeagueName(
        CURRENT_LEAGUE,
      )} regions. Note: your selection will override any existing region roles`,
    ),
  execute: async (interaction) => {
    try {
      const selectMenuRow = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('regions')
          .setPlaceholder(
            `Select the ${getLeagueName(
              CURRENT_LEAGUE,
            )} region roles to set. Note: your selection will override any existing region roles.`,
          )
          .setMinValues(1)
          .setMaxValues(3)
          .addOptions(
            [
              {
                label: 'Asgarnia',
                description: 'The asgarnia region',
                value: 'asgarnia',
              },
              {
                label: 'Fremennik Isles',
                description: 'The Fremennik region',
                value: 'fremennik',
              },
              {
                label: 'Kandarin',
                description: 'The Kandarin region',
                value: 'kandarin',
              },
              {
                label: 'Kharidian Desert',
                description: 'The Desert region',
                value: 'desert',
              },
              {
                label: 'Kourend & Kebos',
                description: 'The Kourend & Kebos (Zeah) region',
                value: 'kourend',
              },
              {
                label: 'Morytania',
                description: 'The Morytania region',
                value: 'morytania',
              },
              {
                label: 'Tirannwn',
                description: 'The Tirannwn region',
                value: 'tirannwn',
              },
              {
                label: 'Varlamore',
                description: 'The Varlamore region',
                value: 'varlamore',
              },
              {
                label: 'Wilderness',
                description: 'The Wilderness region',
                value: 'wilderness',
              },
            ].map((option) => {
              const emoji = interaction.guild.emojis.cache.find(
                (emoji) => emoji.name === `r_${option.value}`,
              );
              return {
                ...option,
                emoji: emoji ? `<:${emoji}>` : undefined,
              };
            }),
          ),
      );
      interaction.reply({
        content:
          'Choose your region roles by selecting 3 regions in the dropdown below: ',
        components: [selectMenuRow],
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error sending region select menu: ${error}`);
      if (interaction) {
        interaction.reply(`An error occured, please try again.`);
      }
    }
  },
};

export default regionCommand;
