import { GuildMember } from 'discord.js';

import { League, Rank } from '../../leagues';
import config from '../../config';

type RemoveLeagueRolesParams = {
  member: GuildMember;
};

const removeLeagueRoles = async ({
  member,
}: RemoveLeagueRolesParams): Promise<boolean> => {
  try {
    const allRoles = getAllRoles();
    await member.roles.remove(allRoles);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getAllRoles = (): string[] => {
  const roles: string[] = [];
  for (const league in config.ranks) {
    const leagueRanks = config.ranks[league as League];
    for (const rankKey in leagueRanks) {
      const role = leagueRanks[rankKey as Rank];
      roles.push(role);
    }
  }
  return roles;
};

export default removeLeagueRoles;
