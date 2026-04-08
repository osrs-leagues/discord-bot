import { MessageEmbed } from 'discord.js';

import Turtle, {
  TurtleRarity,
  getTurtleRarityName,
} from '../../database/models/Turtle';

type TurtleLogMessageParams = {
  turtles: Turtle[];
  collected: Set<number>;
};

const RARITY_ORDER: TurtleRarity[] = [
  TurtleRarity.COMMON,
  TurtleRarity.UNCOMMON,
  TurtleRarity.RARE,
  TurtleRarity.ULTRA_RARE,
];

const getTurtleLogMessage = ({
  turtles,
  collected,
}: TurtleLogMessageParams): MessageEmbed => {
  const totalCount = turtles.length;
  const collectedCount = collected.size;

  const embed = new MessageEmbed()
    .setTitle('🐢 Turtle Collection Log')
    .setDescription(`Collected: **${collectedCount}** / **${totalCount}**`);

  const ITEMS_PER_LINE = 3;

  for (const rarity of RARITY_ORDER) {
    const rarityTurtles = turtles.filter((t) => t.rarity === rarity);
    if (rarityTurtles.length === 0) continue;

    const collectedInRarity = rarityTurtles.filter((t) =>
      collected.has(t.id),
    ).length;

    const entries = rarityTurtles.map((turtle) => {
      if (collected.has(turtle.id)) {
        return `✅ ${turtle.name ?? `Turtle #${turtle.id}`}`;
      }
      return '❓ ???';
    });

    const lines: string[] = [];
    for (let i = 0; i < entries.length; i += ITEMS_PER_LINE) {
      lines.push(entries.slice(i, i + ITEMS_PER_LINE).join(' | '));
    }

    embed.addField(
      `${getTurtleRarityName(rarity)} (${collectedInRarity}/${
        rarityTurtles.length
      })`,
      lines.join('\n'),
    );
  }

  return embed;
};

export default getTurtleLogMessage;
