import { MessageEmbed } from 'discord.js';

import Turtle, { getTurtleRarityName } from '../../database/models/Turtle';

type TurtleMessageParams = {
  turtle: Turtle;
  isNewDiscovery?: boolean;
};

const getTurtleMessage = ({
  turtle,
  isNewDiscovery,
}: TurtleMessageParams): MessageEmbed => {
  const rarityName = getTurtleRarityName(turtle.rarity);
  const title = turtle.name
    ? `You found a ${turtle.name} turtle!`
    : 'You found a turtle!';
  const newTag = isNewDiscovery ? '🆕 **New Discovery!**\n' : '';
  const description = `${newTag}Rarity: **${rarityName}**`;

  return new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setImage(turtle.image_url);
};

export default getTurtleMessage;
