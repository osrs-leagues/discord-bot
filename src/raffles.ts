import { RaffleType } from './database/models/RaffleTicket';
import {
  RaffleTicket,
  ChallengeDifficulty,
  DiscordUser,
} from '../src/database/models';

/**
 * Saves raffle tickets based on the difficulty.
 * @param discordUserId - The Discord user ID.
 * @param difficulty - The difficulty level.
 */
export async function saveRaffleTickets(
  discordUserId: string,
  difficulty: ChallengeDifficulty,
  challengeCardId: number,
) {
  const ticketsToSave: {
    raffleType: RaffleType;
    discordUserId: string;
    challengeCardId: number;
  }[] = [];

  if (difficulty === ChallengeDifficulty.NOVICE) {
    ticketsToSave.push({
      raffleType: RaffleType.LOW_LEVEL,
      discordUserId: discordUserId,
      challengeCardId: challengeCardId,
    });
  } else if (difficulty === ChallengeDifficulty.INTERMEDIATE) {
    ticketsToSave.push(
      {
        raffleType: RaffleType.LOW_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
      {
        raffleType: RaffleType.LOW_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
    );
  } else if (difficulty === ChallengeDifficulty.EXPERIENCED) {
    ticketsToSave.push(
      {
        raffleType: RaffleType.LOW_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
      {
        raffleType: RaffleType.LOW_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
      {
        raffleType: RaffleType.HIGH_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
    );
  } else if (
    difficulty === ChallengeDifficulty.MASTER ||
    difficulty === ChallengeDifficulty.GRANDMASTER
  ) {
    ticketsToSave.push(
      {
        raffleType: RaffleType.HIGH_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
      {
        raffleType: RaffleType.HIGH_LEVEL,
        discordUserId: discordUserId,
        challengeCardId: challengeCardId,
      },
    );
  }

  await RaffleTicket.bulkCreate(
    ticketsToSave.map((ticket) => ({ ...ticket, winner: false })),
  );
}

/**
 * Loads all raffle tickets into separate arrays for low and high level tickets.
 * @returns - Object containing arrays for low level and high level raffle tickets.
 */
export async function loadRaffleTickets() {
  const lowLevelTickets = await RaffleTicket.findAll({
    where: { raffleType: RaffleType.LOW_LEVEL },
    include: [{ model: DiscordUser, attributes: ['user_id'] }],
  });

  const highLevelTickets = await RaffleTicket.findAll({
    where: { raffleType: RaffleType.HIGH_LEVEL },
    include: [{ model: DiscordUser, attributes: ['user_id'] }],
  });

  return {
    lowLevelTickets,
    highLevelTickets,
  };
}

/**
 * Draws random winners from low and high level tickets.
 * @param numLowLevelWinners - Number of low level winners.
 * @param numHighLevelWinners - Number of high level winners.
 * @returns - Object containing the winners for low and high level raffles.
 */
export async function drawWinners(
  numLowLevelWinners: number,
  numHighLevelWinners: number,
) {
  const { lowLevelTickets, highLevelTickets } = await loadRaffleTickets();

  const lowLevelWinners = await drawRandomWinners(
    lowLevelTickets,
    numLowLevelWinners,
  );
  const highLevelWinners = await drawRandomWinners(
    highLevelTickets,
    numHighLevelWinners,
  );

  return {
    lowLevelWinners,
    highLevelWinners,
  };
}

/**
 * Helper function to select random winners from a list.
 * @param tickets - List of raffle tickets.
 * @param numWinners - Number of winners to draw.
 * @returns - Array of winners.
 */
async function drawRandomWinners(tickets: RaffleTicket[], numWinners: number) {
  const shuffled = tickets.sort(() => 0.5 - Math.random());
  const winners = shuffled.slice(0, numWinners);

  // Mark each winning ticket in the database
  for (const ticket of winners) {
    await ticket.update({ winner: true });
  }
  return winners;
}
