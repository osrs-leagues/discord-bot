import {
  Challenge,
  ChallengeCard,
  ChallengeCardStatus,
  ChallengeDifficulty,
  DiscordUser,
  Region,
} from './database';

type ChallengeCache = {
  challenges: Challenge[];
  regions: Region[];
  regionNameMap: Record<number, string>;
};

export const challengeCache: ChallengeCache = {
  challenges: [],
  regions: [],
  regionNameMap: {},
};

export const loadChallengeCache = async () => {
  challengeCache.challenges = await Challenge.findAll();
  challengeCache.regions = await Region.findAll();
  challengeCache.regions.forEach((region) => {
    challengeCache.regionNameMap[region.id] = region.name;
  });
  console.info(
    'Challenge cache loaded:',
    challengeCache.challenges.length,
    challengeCache.regions.length,
  );
};

/**
 * // Counts the number of region roles the user has for challenge eligibility
 * @param userRoles - Discord roles the user has.
 * @returns - Number of region roles the user has.
 */
export function getRegionRoleCount(userRoles: string[]): number {
  const regionRoles = challengeCache.regions.map((region) => region.name);
  return userRoles.filter((role) => regionRoles.includes(role)).length;
}

/**
 * Counts the number of region roles required to generate a new challenge card at the given difficulty.
 * @param difficulty - The difficulty tier.
 * @returns - The number of roles required.
 */
export function getChallengeCardEligibility(
  difficulty: ChallengeDifficulty,
): number {
  return difficulty === ChallengeDifficulty.NOVICE
    ? 1
    : difficulty === ChallengeDifficulty.INTERMEDIATE
    ? 2
    : 3; // Experienced, Master, and Grandmaster require 3
}

/**
 * Loads the ChallengeMain record for a given user.
 * @param userId - The user's ID.
 * @returns The ChallengeCard record or null if not found.
 */
export async function loadChallengeCard(
  userId: string,
): Promise<ChallengeCard | null> {
  return await ChallengeCard.findOne({
    where: {
      discordUserId: userId,
    },
    order: [['difficulty', 'DESC']],
    limit: 1,
  });
}

/**
 * Loads the ChallengeCard record for a given user with a specific status.
 * @param userId The user's ID.
 * @param status The status of the challenge card.
 * @returns The ChallengeCard record or null if not found.
 */
export async function loadChallengeCardByStatus(
  userId: string,
  difficulty: ChallengeDifficulty,
  status: ChallengeCardStatus,
): Promise<ChallengeCard | null> {
  return await ChallengeCard.findOne({
    where: {
      discordUserId: userId,
      difficulty,
      status,
    },
    order: [['difficulty', 'DESC']],
    limit: 1,
  });
}

/**
 * Saves or updates the ChallengeCard for a user.
 * @param difficulty - The difficulty tier.
 * @param userId - The user's ID.
 * @param challenges - An array of challenge descriptions.
 */
export async function updateChallengeCard(
  challengeCard: ChallengeCard,
  challenges: Challenge[],
  rerollsRemaining: number,
  rerolled: boolean,
): Promise<void> {
  const challengeOne = challenges[0];
  const challengeTwo = challenges[1];
  const challengeThree = challenges[2];
  let challengeFour = undefined;
  let challengeFive = undefined;

  if (
    challengeCard.difficulty === ChallengeDifficulty.EXPERIENCED ||
    challengeCard.difficulty === ChallengeDifficulty.MASTER
  ) {
    challengeFour = challenges[3];
  } else if (challengeCard.difficulty === ChallengeDifficulty.GRANDMASTER) {
    challengeFour = challenges[3];
    challengeFive = challenges[4];
  }

  // Update the challenge card (create or update)
  await challengeCard.update({
    challengeOneId: challengeOne.id,
    challengeTwoId: challengeTwo.id,
    challengeThreeId: challengeThree.id,
    challengeFourId: challengeFour?.id,
    challengeFiveId: challengeFive?.id,
    rerollsRemaining: rerollsRemaining,
    rerolled: rerolled,
  });
}

/**
 * Saves or updates the ChallengeCard for a user.
 * @param difficulty - The difficulty tier.
 * @param userId - The user's ID.
 * @param challenges - An array of challenge descriptions.
 * @param rerollsRemaining - Amount of rerolls remaining.
 */
export async function createChallengeCard(
  userId: string,
  difficulty: ChallengeDifficulty,
  challenges: Challenge[],
  rerollsRemaining: number,
): Promise<ChallengeCard> {
  const challengeOne = challenges[0];
  const challengeTwo = challenges[1];
  const challengeThree = challenges[2];
  let challengeFour = undefined;
  let challengeFive = undefined;

  if (
    difficulty === ChallengeDifficulty.EXPERIENCED ||
    difficulty === ChallengeDifficulty.MASTER
  ) {
    challengeFour = challenges[3];
  } else if (difficulty === ChallengeDifficulty.GRANDMASTER) {
    challengeFour = challenges[3];
    challengeFive = challenges[4];
  }

  let discordUser = await DiscordUser.findByPk(userId);
  if (!discordUser) {
    discordUser = await DiscordUser.create({ user_id: userId });
  }

  // Upsert the challenge card (create or update)
  const results = await ChallengeCard.create({
    discordUserId: discordUser.user_id,
    difficulty: difficulty,
    challengeOneId: challengeOne.id,
    challengeTwoId: challengeTwo.id,
    challengeThreeId: challengeThree.id,
    challengeFourId: challengeFour?.id,
    challengeFiveId: challengeFive?.id,
    rerollsRemaining: rerollsRemaining,
  });
  return results;
}

export async function verifyCardChallenges(
  challengeCard: ChallengeCard,
  userRoles: string[],
): Promise<void> {
  const excludedTasksIds = challengeCard.getChallengeIds();
  const challengeCount = getChallengeCount(challengeCard.difficulty);
  if (excludedTasksIds.length !== challengeCount) {
    const challenges = excludedTasksIds.map((id) =>
      challengeCache.challenges.find((c) => c.id === id),
    );
    const newChallenges = generateNewChallenges(
      challengeCard.difficulty,
      userRoles,
      excludedTasksIds,
    ).filter((challenge) => !excludedTasksIds.includes(challenge.id));
    const updatedChallenges = challenges.map((challenge) => {
      if (!challenge) {
        return newChallenges.pop();
      }
      return challenge;
    });
    if (updatedChallenges.length < challengeCount) {
      console.error(
        `Not enough challenges to update card: ${challengeCard.id}. Difficulty: ${challengeCard.difficulty}`,
      );
    }
    await updateChallengeCard(
      challengeCard,
      updatedChallenges,
      challengeCard.rerollsRemaining,
      challengeCard.rerolled,
    );
  }
}

/**
 * Creates a new challenge in the database.
 * @param description - The challenge description.
 * @param difficulty - The difficulty tier.
 * @param regionOneId - The first region ID.
 * @param regionTwoId - The second region ID.
 * @returns The newly created challenge.
 */
export async function createChallenge(
  description: string,
  difficulty: ChallengeDifficulty,
  regionOneId?: number,
  regionTwoId?: number,
): Promise<Challenge> {
  const challenge = await Challenge.create({
    description,
    difficulty,
    regionOneId,
    regionTwoId,
  });
  challengeCache.challenges.push(challenge);
  return challenge;
}

/**
 * Deletes a challenge from the database.
 * @param challengeId - The ID of the challenge to delete.
 */
export async function deleteChallenge(challenge: Challenge): Promise<void> {
  await challenge.destroy();
  challengeCache.challenges = challengeCache.challenges.filter(
    (c) => c.id !== challenge.id,
  );
}

/**
 * Updates a challenge in the database.
 * @param description - The new description.
 * @param challenge - The challenge to update.
 * @returns The updated challenge.
 */
export async function updateChallenge(
  challenge: Challenge,
  description: string,
): Promise<Challenge> {
  const updatedChallenge = await challenge.update({ description });
  challengeCache.challenges = challengeCache.challenges.map((c) =>
    c.id === updatedChallenge.id ? updatedChallenge : c,
  );
  return updatedChallenge;
}

export function existingChallengesToList(
  existingChallenges: ChallengeCard,
  difficulty: ChallengeDifficulty,
): Challenge[] {
  const challengeIdList: number[] = [];
  challengeIdList[0] = existingChallenges.challengeOneId;
  challengeIdList[1] = existingChallenges.challengeTwoId;
  challengeIdList[2] = existingChallenges.challengeThreeId;

  if (
    difficulty === ChallengeDifficulty.EXPERIENCED ||
    difficulty === ChallengeDifficulty.MASTER
  ) {
    challengeIdList[3] = existingChallenges.challengeFourId;
  } else if (difficulty === ChallengeDifficulty.GRANDMASTER) {
    challengeIdList[3] = existingChallenges.challengeFourId;
    challengeIdList[4] = existingChallenges.challengeFiveId;
  }

  return challengeIdList.map((id) =>
    challengeCache.challenges.find((c) => c.id === id),
  );
}

/**
 * Determines the next difficulty tier.
 * @param currentTier - The current difficulty tier.
 * @returns The next difficulty tier.
 */
export function getNextDifficultyTier(
  currentTier: ChallengeDifficulty,
): ChallengeDifficulty {
  const nextTier = currentTier + 1;
  return currentTier >= ChallengeDifficulty.GRANDMASTER
    ? ChallengeDifficulty.GRANDMASTER
    : nextTier;
}

/**
 * Generates new challenges based on difficulty and user roles.
 * @param difficulty - The difficulty tier.
 * @param userRoles - An array of user's role names.
 * @returns An array of newly generated challenge descriptions.
 */
export function generateNewChallenges(
  difficulty: ChallengeDifficulty,
  userRoles: string[],
  excludedChallengeIds: number[] = [],
): Challenge[] {
  const eligibleChallenges = getEligibleChallenges(
    difficulty,
    userRoles,
    excludedChallengeIds,
  );
  const challengeCount = getChallengeCount(difficulty);
  if (eligibleChallenges.length === challengeCount) {
    return eligibleChallenges;
  }
  return getRandomChallenges(eligibleChallenges, getChallengeCount(difficulty));
}

/**
 * Retrieves eligible challenges based on difficulty and user roles.
 * @param difficulty - The difficulty tier.
 * @param userRoles - An array of user's role names.
 * @returns An array of eligible challenge descriptions.
 */
const getEligibleChallenges = (
  difficulty: ChallengeDifficulty,
  userRoles: string[],
  excludedChallengeIds: number[] = [],
): Challenge[] => {
  let eligibleChallenges = challengeCache.challenges.filter((challenge) => {
    if (excludedChallengeIds.includes(challenge.id)) {
      return false;
    }
    const regionOneName = challengeCache.regionNameMap[challenge.regionOneId];
    const regionTwoName = challengeCache.regionNameMap[challenge.regionTwoId];
    if (challenge.difficulty !== difficulty) {
      return false;
    }
    if (regionOneName === 'General') {
      return true;
    }
    if (regionTwoName) {
      return (
        userRoles.includes(regionOneName) && userRoles.includes(regionTwoName)
      );
    }
    return userRoles.includes(regionOneName);
  });

  const challengeCount = getChallengeCount(difficulty);
  if (
    excludedChallengeIds.length > 0 &&
    eligibleChallenges.length < challengeCount
  ) {
    const excludedChallenges = challengeCache.challenges.filter((challenge) =>
      excludedChallengeIds.includes(challenge.id),
    );
    const randomlySelectedExcludedChallenges = getRandomChallenges(
      excludedChallenges,
      challengeCount - eligibleChallenges.length,
    );
    eligibleChallenges = eligibleChallenges.concat(
      randomlySelectedExcludedChallenges,
    );
  }

  return eligibleChallenges;
};

/**
 * Shuffles and selects a random subset of challenges.
 * @param challenges - An array of challenge descriptions.
 * @param count - Number of challenges to select.
 * @returns An array of selected challenge descriptions.
 */
function getRandomChallenges(
  challenges: Challenge[],
  count: number,
): Challenge[] {
  const shuffled = challenges.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Select 3 random regions from the cache.
 * @returns An array of 3 random regions.
 */
export function getRandomRegions() {
  const filteredRegions = challengeCache.regions.filter(
    (region) =>
      region.name !== 'General' &&
      region.name !== 'Karamja' &&
      region.name !== 'Misthalin',
  );
  const shuffled = filteredRegions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

/**
 * Determines the number of challenges based on difficulty.
 * @param difficulty - The difficulty tier.
 * @returns The number of challenges.
 */
export function getChallengeCount(difficulty: ChallengeDifficulty): number {
  switch (difficulty) {
    case ChallengeDifficulty.NOVICE:
    case ChallengeDifficulty.INTERMEDIATE:
      return 3;
    case ChallengeDifficulty.EXPERIENCED:
    case ChallengeDifficulty.MASTER:
      return 4;
    case ChallengeDifficulty.GRANDMASTER:
      return 5;
    default:
      return 3;
  }
}

/**
 * Get the name of the difficulty tier.
 * @param difficulty The difficulty tier.
 * @returns
 */
export function getDifficultyName(difficulty: ChallengeDifficulty): string {
  switch (difficulty) {
    case ChallengeDifficulty.NOVICE:
      return 'Novice';
    case ChallengeDifficulty.INTERMEDIATE:
      return 'Intermediate';
    case ChallengeDifficulty.EXPERIENCED:
      return 'Experienced';
    case ChallengeDifficulty.MASTER:
      return 'Master';
    case ChallengeDifficulty.GRANDMASTER:
      return 'Grandmaster';
    default:
      return 'Unknown';
  }
}

/**
 * Determines the embed color based on difficulty.
 * @param difficulty - The difficulty tier.
 * @returns The color code.
 */
export function getEmbedColour(difficulty: ChallengeDifficulty): number {
  switch (difficulty) {
    case ChallengeDifficulty.NOVICE:
      return 0x00ff00; // Green
    case ChallengeDifficulty.INTERMEDIATE:
      return 0xffff00; // Yellow
    case ChallengeDifficulty.EXPERIENCED:
      return 0xffa500; // Orange
    case ChallengeDifficulty.MASTER:
      return 0xff0000; // Red
    case ChallengeDifficulty.GRANDMASTER:
      return 0x800080; // Purple
    default:
      return 0x00ff00; // Default to green
  }
}
