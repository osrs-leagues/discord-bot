import { Guild, GuildMember } from 'discord.js';

import config from '../../config';
import { League, Rank } from '../../leagues';

export type SetLeagueRoleParams = {
  league: League;
  rank: Rank;
  member: GuildMember;
  guild: Guild;
};

const setLeagueRole = async ({
  league,
  rank,
  member,
  guild,
}: SetLeagueRoleParams): Promise<Rank> => {
  try {
    const discordRole = config.ranks[league][rank];
    const roleToAdd = guild.roles.cache.get(discordRole);
    if (!member.roles.cache.has(roleToAdd.id)) {
      const others = Object.values(config.ranks[league]).filter(
        (r) => r != discordRole,
      );
      const roles = await guild.roles.fetch();
      const removeRoles = Array.from(roles.values()).filter((r) =>
        others.includes(r.id),
      );
      if (removeRoles.length > 0) {
        await member.roles.remove(removeRoles);
      }
      await member.roles.add(roleToAdd);
    }
    return rank;
  } catch (error) {
    console.error(
      `Error setting discord role: `,
      JSON.stringify({ league, rank, member_id: member.id }),
      error,
    );
    return undefined;
  }
};

export default setLeagueRole;
