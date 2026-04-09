import { TurtleRarity } from '../../../database/models/Turtle';
import getTurtleLogMessage from '../turtleLog';

const makeTurtle = (id: number, rarity: TurtleRarity, name?: string): any => ({
  id,
  rarity,
  name,
});

describe('getTurtleLogMessage', () => {
  test('should show title and collected count', () => {
    const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Pker')];
    const collected = new Set([1]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.title).toBe('🐢 Turtle Collection Log');
    expect(embed.description).toBe('Collected: **1** / **1**');
  });

  test('should show zero collected when none collected', () => {
    const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Pker')];
    const collected = new Set<number>();

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.description).toBe('Collected: **0** / **1**');
  });

  test('should group turtles by rarity into separate fields', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'Pker'),
      makeTurtle(2, TurtleRarity.RARE, 'Golden'),
    ];
    const collected = new Set([1, 2]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields).toHaveLength(2);
    expect(embed.fields[0].name).toBe('Common (1/1)');
    expect(embed.fields[1].name).toBe('Rare (1/1)');
  });

  test('should skip rarity sections with no turtles', () => {
    const turtles = [makeTurtle(1, TurtleRarity.UNCOMMON, 'Sneaky')];
    const collected = new Set([1]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields).toHaveLength(1);
    expect(embed.fields[0].name).toBe('Uncommon (1/1)');
  });

  test('should only show collected turtles in the grid', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'Pker'),
      makeTurtle(2, TurtleRarity.COMMON, 'Guard'),
    ];
    const collected = new Set([1]);

    const embed = getTurtleLogMessage({ turtles, collected });

    const value = embed.fields[0].value;
    expect(value).toContain('✅ Pker');
    expect(value).not.toContain('✅ Guard');
    expect(value).not.toContain('❓');
  });

  test('should show uncollected count message', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'Pker'),
      makeTurtle(2, TurtleRarity.COMMON, 'Guard'),
      makeTurtle(3, TurtleRarity.COMMON, 'Kebab'),
    ];
    const collected = new Set([1]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields[0].value).toContain('... and 2 more to discover');
  });

  test('should not show uncollected message when all collected', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'Pker'),
      makeTurtle(2, TurtleRarity.COMMON, 'Guard'),
    ];
    const collected = new Set([1, 2]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields[0].value).not.toContain('more to discover');
  });

  test('should fall back to Turtle #id when name is missing', () => {
    const turtles = [makeTurtle(5, TurtleRarity.COMMON)];
    const collected = new Set([5]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields[0].value).toContain('✅ Turtle #5');
  });

  test('should wrap field values in code blocks', () => {
    const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Pker')];
    const collected = new Set([1]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields[0].value).toMatch(/^```\n[\s\S]*\n```$/);
  });

  test('should arrange entries in rows of 2', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'A'),
      makeTurtle(2, TurtleRarity.COMMON, 'B'),
      makeTurtle(3, TurtleRarity.COMMON, 'C'),
    ];
    const collected = new Set([1, 2, 3]);

    const embed = getTurtleLogMessage({ turtles, collected });

    const content = embed.fields[0].value.replace(/```\n?/g, '').trim();
    const lines = content.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('✅ A');
    expect(lines[0]).toContain('✅ B');
    expect(lines[1]).toBe('✅ C');
  });

  test('should pad columns to align entries', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'Short'),
      makeTurtle(2, TurtleRarity.COMMON, 'B'),
      makeTurtle(3, TurtleRarity.COMMON, 'Much Longer Name'),
      makeTurtle(4, TurtleRarity.COMMON, 'E'),
    ];
    const collected = new Set([1, 2, 3, 4]);

    const embed = getTurtleLogMessage({ turtles, collected });

    const content = embed.fields[0].value.replace(/```\n?/g, '').trim();
    const lines = content.split('\n');
    const row1Cols = lines[0].split(' | ');
    const row2Cols = lines[1].split(' | ');
    expect(row1Cols[0].length).toBe(row2Cols[0].length);
  });

  test('should not pad the last column in a row', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.COMMON, 'A'),
      makeTurtle(2, TurtleRarity.COMMON, 'Short'),
      makeTurtle(3, TurtleRarity.COMMON, 'D'),
      makeTurtle(4, TurtleRarity.COMMON, 'Much Longer Name'),
    ];
    const collected = new Set([1, 2, 3, 4]);

    const embed = getTurtleLogMessage({ turtles, collected });

    const content = embed.fields[0].value.replace(/```\n?/g, '').trim();
    const lines = content.split('\n');
    const row1LastCol = lines[0].split(' | ').pop();
    const row2LastCol = lines[1].split(' | ').pop();
    expect(row1LastCol.length).not.toBe(row2LastCol.length);
  });

  test('should show rarity collected counts', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.RARE, 'Golden'),
      makeTurtle(2, TurtleRarity.RARE, 'Silver'),
      makeTurtle(3, TurtleRarity.RARE, 'Bronze'),
    ];
    const collected = new Set([1, 3]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields[0].name).toBe('Rare (2/3)');
  });

  test('should handle empty turtles array', () => {
    const embed = getTurtleLogMessage({
      turtles: [],
      collected: new Set(),
    });

    expect(embed.title).toBe('🐢 Turtle Collection Log');
    expect(embed.description).toBe('Collected: **0** / **0**');
    expect(embed.fields).toHaveLength(0);
  });

  test('should order rarity sections as Common, Uncommon, Rare, Ultra Rare', () => {
    const turtles = [
      makeTurtle(1, TurtleRarity.ULTRA_RARE, 'Mythic'),
      makeTurtle(2, TurtleRarity.COMMON, 'Basic'),
      makeTurtle(3, TurtleRarity.RARE, 'Golden'),
      makeTurtle(4, TurtleRarity.UNCOMMON, 'Sneaky'),
    ];
    const collected = new Set([1, 2, 3, 4]);

    const embed = getTurtleLogMessage({ turtles, collected });

    expect(embed.fields[0].name).toContain('Common');
    expect(embed.fields[1].name).toContain('Uncommon');
    expect(embed.fields[2].name).toContain('Rare');
    expect(embed.fields[3].name).toContain('Ultra Rare');
  });
});
