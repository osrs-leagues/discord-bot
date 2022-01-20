import { fetchHiscoreUser } from '.';
import sequelize from '../database';
import { DiscordUser, ShatteredRelicsLeague } from '../database/models';
import { Task } from './types';

const updateLeagueUsers: Task = {
  execute: async () => {
    console.log(`Running league users update task...`);
    try {
      const discordUsers = await DiscordUser.findAll();
      const updateTransaction = await sequelize.transaction();
      console.log(
        `Attempting update on ${discordUsers.length} shattered relic usernames.`,
      );
      for (const discordUser of discordUsers) {
        if (
          discordUser.shattered_relics_name &&
          discordUser.shattered_relics_name.length > 0
        ) {
          try {
            const hiscoreResult = await fetchHiscoreUser.execute({
              username: discordUser.shattered_relics_name,
            });
            if (hiscoreResult) {
              await ShatteredRelicsLeague.upsert(
                {
                  name: discordUser.shattered_relics_name,
                  points: hiscoreResult.league_points,
                },
                {
                  transaction: updateTransaction,
                },
              );
            }
          } catch (error) {
            console.error(
              `Error fetching hiscores for ${discordUser.shattered_relics_name}: `,
              error,
            );
          }
        }
      }
      await updateTransaction.commit();
      console.log(
        `Updated ${discordUsers.length} shattered relic league users.`,
      );
      return true;
    } catch (error) {
      console.error('Error running updateLeagueUsers task.', error);
      return false;
    }
  },
};

export default updateLeagueUsers;
