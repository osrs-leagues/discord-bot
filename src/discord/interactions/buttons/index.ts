import { ButtonInteraction } from 'discord.js';
import challengeRerollButtonListener from './challengeRerollButton';
import { Button } from './types';

const buttons: Button[] = [challengeRerollButtonListener];

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
    validListeners.map((listener) => listener.onButtonInteraction(interaction)),
  );
};
