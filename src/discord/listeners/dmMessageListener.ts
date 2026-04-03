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

/** Evict cooldown entries after they expire to prevent unbounded growth */
const setCooldown = (userId: string) => {
  cooldowns.set(userId, Date.now());
  setTimeout(() => cooldowns.delete(userId), COOLDOWN_MS);
};

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
  setCooldown(userId);

  try {
    let ticket = await DMTicket.findByPk(userId);

    // Blocked check
    if (ticket?.is_blocked) {
      await message.reply(
        'You are currently blocked from sending messages to this server.',
      );
      return;
    }

    // Find the appeals channel (try cache first, then fetch)
    let appealsChannel: TextChannel | undefined;
    for (const id of channelGroups.APPEALS) {
      try {
        const channel =
          client.channels.cache.get(id) ?? (await client.channels.fetch(id));
        if (channel?.isText()) {
          appealsChannel = channel as TextChannel;
          break;
        }
      } catch {
        // Channel not accessible, try next
      }
    }

    if (!appealsChannel) {
      console.error('No appeals channel found.');
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
          const infoMessage = pinnedMessages.find(
            (msg) =>
              msg.author.id === client.user?.id &&
              msg.components?.some((row) =>
                row.components.some((component: any) => {
                  const cId = component?.customId;
                  return (
                    typeof cId === 'string' &&
                    (cId.startsWith('close_ticket ') ||
                      cId.startsWith('reopen_ticket ') ||
                      cId.startsWith('block_user '))
                  );
                }),
              ),
          );
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
    await thread.send({
      embeds: [forwardEmbed],
      files: [...message.attachments.values()].map((a) => ({
        attachment: a.url,
        name: a.name ?? 'attachment',
      })),
    });

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
