import Turtle, {
  TurtleRarity,
  TURTLE_RARITY_WEIGHTS,
} from '../database/models/Turtle';
import {
  turtleCache,
  loadTurtleCache,
  getTurtleByUuid,
  selectWeightedTurtle,
  addTurtle,
  editTurtle,
  removeTurtle,
  recordTurtleDiscovery,
  getCollectedTurtleIds,
} from '../turtles';

describe('turtles cache', () => {
  beforeAll(async () => {
    await loadTurtleCache();
  });

  describe('loadTurtleCache', () => {
    test('should populate turtleCache.turtles', () => {
      expect(Array.isArray(turtleCache.turtles)).toBe(true);
    });

    test('should build uuidMap from turtles', () => {
      expect(turtleCache.uuidMap).toBeInstanceOf(Map);
      expect(turtleCache.uuidMap.size).toBe(turtleCache.turtles.length);
    });

    test('should compute totalWeight', () => {
      let expected = 0;
      for (const turtle of turtleCache.turtles) {
        expected += TURTLE_RARITY_WEIGHTS[turtle.rarity];
      }
      expect(turtleCache.totalWeight).toBeCloseTo(expected);
    });
  });

  describe('addTurtle', () => {
    let added: Turtle;

    test('should create turtle and add to cache', async () => {
      const before = turtleCache.turtles.length;
      added = await addTurtle({
        image_url: 'https://example.com/cache-test.png',
        rarity: TurtleRarity.UNCOMMON,
        name: 'CacheTest',
        added_by: 'tester',
      });

      expect(added.uuid).toBeDefined();
      expect(turtleCache.turtles.length).toBe(before + 1);
      expect(turtleCache.uuidMap.get(added.uuid)).toBe(added);
    });

    test('should update totalWeight after add', () => {
      let expected = 0;
      for (const t of turtleCache.turtles) {
        expected += TURTLE_RARITY_WEIGHTS[t.rarity];
      }
      expect(turtleCache.totalWeight).toBeCloseTo(expected);
    });
  });

  describe('getTurtleByUuid', () => {
    test('should return turtle for valid uuid', async () => {
      const turtle = await addTurtle({
        image_url: 'https://example.com/lookup.png',
        rarity: TurtleRarity.COMMON,
        name: 'Lookup',
      });
      expect(getTurtleByUuid(turtle.uuid)).toBe(turtle);
    });

    test('should return undefined for unknown uuid', () => {
      expect(getTurtleByUuid('nonexistent-uuid')).toBeUndefined();
    });
  });

  describe('editTurtle', () => {
    test('should update turtle fields and cache', async () => {
      const turtle = await addTurtle({
        image_url: 'https://example.com/edit.png',
        rarity: TurtleRarity.COMMON,
        name: 'BeforeEdit',
      });

      const updated = await editTurtle(turtle.uuid, {
        name: 'AfterEdit',
        rarity: TurtleRarity.RARE,
      });

      expect(updated.name).toBe('AfterEdit');
      expect(updated.rarity).toBe(TurtleRarity.RARE);
      expect(getTurtleByUuid(turtle.uuid).name).toBe('AfterEdit');
    });

    test('should return undefined for unknown uuid', async () => {
      const result = await editTurtle('nonexistent', { name: 'Nope' });
      expect(result).toBeUndefined();
    });

    test('should recalculate totalWeight after rarity change', async () => {
      const turtle = await addTurtle({
        image_url: 'https://example.com/weight.png',
        rarity: TurtleRarity.COMMON,
      });

      const weightBefore = turtleCache.totalWeight;
      await editTurtle(turtle.uuid, { rarity: TurtleRarity.ULTRA_RARE });

      const expectedDelta =
        TURTLE_RARITY_WEIGHTS[TurtleRarity.ULTRA_RARE] -
        TURTLE_RARITY_WEIGHTS[TurtleRarity.COMMON];
      expect(turtleCache.totalWeight).toBeCloseTo(weightBefore + expectedDelta);
    });
  });

  describe('removeTurtle', () => {
    test('should remove turtle from cache', async () => {
      const turtle = await addTurtle({
        image_url: 'https://example.com/remove.png',
        rarity: TurtleRarity.COMMON,
        name: 'ToRemove',
      });
      const sizeBefore = turtleCache.turtles.length;

      const removed = await removeTurtle(turtle.uuid);

      expect(removed.uuid).toBe(turtle.uuid);
      expect(turtleCache.turtles.length).toBe(sizeBefore - 1);
      expect(getTurtleByUuid(turtle.uuid)).toBeUndefined();
    });

    test('should return undefined for unknown uuid', async () => {
      const result = await removeTurtle('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('selectWeightedTurtle', () => {
    test('should return a turtle from the array', () => {
      const turtles = turtleCache.turtles;
      if (turtles.length > 0) {
        const result = selectWeightedTurtle(turtles);
        expect(turtles).toContain(result);
      }
    });

    test('should throw when given an empty array', () => {
      expect(() => selectWeightedTurtle([])).toThrow(
        'Cannot select from an empty turtle array',
      );
    });
  });

  describe('collection cache', () => {
    let testTurtle: Turtle;

    beforeAll(async () => {
      testTurtle = await addTurtle({
        image_url: 'https://example.com/coll.png',
        rarity: TurtleRarity.COMMON,
        name: 'CollTest',
      });
    });

    test('recordTurtleDiscovery should return true for new discovery', async () => {
      const result = await recordTurtleDiscovery('cache-user-1', testTurtle.id);
      expect(result).toBe(true);
    });

    test('recordTurtleDiscovery should return false for duplicate', async () => {
      const result = await recordTurtleDiscovery('cache-user-1', testTurtle.id);
      expect(result).toBe(false);
    });

    test('getCollectedTurtleIds should return collected set', async () => {
      const collected = await getCollectedTurtleIds('cache-user-1');
      expect(collected.has(testTurtle.id)).toBe(true);
    });

    test('getCollectedTurtleIds should return empty set for new user', async () => {
      const collected = await getCollectedTurtleIds('cache-user-new');
      expect(collected.size).toBe(0);
    });
  });
});
