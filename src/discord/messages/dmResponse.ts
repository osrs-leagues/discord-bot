import { MessageEmbed } from 'discord.js';

type DMResponseMessageParams = {
  adminTag: string;
  content: string;
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

export default getDMResponseMessage;
