import {
  TurtleRarity,
  TURTLE_RARITY_WEIGHTS,
  getTurtleRarityName,
} from '../../../../database/models/Turtle';
import Turtle from '../../../../database/models/Turtle';
import { selectWeightedTurtle } from '../../../../turtles';
import getTurtleMessage from '../../../messages/turtle';
import getTurtleLogMessage from '../../../messages/turtleLog';
import editTurtleCommand from '../edit_turtle';
import addTurtleCommand from '../add_turtle';
import turtleCommand from '../turtle';
import turtleClogCommand from '../turtle_clog';
import { channelGroups } from '../../../Channel';

describe('turtle', () => {
  describe('TURTLE_RARITY_WEIGHTS', () => {
    test('all rarity categories should have correct weights', () => {
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.COMMON]).toBe(0.8835);
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.UNCOMMON]).toBe(0.1);
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.RARE]).toBe(0.0125);
      expect(TURTLE_RARITY_WEIGHTS[TurtleRarity.ULTRA_RARE]).toBe(0.004);
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

      // Two-step roll: rarity tier first, then uniform within tier.
      // Common ~88.35%, Ultra Rare ~0.4%, missing tiers fall back to full pool.
      // Common gets ~88.35% + ~5.6% fallback ≈ 94%, Ultra Rare gets ~0.4% + ~5.6% ≈ 6%
      expect(counts[1]).toBeGreaterThan(iterations * 0.88);
      expect(counts[2]).toBeGreaterThan(0);
      expect(counts[2]).toBeLessThan(iterations * 0.15);
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

      // Two-step roll: COMMON tier (88.35%) split between ids 1 & 2,
      // RARE tier (1.25%) goes to id 3, missing tiers fall back to full pool.
      // Each Common ~44% + fallback, Rare ~1.25% + fallback ≈ ~5%
      expect(counts[1]).toBeGreaterThan(iterations * 0.35);
      expect(counts[2]).toBeGreaterThan(iterations * 0.35);
      expect(counts[3]).toBeGreaterThan(0);
      expect(counts[3]).toBeLessThan(iterations * 0.1);
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
      const field = embed.fields.find((f) => f.name.startsWith('Common'));
      expect(field).toBeDefined();
      expect(field.value).toContain('✅ Shelly');
    });

    test('should show discover message for uncollected turtles', () => {
      const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Shelly')];
      const collected = new Set<number>();
      const embed = getTurtleLogMessage({ turtles, collected });
      const field = embed.fields.find((f) => f.name.startsWith('Common'));
      expect(field).toBeDefined();
      expect(field.value).toContain('... and 1 more to discover');
    });

    test('should group turtles by rarity', () => {
      const turtles = [
        makeTurtle(1, TurtleRarity.COMMON, 'Shelly'),
        makeTurtle(2, TurtleRarity.RARE, 'Spike'),
      ];
      const collected = new Set<number>();
      const embed = getTurtleLogMessage({ turtles, collected });
      const fieldNames = embed.fields.map((f) => f.name);
      expect(fieldNames).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Common'),
          expect.stringContaining('Rare'),
        ]),
      );
    });

    test('should skip rarity groups with no turtles', () => {
      const turtles = [makeTurtle(1, TurtleRarity.COMMON, 'Shelly')];
      const collected = new Set<number>();
      const embed = getTurtleLogMessage({ turtles, collected });
      expect(embed.fields).toHaveLength(1);
      expect(embed.fields[0].name).toContain('Common');
    });

    test('should show per-rarity collected count in field header', () => {
      const turtles = [
        makeTurtle(1, TurtleRarity.COMMON, 'Shelly'),
        makeTurtle(2, TurtleRarity.COMMON, 'Sandy'),
        makeTurtle(3, TurtleRarity.COMMON, 'Coral'),
      ];
      const collected = new Set([1, 3]);
      const embed = getTurtleLogMessage({ turtles, collected });
      const field = embed.fields.find((f) => f.name.startsWith('Common'));
      expect(field).toBeDefined();
      expect(field.name).toBe('Common (2/3)');
    });

    test('should display multiple turtles per line separated by pipes', () => {
      const turtles = [
        makeTurtle(1, TurtleRarity.COMMON, 'Shelly'),
        makeTurtle(2, TurtleRarity.COMMON, 'Sandy'),
        makeTurtle(3, TurtleRarity.COMMON, 'Coral'),
        makeTurtle(4, TurtleRarity.COMMON, 'Mossy'),
      ];
      const collected = new Set([1, 2, 3, 4]);
      const embed = getTurtleLogMessage({ turtles, collected });
      const field = embed.fields.find((f) => f.name.startsWith('Common'));
      expect(field).toBeDefined();
      const content = field.value.replace(/```\n?/g, '').trim();
      const lines = content.split('\n');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toContain('✅ Shelly');
      expect(lines[0]).toContain('✅ Sandy');
      expect(lines[1]).toContain('✅ Coral');
      expect(lines[1]).toContain('✅ Mossy');
    });
  });

  describe('command registration', () => {
    test('add_turtle command should be defined', () => {
      expect(addTurtleCommand.data.name).toBe('add_turtle');
    });

    test('edit_turtle command should be defined', () => {
      expect(editTurtleCommand.data.name).toBe('edit_turtle');
    });

    test('turtle command should be defined', () => {
      expect(turtleCommand.data.name).toBe('turtle');
    });

    test('turtle_clog command should be defined', () => {
      expect(turtleClogCommand.data.name).toBe('turtle_clog');
    });

    test('turtle command should not restrict channels', () => {
      expect(turtleCommand.channels).toBeUndefined();
    });

    test('turtle command should not restrict roles', () => {
      expect(turtleCommand.roles).toBeUndefined();
    });

    test('turtle command should have a 10 minute cooldown', () => {
      expect(turtleCommand.cooldown).toBeDefined();
      expect(turtleCommand.cooldown.duration).toBe(10 * 60 * 1000);
    });

    test('turtle command cooldown should exempt turtle channels', () => {
      expect(turtleCommand.cooldown.exemptChannels).toEqual(
        channelGroups.TURTLES,
      );
    });

    test('turtle_clog command should not restrict channels', () => {
      expect(turtleClogCommand.channels).toBeUndefined();
    });

    test('turtle_clog command should not restrict roles', () => {
      expect(turtleClogCommand.roles).toBeUndefined();
    });
  });
});
