import { CommandInteraction } from 'discord.js';
import reverseApproval from '../reverseApproval';
import {
  ChallengeCard,
  ChallengeCardStatus,
  ChallengeDifficulty,
  DiscordUser,
  RaffleTicket,
} from '../../../database';
import { saveRaffleTickets } from '../../../raffles';
import { challengeCache } from '../../../challenges';

describe('reverseApproval', () => {
  beforeAll(async () => {
    const user = await DiscordUser.create({ user_id: 'reverse_approval_test' });

    // Create a novice challenge card for the user
    const noviceChallenges = challengeCache.challenges.filter(
      (challenge) => challenge.difficulty === ChallengeDifficulty.NOVICE,
    );
    const noviceChallengeCard = await ChallengeCard.create({
      challengeOneId: noviceChallenges[0]?.id,
      challengeTwoId: noviceChallenges[1]?.id,
      challengeThreeId: noviceChallenges[2]?.id,
      challengeFiveId: undefined,
      difficulty: ChallengeDifficulty.NOVICE,
      discordUserId: 'reverse_approval_test',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.COMPLETED,
    });
    await saveRaffleTickets(
      user.user_id,
      ChallengeDifficulty.NOVICE,
      noviceChallengeCard.id,
    );

    // Create an intermediate challenge card for the user
    const intermediateChallenges = challengeCache.challenges.filter(
      (challenge) => challenge.difficulty === ChallengeDifficulty.INTERMEDIATE,
    );
    const intermediateChallengeCard = await ChallengeCard.create({
      challengeOneId: intermediateChallenges[0]?.id,
      challengeTwoId: intermediateChallenges[1]?.id,
      challengeThreeId: intermediateChallenges[2]?.id,
      challengeFiveId: undefined,
      difficulty: ChallengeDifficulty.INTERMEDIATE,
      discordUserId: 'reverse_approval_test',
      rerollsRemaining: 2,
      status: ChallengeCardStatus.COMPLETED,
    });
    await saveRaffleTickets(
      user.user_id,
      ChallengeDifficulty.INTERMEDIATE,
      intermediateChallengeCard.id,
    );
  });

  test("it should reverse a user's Sage Challenge Card approval", async () => {
    const interaction = {
      followUp: jest.fn(),
      editReply: jest.fn(),
    } as unknown as CommandInteraction;

    const result = await reverseApproval(
      interaction,
      'reverse_approval_test',
      ChallengeDifficulty.INTERMEDIATE,
    );

    expect(result).toBe(true);
    expect(interaction.editReply).toHaveBeenCalledWith(
      'Successfully reversed approval for the challenge card. Please remove master or grandmaster roles accordingly.',
    );

    const raffleTickets = await RaffleTicket.findAll({
      where: { discordUserId: 'reverse_approval_test' },
    });
    expect(raffleTickets).toHaveLength(1);

    const intermediateChallengeCard = await ChallengeCard.findOne({
      where: {
        discordUserId: 'reverse_approval_test',
        difficulty: ChallengeDifficulty.INTERMEDIATE,
      },
    });
    expect(intermediateChallengeCard?.status).toBe(
      ChallengeCardStatus.APPROVAL,
    );
  });
});
