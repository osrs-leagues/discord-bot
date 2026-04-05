import {
  TurtleRarity,
  TURTLE_RARITY_WEIGHTS,
  getTurtleRarityName,
} from '../database/models/Turtle';
import Turtle from '../database/models/Turtle';
import { selectWeightedTurtle } from '../discord/interactions/commands/turtle';

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
});
