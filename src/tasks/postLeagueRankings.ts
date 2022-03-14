import axios from 'axios';
import { CURRENT_LEAGUE } from '../leagues';
import { client } from '../discord';
import { TextChannel } from 'discord.js';
import { Task } from './types';
import config from '../config';
import getStatisticsMessage from '../discord/messages/statistics';

const LEAGUE_RANKINGS =
  'https://spiedie.xyz/rs/league/LeagueRankingProgression';

const postLeagueRankings: Task<undefined, number> = {
  execute: async () => {
    try {
      console.log(
        'Posting ranks from ' +
          LEAGUE_RANKINGS +
          ' to ' +
          config.channels.statistics,
      );
      const response = await axios({ url: LEAGUE_RANKINGS });
      if (response && response.status == 200 && response.data.length > 0) {
        const message = getStatisticsMessage({
          league: CURRENT_LEAGUE,
          response: response.data,
        });
        (
          client.channels.cache.get(config.channels.statistics) as TextChannel
        ).send({ embeds: [message] });
        //.crosspost()
      }
      return 0;
    } catch (error) {
      console.error('Error running postLeagueRankings task.', error);
    }
  },
};

export default postLeagueRankings;
