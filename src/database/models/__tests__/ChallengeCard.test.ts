import ChallengeCard, { ChallengeCardStatus } from '../Challenge/ChallengeCard';

describe('ChallengeCard', () => {
  test('getChallengeIds should filter out undefined challenges', async () => {
    const challengeCard = await ChallengeCard.create({
      challengeOneId: 1,
      challengeTwoId: 2,
      challengeThreeId: 3,
      challengeFiveId: undefined,
      difficulty: 1,
      discordUserId: '1234',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.STARTED,
    });
    expect(challengeCard.getChallengeIds()).toEqual([1, 2, 3]);
  });

  test('getChallengeIds should return ids for all challenge foreign keys', async () => {
    const challengeCard = await ChallengeCard.create({
      challengeOneId: 1,
      challengeTwoId: 2,
      challengeThreeId: 3,
      challengeFourId: 4,
      challengeFiveId: 5,
      difficulty: 3,
      discordUserId: '1234',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.STARTED,
    });
    expect(challengeCard.getChallengeIds()).toEqual([1, 2, 3, 4, 5]);
  });
});
