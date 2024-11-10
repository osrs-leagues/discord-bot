import { GuildMember, MessageEmbed } from 'discord.js';

type RegionRoleMessageParams = {
  member: GuildMember;
  role: string;
};

const getRegionRoleMessage = ({
  member,
  role,
}: RegionRoleMessageParams): MessageEmbed => {
  return new MessageEmbed().setTitle(
    `${
      member.nickname ?? member.displayName
    } has set their region role(s) to ${role}`,
  );
};

export default getRegionRoleMessage;
