import { Guild, MessageEmbed } from 'discord.js';

import { getLeagueName, getRankName, League, Rank } from '../../leagues';

type RankedMessageParams = {
  guild: Guild;
  league: League;
  rank: Rank;
  username: string;
};

const getRankedMessage = (params: RankedMessageParams): MessageEmbed => {
  const { guild, league, rank, username } = params;
  const rankName = getRankName(rank);
  const leagueName = getLeagueName(league);
  const emojiName = 'twisted_' + rankName.toLowerCase();
  const emoji = guild.client.emojis.cache.find((e) => e.name === emojiName);
  const emojiMessage = emoji ? '<:' + emojiName + ':' + emoji.id + '>' : '';
  return new MessageEmbed()
    .setColor('#64d85b')
    .setTitle(
      `You have set your ${leagueName} username to __**${username}**__. You are ranked **${rankName}** ${emojiMessage}`,
    );
};

export default getRankedMessage;
