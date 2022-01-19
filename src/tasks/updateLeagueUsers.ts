import { fetchHiscoreUser } from '.';
import sequelize from '../database';
import { ShatteredRelicsLeague } from '../database/models';
import { Task } from './types';

const updateLeagueUsers: Task = {
  execute: async () => {
    console.log(`Running league users update task...`);
    try {
      const leagueUsers = await ShatteredRelicsLeague.findAll();
      const updateTransaction = await sequelize.transaction();
      for (const leagueUser of leagueUsers) {
        if (leagueUser.name) {
          try {
            const hiscoreResult = await fetchHiscoreUser.execute({
              username: leagueUser.name,
            });
            if (hiscoreResult) {
              await ShatteredRelicsLeague.update(
                { points: hiscoreResult.league_points },
                {
                  where: { name: leagueUser.name },
                  transaction: updateTransaction,
                },
              );
            }
          } catch (error) {
            // no user results
          }
        }
      }
      updateTransaction.commit();
      console.log(
        `Updated ${leagueUsers.length} shattered relic league users.`,
      );
      return true;
    } catch (error) {
      console.error('Error running updateLeagueUsers task.', error);
      return false;
    }
  },
};

export default updateLeagueUsers;
