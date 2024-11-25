import { challengeCache } from '../../../challenges';
import { ChallengeDifficulty } from '../Challenge';
import ChallengeCard, { ChallengeCardStatus } from '../Challenge/ChallengeCard';

describe('ChallengeCard', () => {
  test('getChallengeIds should filter out undefined challenges', async () => {
    const noviceChallenges = challengeCache.challenges.filter(
      (challenge) => challenge.difficulty === ChallengeDifficulty.NOVICE,
    );
    const challengeCard = await ChallengeCard.create({
      challengeOneId: noviceChallenges[0]?.id,
      challengeTwoId: noviceChallenges[1]?.id,
      challengeThreeId: noviceChallenges[2]?.id,
      challengeFiveId: undefined,
      difficulty: ChallengeDifficulty.NOVICE,
      discordUserId: '1234',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.STARTED,
    });
    expect(challengeCard.getChallengeIds()).toEqual([
      noviceChallenges[0]?.id,
      noviceChallenges[1]?.id,
      noviceChallenges[2]?.id,
    ]);
  });

  test('getChallengeIds should return ids for all challenge foreign keys', async () => {
    const masterChallenges = challengeCache.challenges.filter(
      (challenge) => challenge.difficulty === ChallengeDifficulty.MASTER,
    );
    const challengeCard = await ChallengeCard.create({
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
    expect(challengeCard.getChallengeIds()).toEqual([
      masterChallenges[0]?.id,
      masterChallenges[1]?.id,
      masterChallenges[2]?.id,
      masterChallenges[3]?.id,
      masterChallenges[4]?.id,
    ]);
  });
});
