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
    const allRoles = getAllRoles().filter((role) => !!role);
    member.roles.remove(allRoles.filter((role) => role !== undefined));
    return true;
  } catch (error) {
    console.error('Error removing league roles: ', error);
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
