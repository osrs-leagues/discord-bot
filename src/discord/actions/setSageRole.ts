import { Guild, GuildMember } from 'discord.js';
import { ChallengeDifficulty } from '../../database/models';

const enum RoleName {
  SAGE_MASTER = "Sage's Master",
  SAGE_GRANDMASTER = "Sage's Grandmaster",
}

/**
 * Assigns the user a role based on their difficulty level.
 * @param guild - The Discord guild where the roles are located.
 * @param discordId - The user's Discord ID.
 * @param difficulty - The difficulty enum for the user.
 */
export async function setSageRole(
  guild: Guild,
  discordId: string,
  difficulty: ChallengeDifficulty,
): Promise<void> {
  const member: GuildMember | null = await guild.members.fetch(discordId);

  if (!member) {
    console.error(
      `User with ID ${discordId} not found. Could not assign Sage's role`,
    );
    return;
  }

  // Determine role based on difficulty
  let roleName: string;

  if (difficulty === ChallengeDifficulty.MASTER) {
    roleName = RoleName.SAGE_MASTER;
  } else if (difficulty === ChallengeDifficulty.GRANDMASTER) {
    roleName = RoleName.SAGE_GRANDMASTER;
  }

  // Assign the role if applicable
  if (roleName) {
    const role = guild.roles.cache.find((r) => r.name === roleName);

    if (!role) {
      console.error(`Role "${roleName}" not found.`);
      return;
    }

    await member.roles.add(role);
  }
}
