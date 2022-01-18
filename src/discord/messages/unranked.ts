import { MessageEmbed } from 'discord.js';

import { getLeagueName, League } from '../../leagues';
import { encodeURL } from '../../utils/strings';

type UnrankedMessageParams = {
  league: League;
  username: string;
};

const getUnrankedMessage = (params: UnrankedMessageParams): MessageEmbed => {
  const { league, username } = params;
  const leagueName = getLeagueName(league);
  return new MessageEmbed()
    .setColor('#64d85b')
    .setTitle(
      `You have set your ${leagueName} League username to **${username}**. No ${leagueName} rank was found.`,
    )
    .setURL(encodeURL(`https://league.wiseoldman.net/players/${username}/`));
};

export default getUnrankedMessage;
