import { CacheType, GuildMemberRoleManager, Interaction } from 'discord.js';

import { commands } from './commands';

export const handleInteraction = async (
  interaction: Interaction<CacheType>,
) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  if (
    command.channels?.length > 0 &&
    !command.channels.includes(interaction.channel.id)
  ) {
    return interaction.reply('You cannot use this command in this channel.');
  }
  if (command.roles?.length > 0) {
    let hasRole = false;
    const memberRoles = interaction.member.roles as GuildMemberRoleManager;
    for (const role of command.roles) {
      if (memberRoles.cache.has(role)) {
        hasRole = true;
        break;
      }
    }
    if (!hasRole) {
      return interaction.reply(
        'You do not have permission to use this command.',
      );
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
};
