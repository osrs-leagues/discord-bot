import { Guild, GuildMember } from 'discord.js';
import { capitalize } from '../../utils/strings';

export type SetRegionRoleParams = {
  member: GuildMember;
  guild: Guild;
  regions?: string[];
};

const REGION_ROLE_NAMES = [
  'Asgarnia',
  'Kandarin',
  'Fremennik',
  'Kourend',
  'Misthalin',
  'Morytania',
  'Desert',
  'Tirannwn',
  'Varlamore',
  'Wilderness',
];

/**
 * Assigns an array of region roles to the user.
 * @param guild - The Discord guild where the roles are located.
 * @param discordId - The user's Discord ID.
 */
const setRegionRoles = async ({
  guild,
  member,
  regions,
}: SetRegionRoleParams): Promise<boolean> => {
  try {
    const removeRoles = guild.roles.cache.filter((role) =>
      REGION_ROLE_NAMES.includes(role.name),
    );
    await member.roles.remove(removeRoles);
    if (regions.length > 0) {
      const roles = regions.map((region) =>
        guild.roles.cache.find((r) => r.name === capitalize(region)),
      );
      await member.roles.add(roles);
    }
    return true;
  } catch (error) {
    console.error(
      `Error setting discord region roles: `,
      JSON.stringify({ member_id: member.id, values: JSON.stringify(regions) }),
      error,
    );
  }
  return false;
};

export default setRegionRoles;
