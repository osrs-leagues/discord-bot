import { Message, ThreadChannel } from 'discord.js';

import Channel, { channelGroups } from '../Channel';
import DMTicket from '../../database/models/DMTicket';
import { client } from '../index';
import { getDMResponseMessage } from '../messages/dmTicket';

const handleThreadReply = async (message: Message) => {
  if (message.author.bot) return;
  if (!message.channel.isThread()) return;

  const thread = message.channel as ThreadChannel;

  // Only handle threads in the appeals channel
  if (!channelGroups.APPEALS.includes(thread.parentId as Channel)) return;

  try {
    const ticket = await DMTicket.findOne({
      where: { thread_id: thread.id },
    });

    if (!ticket) return;

    const user = await client.users.fetch(ticket.user_id);
    const responseEmbed = getDMResponseMessage({
      adminTag: message.author.tag,
      content: message.content,
    });

    await user.send({
      embeds: [responseEmbed],
      files: [...message.attachments.values()].map((a) => ({
        attachment: a.url,
        name: a.name ?? 'attachment',
      })),
    });
    await message.react('✅');
  } catch (error) {
    console.error('Error forwarding thread reply to user:', error);
    try {
      await message.react('❌');
    } catch {
      // Ignore react failure
    }
  }
};

export default handleThreadReply;
