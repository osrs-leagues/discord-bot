import { MessageEmbed } from 'discord.js';

import Turtle, { getTurtleRarityName } from '../../database/models/Turtle';

type TurtleMessageParams = {
  turtle: Turtle;
};

const getTurtleMessage = ({ turtle }: TurtleMessageParams): MessageEmbed => {
  const rarityName = getTurtleRarityName(turtle.rarity);
  const title = turtle.name ? turtle.name : 'You found a turtle!';
  const description = turtle.name
    ? `Rarity: **${rarityName}**`
    : `Rarity: **${rarityName}**`;

  return new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setImage(turtle.image_url)
    .setFooter({ text: `Rarity: ${rarityName}` });
};

export default getTurtleMessage;
