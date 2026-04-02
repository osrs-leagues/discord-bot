import { Collection, MessageAttachment, MessageEmbed, User } from 'discord.js';

type DMTicketInfoMessageParams = {
  user: User;
};

type DMForwardMessageParams = {
  user: User;
  content: string;
  attachments?: Collection<string, MessageAttachment>;
};

type DMResponseMessageParams = {
  adminTag: string;
  content: string;
};

const getDMTicketInfoMessage = ({
  user,
}: DMTicketInfoMessageParams): MessageEmbed => {
  return new MessageEmbed()
    .setColor('#e67e22')
    .setTitle(`Appeal Ticket — ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setDescription(
      `**User:** <@${user.id}>\n**User ID:** ${
        user.id
      }\n**Account Created:** <t:${Math.floor(
        user.createdTimestamp / 1000,
      )}:R>`,
    )
    .setTimestamp();
};

const getDMForwardMessage = ({
  user,
  content,
  attachments,
}: DMForwardMessageParams): MessageEmbed => {
  const embed = new MessageEmbed()
    .setColor('#3498db')
    .setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setDescription(content || '*No text content*')
    .setTimestamp();

  if (attachments?.size > 0) {
    const firstImage = attachments.find(
      (a) =>
        a.url.endsWith('.png') ||
        a.url.endsWith('.jpg') ||
        a.url.endsWith('.jpeg') ||
        a.url.endsWith('.gif') ||
        a.url.endsWith('.webp'),
    );
    if (firstImage) {
      embed.setImage(firstImage.url);
    }
    const attachmentList = attachments
      .map((a) => `[${a.name ?? a.url}](${a.url})`)
      .join('\n');
    embed.addField('Attachments', attachmentList);
  }

  return embed;
};

const getDMResponseMessage = ({
  adminTag,
  content,
}: DMResponseMessageParams): MessageEmbed => {
  return new MessageEmbed()
    .setColor('#2ecc71')
    .setTitle('Staff Response')
    .setDescription(content)
    .setFooter({ text: `From: ${adminTag}` })
    .setTimestamp();
};

export {
  getDMTicketInfoMessage as default,
  getDMTicketInfoMessage,
  getDMForwardMessage,
  getDMResponseMessage,
};
