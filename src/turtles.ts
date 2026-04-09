import Turtle, {
  TurtleRarity,
  TURTLE_RARITY_WEIGHTS,
} from './database/models/Turtle';
import TurtleCollection from './database/models/TurtleCollection';

type TurtleCache = {
  turtles: Turtle[];
  uuidMap: Map<string, Turtle>;
  totalWeight: number;
};

export const turtleCache: TurtleCache = {
  turtles: [],
  uuidMap: new Map(),
  totalWeight: 0,
};

const COLLECTION_EVICTION_MS = 30 * 60 * 1000;

/** userId → Set of collected turtle IDs */
const collectionCache = new Map<string, Set<number>>();
/** userId → eviction timer handle */
const collectionTimers = new Map<string, ReturnType<typeof setTimeout>>();

const rollRarity = (): TurtleRarity => {
  const roll = Math.random();

  let cumulative = 0;
  for (const rarity of Object.values(TurtleRarity)) {
    cumulative += TURTLE_RARITY_WEIGHTS[rarity];
    if (roll <= cumulative) {
      return rarity;
    }
  }

  return TurtleRarity.COMMON; // fallback
};

const rebuildUuidMap = (turtles: Turtle[]): Map<string, Turtle> => {
  const map = new Map<string, Turtle>();
  for (const turtle of turtles) {
    map.set(turtle.uuid, turtle);
  }
  return map;
};

const refreshCollectionTimer = (userId: string) => {
  const existing = collectionTimers.get(userId);
  if (existing) clearTimeout(existing);
  collectionTimers.set(
    userId,
    setTimeout(() => {
      collectionCache.delete(userId);
      collectionTimers.delete(userId);
    }, COLLECTION_EVICTION_MS),
  );
};

export const loadTurtleCache = async () => {
  turtleCache.turtles = await Turtle.findAll();
  turtleCache.uuidMap = rebuildUuidMap(turtleCache.turtles);
  //turtleCache.totalWeight = turtle(turtleCache.turtles);
  console.info('Turtle cache loaded:', turtleCache.turtles.length);
};

export const getTurtleByUuid = (uuid: string): Turtle | undefined => {
  return turtleCache.uuidMap.get(uuid);
};

export const selectWeightedTurtle = (turtles: Turtle[]): Turtle => {
  if (turtles.length === 0) {
    throw new Error('Cannot select from an empty turtle array');
  }

  const rarity = rollRarity();

  const filtered = turtles.filter((t) => t.rarity === rarity);

  // fallback if somehow none exist
  const pool = filtered.length > 0 ? filtered : turtles;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};

type AddTurtleParams = {
  image_url: string;
  rarity: TurtleRarity;
  name?: string;
  added_by?: string;
};

export const addTurtle = async (params: AddTurtleParams): Promise<Turtle> => {
  const turtle = await Turtle.create(params);
  turtleCache.turtles.push(turtle);
  turtleCache.uuidMap.set(turtle.uuid, turtle);
  turtleCache.totalWeight += TURTLE_RARITY_WEIGHTS[turtle.rarity];
  return turtle;
};

type EditTurtleParams = {
  image_url?: string;
  rarity?: TurtleRarity;
  name?: string;
};

export const editTurtle = async (
  uuid: string,
  updates: EditTurtleParams,
): Promise<Turtle | undefined> => {
  const turtle = turtleCache.uuidMap.get(uuid);
  if (!turtle) return undefined;

  const oldWeight = TURTLE_RARITY_WEIGHTS[turtle.rarity];

  if (updates.image_url) turtle.image_url = updates.image_url;
  if (updates.rarity) turtle.rarity = updates.rarity;
  if (updates.name) turtle.name = updates.name;

  await turtle.save();

  turtleCache.turtles = turtleCache.turtles.map((t) =>
    t.uuid === uuid ? turtle : t,
  );
  turtleCache.uuidMap.set(uuid, turtle);
  turtleCache.totalWeight =
    turtleCache.totalWeight - oldWeight + TURTLE_RARITY_WEIGHTS[turtle.rarity];

  return turtle;
};

export const removeTurtle = async (
  uuid: string,
): Promise<Turtle | undefined> => {
  const turtle = turtleCache.uuidMap.get(uuid);
  if (!turtle) return undefined;

  await TurtleCollection.destroy({ where: { turtle_id: turtle.id } });
  await turtle.destroy();

  turtleCache.turtles = turtleCache.turtles.filter((t) => t.uuid !== uuid);
  turtleCache.uuidMap.delete(uuid);
  turtleCache.totalWeight -= TURTLE_RARITY_WEIGHTS[turtle.rarity];

  // Evict from all user collection caches
  for (const collected of collectionCache.values()) {
    collected.delete(turtle.id);
  }

  return turtle;
};

const getUserCollection = async (userId: string): Promise<Set<number>> => {
  const cached = collectionCache.get(userId);

  if (cached !== undefined) {
    refreshCollectionTimer(userId);
    return cached;
  }

  const entries = await TurtleCollection.findAll({
    where: { user_id: userId },
  });

  const set = new Set(entries.map((e) => Number(e.turtle_id)));
  collectionCache.set(userId, set);
  refreshCollectionTimer(userId);

  return set;
};

export const recordTurtleDiscovery = async (
  userId: string,
  turtleId: number,
): Promise<boolean> => {
  const collected = await getUserCollection(userId);
  if (collected.has(turtleId)) {
    return false;
  }

  collected.add(turtleId);
  TurtleCollection.create({ user_id: userId, turtle_id: turtleId }).catch(
    (err) => console.error(`Failed to persist turtle discovery: ${err}`),
  );
  return true;
};

export const getCollectedTurtleIds = async (
  userId: string,
): Promise<Set<number>> => {
  return getUserCollection(userId);
};
