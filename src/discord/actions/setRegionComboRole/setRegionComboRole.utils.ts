import { Role } from 'discord.js';

/**
 * Get a region combination from an array of region names.
 * ["Asgarnia", "Desert", "Zeah"] => "A/D/Z"
 */
export const getRegionCombination = (values: string[]): string =>
  values
    .map((value) => value.charAt(0).toUpperCase())
    .sort()
    .join('/');

/**
 * Filter roles to just region roles
 * @param roles An array of discord roles
 * @returns filtered roles
 */
export const getRegionRoles = (roles: Role[]) =>
  roles.filter((role) => role.name.match(/[\w]+\/[\w]+\/[\w]+/g));
