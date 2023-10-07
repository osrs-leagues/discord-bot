import { Guild, GuildMember, Role } from 'discord.js';
import { getRegionCombination, getRegionRoles } from './setRegionRole.utils';

export type SetRegionRoleParams = {
  member: GuildMember;
  guild: Guild;
  values?: string[];
};

const setRegionRole = async ({
  member,
  guild,
  values,
}: SetRegionRoleParams): Promise<Role> => {
  try {
    if (values === undefined || values.length === 0) {
      const roles = await guild.roles.fetch();
      const removeRoles = getRegionRoles(Array.from(roles.values()));
      await member.roles.remove(removeRoles);
      return undefined;
    }
    if (values.length !== 3) {
      return undefined;
    }
    const roles = await guild.roles.fetch();
    const regionCombination = getRegionCombination(values);
    const roleToAdd = roles.find((role) => role.name === regionCombination);
    if (roleToAdd) {
      const removeRoles = getRegionRoles(Array.from(roles.values()));
      await member.roles.remove(removeRoles);
      await member.roles.add(roleToAdd);
      return roleToAdd;
    } else {
      console.error(
        `Error setting discord region role: `,
        JSON.stringify({
          member_id: member.id,
          values: JSON.stringify(values),
        }),
      );
      return undefined;
    }
  } catch (error) {
    console.error(
      `Error setting discord region role: `,
      JSON.stringify({ member_id: member.id, values: JSON.stringify(values) }),
      error,
    );
    return undefined;
  }
};

export default setRegionRole;
