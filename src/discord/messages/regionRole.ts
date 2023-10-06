import { GuildMember, MessageEmbed, Role } from 'discord.js';

type RegionRoleMessageParams = {
  member: GuildMember;
  role: Role;
};

const getRegionRoleMessage = ({
  member,
  role,
}: RegionRoleMessageParams): MessageEmbed => {
  return new MessageEmbed()
    .setColor(role.color)
    .setTitle(
      `${member.nickname ?? member.displayName} has set their region role to ${
        role.name
      }`,
    );
};

export default getRegionRoleMessage;
