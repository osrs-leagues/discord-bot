import { GuildMember, MessageEmbed } from 'discord.js';

type CombatMasteriesMessageParams = {
  emojis?: string[];
  member: GuildMember;
  masteries: number[];
};

const MASTERY_NAMES = ['Melee', 'Ranged', 'Magic'];

const getCombatMasteriesMessage = ({
  emojis,
  member,
  masteries,
}: CombatMasteriesMessageParams): MessageEmbed => {
  return new MessageEmbed()
    .setTitle(
      `${
        member.nickname ?? member.displayName
      } has been randomly assigned the following combat masteries:`,
    )
    .setDescription(
      masteries
        .map(
          (mastery, i) =>
            `${emojis && emojis[i] ? emojis[i] : ''} ${
              MASTERY_NAMES[i]
            }: ${mastery}`,
        )
        .join('\n'),
    );
};

export default getCombatMasteriesMessage;
