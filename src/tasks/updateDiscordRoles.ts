import { DiscordUser, ShatteredRelicsLeague } from '../database/models';
import { Task } from '.';
import { client } from '../discord';
import { setLeagueRole } from '../discord/actions';
import { CURRENT_LEAGUE, getRank } from '../leagues';
import config from '../config';

const updateDiscordRoles: Task<undefined, number> = {
  execute: async () => {
    console.log('Updating all discord roles to latest ranks...');
    try {
      const guild = client.guilds.cache.get(config.guild_id);
      if (guild) {
        let amountUpdated = 0;
        const discordUsers = await DiscordUser.findAll();
        for (const discordUser of discordUsers) {
          if (discordUser) {
            const guildMember = guild.members.cache.get(discordUser.user_id);
            if (guildMember) {
              const leagueUser = await ShatteredRelicsLeague.findByPk(
                discordUser.shattered_relics_name,
              );
              if (leagueUser) {
                const rank = getRank(leagueUser.points, CURRENT_LEAGUE);
                await setLeagueRole({
                  league: CURRENT_LEAGUE,
                  rank: rank,
                  member: guildMember,
                  guild: guild,
                });
                amountUpdated++;
              }
            }
          }
        }
        console.log(
          `Updated ${amountUpdated} discord user's Shattered Relic roles.`,
        );
        return amountUpdated;
      } else {
        console.error(`Unable to find guild: ${config.guild_id}`);
        return 0;
      }
    } catch (error) {
      console.error('Error running updateDiscordRoles task.', error);
      return 0;
    }
  },
};

export default updateDiscordRoles;
