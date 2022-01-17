import { MessageEmbed } from 'discord.js';

import LeagueRankings, {
  getLeagueName,
  getRankName,
  League,
  Rank,
} from '../../leagues';

type PointRankingsMessageParams = {
  league: League;
};

const getPointRankingsMessage = (
  params: PointRankingsMessageParams,
): MessageEmbed => {
  const { league } = params;
  const leagueName = getLeagueName(league);
  const pointRankings = LeagueRankings[league];
  let body = '';
  for (const key in Rank) {
    const rank = Rank[key as keyof typeof Rank];
    const points = pointRankings[rank];
    const name = getRankName(rank);
    body += `${name}: ${points}\n`;
  }
  return new MessageEmbed()
    .setColor('#64d85b')
    .setTitle(`Current ${leagueName} point rankings:`)
    .setDescription(body);
};

export default getPointRankingsMessage;
