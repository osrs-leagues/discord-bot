import { ChallengeDifficulty } from '../database';
import * as challenges from '../challenges';

describe('challenges', () => {
  test('generateNewChallenges should exclude challenge ids', () => {
    const noviceGeneralChallenges = challenges.challengeCache.challenges.filter(
      (c) => c.difficulty === ChallengeDifficulty.NOVICE,
    );
    const generatedChallenges = challenges
      .generateNewChallenges(
        ChallengeDifficulty.NOVICE,
        [],
        [
          noviceGeneralChallenges[0].id,
          noviceGeneralChallenges[1].id,
          noviceGeneralChallenges[2].id,
        ],
      )
      .map((challenge) => challenge.id);
    expect(generatedChallenges).not.toContain(noviceGeneralChallenges[0].id);
    expect(generatedChallenges).not.toContain(noviceGeneralChallenges[1].id);
    expect(generatedChallenges).not.toContain(noviceGeneralChallenges[2].id);
  });
});
