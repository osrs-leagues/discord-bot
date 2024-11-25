import { ChallengeDifficulty } from '../database';
import * as challenges from '../challenges';

describe('challenges', () => {
  describe('generateNewChallenges', () => {
    test('generateNewChallenges should exclude challenge ids', () => {
      const noviceGeneralChallenges =
        challenges.challengeCache.challenges.filter(
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

    test('generateNewChallenges should return the correct number of challenges', () => {
      const generatedChallenges = challenges.generateNewChallenges(
        ChallengeDifficulty.NOVICE,
        [],
        [],
      );
      expect(generatedChallenges).toHaveLength(3);
    });

    test('generateNewChallenges should return the correct number of challenges when excluding challenges', () => {
      const noviceGeneralChallenges =
        challenges.challengeCache.challenges.filter(
          (c) => c.difficulty === ChallengeDifficulty.NOVICE,
        );
      const generatedChallenges = challenges.generateNewChallenges(
        ChallengeDifficulty.NOVICE,
        [],
        [
          noviceGeneralChallenges[0].id,
          noviceGeneralChallenges[1].id,
          noviceGeneralChallenges[2].id,
        ],
      );
      expect(generatedChallenges).toHaveLength(3);
    });

    test('generateNewChallenges should return the correct number of challenges when excluding all challenges', () => {
      const noviceGeneralChallenges =
        challenges.challengeCache.challenges.filter(
          (c) => c.difficulty === ChallengeDifficulty.NOVICE,
        );
      const generatedChallenges = challenges.generateNewChallenges(
        ChallengeDifficulty.NOVICE,
        [],
        noviceGeneralChallenges.map((c) => c.id),
      );
      expect(generatedChallenges).toHaveLength(3);
    });

    test('generateNewChallenges should include at least 1 remaining non-excluded challenge in results', () => {
      const noviceGeneralChallenges =
        challenges.challengeCache.challenges.filter(
          (c) => c.difficulty === ChallengeDifficulty.NOVICE,
        );
      const includedChallenge = noviceGeneralChallenges.splice(0, 1);
      const generatedChallenges = challenges.generateNewChallenges(
        ChallengeDifficulty.NOVICE,
        [],
        noviceGeneralChallenges.map((c) => c.id),
      );
      expect(generatedChallenges).toHaveLength(3);
      expect(generatedChallenges).toContainEqual(includedChallenge[0]);
    });
  });

  describe('createChallenge', () => {
    test('createChallenge should create a new challenge', async () => {
      const challenge = await challenges.createChallenge(
        'Test Challenge',
        ChallengeDifficulty.NOVICE,
        challenges.challengeCache.regions[0].id,
        challenges.challengeCache.regions[1].id,
      );
      expect(challenge).toBeDefined();
      expect(challenges.challengeCache.challenges).toContainEqual(challenge);
    });
  });

  describe('deleteChallenge', () => {
    test('deleteChallenge should delete an existing challenge', async () => {
      const challenge = challenges.challengeCache.challenges[0];
      await challenges.deleteChallenge(challenge);
      expect(challenges.challengeCache.challenges).not.toContainEqual(
        challenge,
      );
    });
  });

  describe('updateChallenge', () => {
    test('updateChallenge should update an existing challenge', async () => {
      const challenge = challenges.challengeCache.challenges[0];
      const updatedDescription = 'Updated description';
      const updatedChallenge = await challenges.updateChallenge(
        challenge,
        updatedDescription,
      );
      const cachedChallenge = challenges.challengeCache.challenges.find(
        (c) => c.id === updatedChallenge.id,
      );

      expect(updatedChallenge.description).toBe(updatedDescription);
      expect(cachedChallenge.description).toBe(updatedDescription);
    });
  });
});
