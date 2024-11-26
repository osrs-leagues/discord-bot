import { GuildMember, MessageEmbed } from 'discord.js';

type RelicsMessageParams = {
  emojis?: string[];
  member: GuildMember;
  relics: string[];
};

const getRelicsMessage = ({
  emojis,
  member,
  relics,
}: RelicsMessageParams): MessageEmbed => {
  return new MessageEmbed()
    .setTitle(
      `${
        member.nickname ?? member.displayName
      } has been randomly assigned the following relics:`,
    )
    .setDescription(
      relics
        .map(
          (relic, i) =>
            `**Tier ${i + 1}**: ${
              emojis && emojis[i] ? emojis[i] : ''
            } ${relic}`,
        )
        .join('\n'),
    );
};

export default getRelicsMessage;
