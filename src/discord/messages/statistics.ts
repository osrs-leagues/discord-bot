import { MessageEmbed } from 'discord.js';
import { getLeagueName, League } from '../../leagues';

type StatisticsMessageParams = {
  league: League;
  response: string;
};

const getStatisticsMessage = (
  params: StatisticsMessageParams,
): MessageEmbed => {
  const leagueName = getLeagueName(params.league);
  return new MessageEmbed()
    .setColor('#64d85b')
    .setTitle(`Current ${leagueName} League point rankings:`)
    .setDescription('```' + params.response + '```');
};

export default getStatisticsMessage;
