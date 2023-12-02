import { Message } from 'discord.js';

/**
 * Set a message to expire in {expiration} milliseconds.
 * @param message The message to expire.
 * @param expiration The amount of milliseconds until expiration.
 */
export const setMessageExpiration = async (
  message: Message,
  expiration: number,
) => {
  setTimeout(() => {
    try {
      if (message) {
        message.delete().catch((error) => {
          console.warn(error);
          return;
        });
      }
    } catch (error) {
      console.error(`Error deleting message: ${error}`);
    }
  }, expiration);
};
