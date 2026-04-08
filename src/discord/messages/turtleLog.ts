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

  const ITEMS_PER_LINE = 2;

  for (const rarity of RARITY_ORDER) {
    const rarityTurtles = turtles.filter((t) => t.rarity === rarity);
    if (rarityTurtles.length === 0) continue;

    const collectedTurtles = rarityTurtles.filter((t) => collected.has(t.id));
    const uncollectedCount = rarityTurtles.length - collectedTurtles.length;

    const entries = collectedTurtles.map(
      (turtle) => `✅ ${turtle.name ?? `Turtle #${turtle.id}`}`,
    );

    const colWidths: number[] = [];
    for (let col = 0; col < ITEMS_PER_LINE; col++) {
      let max = 0;
      for (let i = col; i < entries.length; i += ITEMS_PER_LINE) {
        if (entries[i].length > max) max = entries[i].length;
      }
      colWidths.push(max);
    }

    const lines: string[] = [];
    for (let i = 0; i < entries.length; i += ITEMS_PER_LINE) {
      const row = entries.slice(i, i + ITEMS_PER_LINE);
      lines.push(
        row
          .map((e, col) =>
            col < row.length - 1 ? e.padEnd(colWidths[col]) : e,
          )
          .join(' | '),
      );
    }

    if (uncollectedCount > 0) {
      lines.push(`... and ${uncollectedCount} more to discover`);
    }

    embed.addField(
      `${getTurtleRarityName(rarity)} (${collectedTurtles.length}/${
        rarityTurtles.length
      })`,
      '```\n' + lines.join('\n') + '\n```',
    );
  }

  return embed;
};

export default getTurtleLogMessage;
