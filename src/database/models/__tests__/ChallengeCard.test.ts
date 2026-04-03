import { challengeCache } from '../../../challenges';
import { ChallengeDifficulty } from '../Challenge';
import ChallengeCard, { ChallengeCardStatus } from '../Challenge/ChallengeCard';

describe('ChallengeCard', () => {
  let noviceChallengeCard: ChallengeCard;
  let masterChallengeCard: ChallengeCard;
  let noviceChallenges: typeof challengeCache.challenges;
  let masterChallenges: typeof challengeCache.challenges;

  beforeAll(async () => {
    noviceChallenges = challengeCache.challenges.filter(
      (challenge) => challenge.difficulty === ChallengeDifficulty.NOVICE,
    );
    noviceChallengeCard = await ChallengeCard.create({
      challengeOneId: noviceChallenges[0]?.id,
      challengeTwoId: noviceChallenges[1]?.id,
      challengeThreeId: noviceChallenges[2]?.id,
      challengeFiveId: undefined,
      difficulty: ChallengeDifficulty.NOVICE,
      discordUserId: '1234',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.STARTED,
    });

    masterChallenges = challengeCache.challenges.filter(
      (challenge) => challenge.difficulty === ChallengeDifficulty.MASTER,
    );
    masterChallengeCard = await ChallengeCard.create({
      challengeOneId: masterChallenges[0]?.id,
      challengeTwoId: masterChallenges[1]?.id,
      challengeThreeId: masterChallenges[2]?.id,
      challengeFourId: masterChallenges[3]?.id,
      challengeFiveId: masterChallenges[4]?.id,
      difficulty: ChallengeDifficulty.MASTER,
      discordUserId: '1234',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.STARTED,
    });
  });

  afterAll(async () => {
    await noviceChallengeCard.destroy();
    await masterChallengeCard.destroy();
  });

  test('getChallengeIds should filter out undefined challenges', () => {
    expect(noviceChallengeCard.getChallengeIds()).toEqual([
      noviceChallenges[0]?.id,
      noviceChallenges[1]?.id,
      noviceChallenges[2]?.id,
    ]);
  });

  test('getChallengeIds should return ids for all challenge foreign keys', () => {
    expect(masterChallengeCard.getChallengeIds()).toEqual([
      masterChallenges[0]?.id,
      masterChallenges[1]?.id,
      masterChallenges[2]?.id,
      masterChallenges[3]?.id,
      masterChallenges[4]?.id,
    ]);
  });
});
