import {
  TurtleRarity,
  TURTLE_RARITY_WEIGHTS,
  getTurtleRarityName,
} from '../../../../database/models/Turtle';
import Turtle from '../../../../database/models/Turtle';
import { selectWeightedTurtle } from '../turtle';
import getTurtleMessage from '../../../messages/turtle';
import getTurtleLogMessage from '../../../messages/turtleLog';

describe('turtle', () => {
  describe('TURTLE_RARITY_WEIGHTS', () => {
    test('all rarity categories should have correct weights', () => {
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.COMMON]).toBe(1);
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.UNCOMMON]).toBe(1 / 10);
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.RARE]).toBe(1 / 100);
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.ULTRA_RARE]).toBe(1 / 500);
    });
  });

  describe('getTurtleRarityName', () => {
    test('should return display names for all rarities', () => {
      expect(getTurtleRarityName(TurtleRarity.COMMON)).toBe('Common');
      expect(getTurtleRarityName(TurtleRarity.UNCOMMON)).toBe('Uncommon');
      expect(getTurtleRarityName(TurtleRarity.RARE)).toBe('Rare');
      expect(getTurtleRarityName(TurtleRarity.ULTRA_RARE)).toBe('Ultra Rare');
    });
  });

  describe('selectWeightedTurtle', () => {
    const makeTurtle = (id: number, rarity: TurtleRarity) =>
      // @ts-ignore
      ({ id, rarity } as Turtle);

    test('should return the only turtle when there is one', () => {
      const turtles = [makeTurtle(1, TurtleRarity.COMMON)];
      const result = selectWeightedTurtle(turtles);
      expect(result.id).toBe(1);
    });

    test('should select turtles respecting relative probabilities', () => {
      const common = makeTurtle(1, TurtleRarity.COMMON);
      const ultraRare = makeTurtle(2, TurtleRarity.ULTRA_RARE);
      const turtles = [common, ultraRare];

      const counts: Record<number, number> = { 1: 0, 2: 0 };
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const result = selectWeightedTurtle(turtles);
        counts[result.id]++;
      }

      // Common weight = 1, Ultra Rare weight = 0.002
      // Expected: Common ~99.8%, Ultra Rare ~0.2%
      expect(counts[1]).toBeGreaterThan(iterations * 0.95);
      expect(counts[2]).toBeGreaterThan(0);
      expect(counts[2]).toBeLessThan(iterations * 0.05);
    });

    test('should select from multiple turtles of different rarities', () => {
      const turtles = [
        makeTurtle(1, TurtleRarity.COMMON),
        makeTurtle(2, TurtleRarity.COMMON),
        makeTurtle(3, TurtleRarity.RARE),
      ];

      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const result = selectWeightedTurtle(turtles);
        counts[result.id]++;
      }

      // Each Common weight = 1, Rare weight = 0.01
      // Commons should each be ~49.75%, Rare ~0.5%
      expect(counts[1]).toBeGreaterThan(iterations * 0.4);
      expect(counts[2]).toBeGreaterThan(iterations * 0.4);
      expect(counts[3]).toBeGreaterThan(0);
      expect(counts[3]).toBeLessThan(iterations * 0.05);
    });
  });

  describe('getTurtleMessage', () => {
    const makeTurtle = (overrides: Partial<Turtle>) =>
      ({
        id: 1,
        rarity: TurtleRarity.COMMON,
        image_url: 'https://example.com/turtle.png',
        ...overrides,
      } as Turtle);

    test('should show named title when turtle has a name', () => {
      const turtle = makeTurtle({ name: 'Shelly' });
      const embed = getTurtleMessage({ turtle });
      expect(embed.title).toBe('You found a Shelly turtle!');
    });

    test('should show generic title when turtle has no name', () => {
      const turtle = makeTurtle({ name: undefined });
      const embed = getTurtleMessage({ turtle });
      expect(embed.title).toBe('You found a turtle!');
    });

    test('should include rarity in description', () => {
      const turtle = makeTurtle({ rarity: TurtleRarity.RARE });
      const embed = getTurtleMessage({ turtle });
      expect(embed.description).toContain('Rare');
    });

    test('should set image from turtle image_url', () => {
      const turtle = makeTurtle({
        image_url: 'https://example.com/shelly.png',
      });
      const embed = getTurtleMessage({ turtle });
      expect(embed.image.url).toBe('https://example.com/shelly.png');
    });

    test('should show new discovery tag when isNewDiscovery is true', () => {
      const turtle = makeTurtle({ name: 'Shelly' });
      const embed = getTurtleMessage({ turtle, isNewDiscovery: true });
      expect(embed.description).toContain('New Discovery');
    });

    test('should not show new discovery tag when isNewDiscovery is false', () => {
      const turtle = makeTurtle({ name: 'Shelly' });
      const embed = getTurtleMessage({ turtle, isNewDiscovery: false });
      expect(embed.description).not.toContain('New Discovery');
    });

    test('should not show new discovery tag when isNewDiscovery is undefined', () => {
      const turtle = makeTurtle({ name: 'Shelly' });
      const embed = getTurtleMessage({ turtle });
      expect(embed.description).not.toContain('New Discovery');
    });
  });

  describe('getTurtleLogMessage', () => {
    const makeTurtle = (id: number, rarity: TurtleRarity, name?: string) =>
      // @ts-ignore
      ({ id, rarity, name } as Turtle);

    test('should show collected count', () => {
      const turtles = [
        makeTurtle(1, TurtleRarity.COMMON, 'Shelly'),
        makeTurtle(2, TurtleRarity.RARE, 'Spike'),
      ];
      const collected = new Set([1]);
      const embed = getTurtleLogMessage({ turtles, collected });
      expect(embed.description).toContain('1');
      expect(embed.description).toContain('2');
    });

    test('should show checkmark for collected turtles', () => {
      const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Shelly')];
      const collected = new Set([1]);
      const embed = getTurtleLogMessage({ turtles, collected });
      const field = embed.fields.find((f) => f.name === 'Common');
      expect(field.value).toContain('✅ Shelly');
    });

    test('should show question mark for uncollected turtles', () => {
      const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Shelly')];
      const collected = new Set<number>();
      const embed = getTurtleLogMessage({ turtles, collected });
      const field = embed.fields.find((f) => f.name === 'Common');
      expect(field.value).toContain('❓ ???');
    });

    test('should group turtles by rarity', () => {
      const turtles = [
        makeTurtle(1, TurtleRarity.COMMON, 'Shelly'),
        makeTurtle(2, TurtleRarity.RARE, 'Spike'),
      ];
      const collected = new Set<number>();
      const embed = getTurtleLogMessage({ turtles, collected });
      const fieldNames = embed.fields.map((f) => f.name);
      expect(fieldNames).toContain('Common');
      expect(fieldNames).toContain('Rare');
    });

    test('should skip rarity groups with no turtles', () => {
      const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Shelly')];
      const collected = new Set<number>();
      const embed = getTurtleLogMessage({ turtles, collected });
      expect(embed.fields).toHaveLength(1);
      expect(embed.fields[0].name).toBe('Common');
    });
  });
});
