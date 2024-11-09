import { MessageEmbed } from 'discord.js';
import { RaffleTicket } from '../../database/models';

type GetRaffleDrawMessageParams = {
  lowLevelWinners: RaffleTicket[];
  highLevelWinners: RaffleTicket[];
};

const getRaffleDrawMessage = ({
  lowLevelWinners,
  highLevelWinners,
}: GetRaffleDrawMessageParams): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(`Sage's Challenge Raffle Draw Results`)
    .setColor('RANDOM')
    .setDescription('Congratulations to the following raffle winners!');

  // Adding Low Level Winners to Embed
  embed.addField(
    'Low Level Raffle Winners:',
    lowLevelWinners.length > 0
      ? lowLevelWinners
          .map((ticket, index) => `${index + 1}: <@${ticket.discordUserId}>`)
          .join('\n')
      : 'No winners',
  );

  // Adding High Level Winners to Embed
  embed.addField(
    'High Level Raffle Winners:',
    highLevelWinners.length > 0
      ? highLevelWinners
          .map((ticket, index) => `${index + 1}: <@${ticket.discordUserId}>`)
          .join('\n')
      : 'No winners',
  );

  return embed;
};

export default getRaffleDrawMessage;
