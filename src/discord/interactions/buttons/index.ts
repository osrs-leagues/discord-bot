import { ButtonInteraction, GuildMemberRoleManager } from 'discord.js';
import challengeRerollButtonListener from './challengeRerollButton';
import closeTicketButtonListener from './closeTicketButton';
import blockUserButtonListener from './blockUserButton';
import { Button } from './types';

const buttons: Button[] = [
  challengeRerollButtonListener,
  closeTicketButtonListener,
  blockUserButtonListener,
];

export const handleButtonInteraction = async (
  interaction: ButtonInteraction,
) => {
  if (!interaction.customId) {
    return;
  }

  // Filter button that start with the button customId
  const validListeners = buttons.filter((listener) =>
    listener.buttons.some((buttonId) =>
      interaction.customId.startsWith(buttonId),
    ),
  );

  // Trigger the valid button's handler functions
  Promise.all(
    validListeners.map((listener) => {
      // Role guard: check if the user has the required role
      if (listener.roles?.length > 0) {
        const memberRoles = interaction.member?.roles as GuildMemberRoleManager;
        const hasRole = listener.roles.some((role) =>
          memberRoles?.cache?.has(role),
        );
        if (!hasRole) {
          return interaction.reply({
            content: 'You do not have permission to perform this action.',
            ephemeral: true,
          });
        }
      }
      return listener.onButtonInteraction(interaction);
    }),
  );
};
