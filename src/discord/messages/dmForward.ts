import { Message, MessageEmbed, User } from 'discord.js';

type DMForwardMessageParams = {
  user: User;
  content: string;
  attachments?: Message['attachments'];
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
      .map((a) => `[${a.name ?? 'attachment'}](${a.url})`)
      .join('\n');
    embed.addField('Attachments', attachmentList);
  }

  return embed;
};

export default getDMForwardMessage;
