import {
  CacheType,
  Collection,
  GuildMemberRoleManager,
  Interaction,
} from 'discord.js';
import { SelectMenu } from './types';
import regionsSelectMenu from './regions';

const selectMenuData = [regionsSelectMenu];

const selectMenus = new Collection<string, SelectMenu>();
selectMenuData.forEach((menu) => {
  selectMenus.set(menu.identifier, menu);
});

const handleSelectMenuInteraction = async (
  interaction: Interaction<CacheType>,
) => {
  if (!interaction.isSelectMenu()) return;

  const selectMenu = selectMenus.get(interaction.customId);

  if (!selectMenu) return;

  if (
    selectMenu.channels?.length > 0 &&
    !selectMenu.channels.includes(interaction.channel.id)
  ) {
    return interaction.reply('You cannot answer this select in this channel.');
  }
  if (selectMenu.roles?.length > 0) {
    let hasRole = false;
    const memberRoles = interaction.member.roles as GuildMemberRoleManager;
    for (const role of selectMenu.roles) {
      if (memberRoles.cache.has(role)) {
        hasRole = true;
        break;
      }
    }
    if (!hasRole) {
      return interaction.reply('You do not have permission to answer this.');
    }
  }

  try {
    await selectMenu.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while handling this interaction...',
      ephemeral: true,
    });
  }
};

export { handleSelectMenuInteraction };
