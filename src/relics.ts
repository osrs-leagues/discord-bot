const EARLY_TIER_RELICS = [
  ['Power Miner', 'Lumberjack', 'Animal Wrangler'],
  ['Friendly Forager', 'Corner Cutter', 'Dodgy Deals'],
  ["Fairy's Flight", 'Bank Heist', 'Clue Compass'],
];

export const RELICS = [
  ...EARLY_TIER_RELICS,
  ['Golden God', 'Reloaded', 'Equilibrium'],
  ['Treasure Arbiter', 'Production Master', 'Slayer Master'],
  ['Total Recall', "Banker's Note"],
  ['Pocket Kingdom', 'Grimoire', 'Overgrown'],
  ['Last Stand', 'Guardian', 'Specialist'],
];

/**
 * Get 8 random relics.
 * @returns {string[]} - An array of 8 random relics.
 */
export function getRandomRelics(): string[] {
  const randomRelics: string[] = [];
  for (const tier of RELICS) {
    randomRelics.push(tier[Math.floor(Math.random() * tier.length)]);
  }

  if (randomRelics[3] === 'Reloaded') {
    const randomTier = Math.floor(Math.random() * 2);
    const elibleEarlyTierRelics = getElibleEarlyTierRelics(randomRelics);
    const randomRelicIndex = Math.floor(
      Math.random() * elibleEarlyTierRelics[randomTier].length,
    );
    randomRelics[3] = elibleEarlyTierRelics[randomTier][randomRelicIndex];
  }

  return randomRelics;
}

/**
 * Get the relics that are not already selected.
 * @param selectedRelics The relics that are already selected.
 * @returns The relics that are not already selected.
 */
export function getElibleEarlyTierRelics(selectedRelics: string[]): string[][] {
  const eligibleEarlyTierRelics: string[][] = [];
  for (const tier of EARLY_TIER_RELICS) {
    const eligibleRelics = tier.filter(
      (relic) => !selectedRelics.includes(relic),
    );
    eligibleEarlyTierRelics.push(eligibleRelics);
  }

  return eligibleEarlyTierRelics;
}

/**
 * Get the emoji name for a relic.
 * @param relic The name of the relic.
 * @returns The emoji name for the relic.
 */
export function getRelicEmoji(relic: string): string {
  return `echo${relic.replace(/[^a-zA-Z]/g, '').toLowerCase()}`;
}
