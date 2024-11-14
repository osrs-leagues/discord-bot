import { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from './types';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import {
  ChallengeCard,
  ChallengeCardStatus,
  ChallengeDifficulty,
  RaffleTicket,
} from '../../../database';
import { RaffleType } from '../../../database/models/RaffleTicket';
import { getDifficultyName } from '../../../challenges';
import { capitalize } from '../../../utils/strings';

const challengeStatisticsCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('challenge_statistics')
    .setDescription('View completed challenges and raffle counts.'),
  execute: async (interaction) => {
    try {
      const countDifficultyMap: Record<ChallengeDifficulty, number> = {
        [ChallengeDifficulty.NOVICE]: 0,
        [ChallengeDifficulty.INTERMEDIATE]: 0,
        [ChallengeDifficulty.EXPERIENCED]: 0,
        [ChallengeDifficulty.MASTER]: 0,
        [ChallengeDifficulty.GRANDMASTER]: 0,
      };
      for (const difficulty of Object.values(ChallengeDifficulty).filter(
        (difficulty) => !isNaN(Number(difficulty)),
      )) {
        const count = await ChallengeCard.count({
          where: { difficulty, status: ChallengeCardStatus.COMPLETED },
        });
        countDifficultyMap[difficulty as ChallengeDifficulty] = count;
      }
      const raffleTypeMap: Record<RaffleType, number> = {
        [RaffleType.LOW_LEVEL]: 0,
        [RaffleType.HIGH_LEVEL]: 0,
      };
      for (const raffleType of Object.values(RaffleType)) {
        const count = await RaffleTicket.count({ where: { raffleType } });
        raffleTypeMap[raffleType as RaffleType] = count;
      }
      interaction.reply({
        content: [
          `**Completed Challenges**`,
          Object.entries(countDifficultyMap)
            .map(
              ([difficulty, count]) =>
                `${getDifficultyName(
                  parseInt(difficulty) as ChallengeDifficulty,
                )}: ${count}`,
            )
            .join('\n'),
          `**Raffle Counts**`,
          Object.entries(raffleTypeMap)
            .map(([raffleType, count]) => `${capitalize(raffleType)}: ${count}`)
            .join('\n'),
        ].join('\n\n'),
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'An error occurred while fetching challenge statistics.',
        ephemeral: true,
      });
    }
  },
};

export default challengeStatisticsCommand;
