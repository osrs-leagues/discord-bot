import { Guild, MessageEmbed } from 'discord.js';

import {
  getLeagueName,
  getRankColor,
  getRankName,
  League,
  Rank,
} from '../../leagues';
import { encodeURL } from '../../utils/strings';

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
  const emojiName = `${leagueName
    .toLocaleLowerCase()
    .replace(' ', '_')}_${rankName.toLocaleLowerCase()}`;
  const emoji = guild.client.emojis.cache.find((e) => e.name === emojiName);
  const emojiMessage = emoji ? '<:' + emojiName + ':' + emoji.id + '>' : '';
  return new MessageEmbed()
    .setColor(getRankColor(rank))
    .setTitle(
      `You have set your ${leagueName} League username to __**${username}**__. You are ranked **${rankName}** ${emojiMessage}`,
    )
    .setURL(encodeURL(`https://league.wiseoldman.net/players/${username}/`));
};

export default getRankedMessage;
