import { fetchHiscoreUser } from '.';
import sequelize from '../database';
import { DiscordUser } from '../database/models';
import {
  CURRENT_LEAGUE,
  getLeagueDiscordColumn,
  getLeagueName,
  insertLeagueName,
} from '../leagues';
import { Task } from './types';

const updateLeagueUsers: Task = {
  execute: async () => {
    console.log(`Running league users update task...`);
    try {
      const leagueNameIdentifier = getLeagueDiscordColumn(CURRENT_LEAGUE);
      const discordUsers = await DiscordUser.findAll();
      const updateTransaction = await sequelize.transaction();
      console.log(
        `Attempting update on ${
          discordUsers.length
        } ${getLeagueName()} usernames.`,
      );
      for (const discordUser of discordUsers) {
        const leagueUserName = discordUser[leagueNameIdentifier];
        if (leagueUserName?.length > 0) {
          try {
            const hiscoreResult = await fetchHiscoreUser.execute({
              username: leagueUserName,
            });
            if (hiscoreResult) {
              await insertLeagueName(
                CURRENT_LEAGUE,
                leagueUserName,
                hiscoreResult.league_points,
                {
                  transaction: updateTransaction,
                },
              );
            }
          } catch (error) {
            console.error(
              `Error fetching hiscores for ${discordUser.trailblazer_reloaded_name}: `,
              error,
            );
          }
        }
      }
      await updateTransaction.commit();
      console.log(
        `Updated ${discordUsers.length} ${getLeagueName()} league users.`,
      );
      return true;
    } catch (error) {
      console.error('Error running updateLeagueUsers task.', error);
      return false;
    }
  },
};

export default updateLeagueUsers;
