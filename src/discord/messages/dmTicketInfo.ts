import { MessageEmbed, User } from 'discord.js';

type DMTicketInfoMessageParams = {
  user: User;
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

export default getDMTicketInfoMessage;
