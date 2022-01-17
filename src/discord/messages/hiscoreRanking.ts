import { MessageEmbed } from 'discord.js';

import { encodeURL } from '../../utils/strings';

import {
  CURRENT_LEAGUE,
  getLeagueName,
  getRank,
  getRankName,
  League,
} from '../../leagues';

type HiscoreRankingMessageParams = {
  league?: League;
  points: number;
  rank: number;
  username: string;
};

const getHiscoreRankingMessage = ({
  league = CURRENT_LEAGUE,
  username,
  points,
  rank,
}: HiscoreRankingMessageParams): MessageEmbed => {
  const leagueRank = getRank(points, league);
  const rankName = getRankName(leagueRank);
  const leagueName = getLeagueName(league);
  let body = '';
  body += `League Points: ${points}\n`;
  body += `Hiscores Rank Number: ${rank}\n`;
  body += `League Rank: ${rankName}\n`;
  return new MessageEmbed()
    .setColor('#64d85b')
    .setTitle(`${username} ${leagueName} League Stats:`)
    .setDescription(body)
    .setURL(encodeURL(`https://league.wiseoldman.net/players/${username}/`));
};

export default getHiscoreRankingMessage;
