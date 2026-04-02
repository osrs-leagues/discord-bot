import {
  Message,
  MessageActionRow,
  MessageButton,
  ThreadChannel,
  TextChannel,
} from 'discord.js';

import { client } from '../index';
import { channelGroups } from '../Channel';
import DMTicket from '../../database/models/DMTicket';
import {
  getDMTicketInfoMessage,
  getDMForwardMessage,
} from '../messages/dmTicket';

/** Rate limit: 1 message per 30 seconds per user */
const COOLDOWN_MS = 30_000;
const cooldowns = new Map<string, number>();

const handleDirectMessage = async (message: Message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  // Rate limiting
  const lastMessage = cooldowns.get(userId);
  if (lastMessage && Date.now() - lastMessage < COOLDOWN_MS) {
    const remaining = Math.ceil(
      (COOLDOWN_MS - (Date.now() - lastMessage)) / 1000,
    );
    await message.reply(
      `Please wait ${remaining} seconds before sending another message.`,
    );
    return;
  }
  cooldowns.set(userId, Date.now());
  setTimeout(() => cooldowns.delete(userId), COOLDOWN_MS);

  try {
    let ticket = await DMTicket.findByPk(userId);

    // Blocked check
    if (ticket?.is_blocked) {
      await message.reply(
        'You are currently blocked from sending messages to this server.',
      );
      return;
    }

    // Find the appeals channel
    const appealsChannelId = channelGroups.APPEALS.find((id) => {
      try {
        return client.channels.cache.has(id);
      } catch {
        return false;
      }
    });

    if (!appealsChannelId) {
      console.error('No appeals channel found in cache.');
      await message.reply(
        'Unable to process your message at this time. Please try again later.',
      );
      return;
    }

    const appealsChannel = client.channels.cache.get(
      appealsChannelId,
    ) as TextChannel;
    if (!appealsChannel) {
      console.error('Appeals channel not found:', appealsChannelId);
      await message.reply(
        'Unable to process your message at this time. Please try again later.',
      );
      return;
    }

    let thread: ThreadChannel;

    if (ticket) {
      // Existing ticket — fetch thread
      try {
        thread = (await client.channels.fetch(
          ticket.thread_id,
        )) as ThreadChannel;
        if (thread.archived) {
          await thread.setArchived(false);

          // Update the pinned info message buttons back to "Close Ticket"
          const pinnedMessages = await thread.messages.fetchPinned();
          const TICKET_BUTTON_PREFIXES = ['reopen_ticket ', 'close_ticket ', 'block_user '];
          const infoMessage = pinnedMessages.find((msg) => {
            if (!client.user || msg.author.id !== client.user.id) return false;
            if (!msg.components?.length) return false;
            return msg.components.some((row) =>
              row.components.some((component: any) => {
                const customId = component?.customId;
                return (
                  typeof customId === 'string' &&
                  TICKET_BUTTON_PREFIXES.some((prefix) => customId.startsWith(prefix))
                );
              }),
            );
          });
          if (infoMessage?.components?.length) {
            const updatedRow = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId(`close_ticket ${userId}`)
                .setLabel('Close Ticket')
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId(`block_user ${userId}`)
                .setLabel('Block User')
                .setStyle('DANGER'),
            );
            await infoMessage.edit({ components: [updatedRow] });
          }
        }
      } catch {
        // Thread was deleted — create a new one
        thread = await createTicketThread(appealsChannel, message);
        await ticket.update({ thread_id: thread.id });
      }
    } else {
      // New ticket
      thread = await createTicketThread(appealsChannel, message);
      ticket = await DMTicket.create({
        user_id: userId,
        thread_id: thread.id,
      });
    }

    // Forward the message to the thread
    const forwardEmbed = getDMForwardMessage({
      user: message.author,
      content: message.content,
      attachments: message.attachments,
    });
    await thread.send({ embeds: [forwardEmbed] });

    await message.reply(
      'Your message has been received. Staff will respond as soon as possible.',
    );
  } catch (error) {
    console.error('Error handling DM:', error);
    await message.reply(
      'There was an error processing your message. Please try again later.',
    );
  }
};

const createTicketThread = async (
  appealsChannel: TextChannel,
  message: Message,
): Promise<ThreadChannel> => {
  const user = message.author;
  const threadName = `Appeal - ${user.username} (${user.id})`;

  const thread = await appealsChannel.threads.create({
    name: threadName.slice(0, 100),
    reason: `DM appeal ticket for ${user.tag}`,
  });

  // Send and pin the ticket info embed with action buttons
  const infoEmbed = getDMTicketInfoMessage({ user });
  const actionRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`close_ticket ${user.id}`)
      .setLabel('Close Ticket')
      .setStyle('SECONDARY'),
    new MessageButton()
      .setCustomId(`block_user ${user.id}`)
      .setLabel('Block User')
      .setStyle('DANGER'),
  );

  const infoMessage = await thread.send({
    embeds: [infoEmbed],
    components: [actionRow],
  });
  await infoMessage.pin();

  return thread;
};

export default handleDirectMessage;
