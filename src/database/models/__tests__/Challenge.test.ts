import Challenge, { ChallengeDifficulty } from '../Challenge/Challenge';

describe('Challenge', () => {
  test('seed should populate', async () => {
    const challenges = await Challenge.findAll({
      where: { difficulty: ChallengeDifficulty.NOVICE },
    });
    expect(challenges.length).toBeGreaterThan(0);
  });

  test('description length is not restricted', async () => {
    const challenge = await Challenge.create({
      difficulty: ChallengeDifficulty.NOVICE,
      description: 'a'.repeat(2000),
      regionOneId: 1,
    });
    expect(challenge.description.length).toBe(2000);
  });
});
