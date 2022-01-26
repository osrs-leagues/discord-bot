import axios from 'axios';
import { client } from '../discord';
import { TextChannel } from 'discord.js';
import { Task } from './types';
import config from '../config';

const LEAGUE_RANKINGS =
  'https://spiedie.xyz/rs/league/LeagueRankingProgression';

//const CHANNEL_ID = '267765914085228554';

const postLeagueRankings: Task<undefined, number> = {
  execute: async () => {
    try {
	  console.log('Posting ranks from '+LEAGUE_RANKINGS+' to '+config.statistics_id);
      const response = await axios({ url: LEAGUE_RANKINGS });
      if (response && response.status == 200 && response.data.length > 0) {
        (client.channels.cache.get(config.statistics_id) as TextChannel).send("```"+response.data+"```")
		//.crosspost()
		;
      }
	  return 0;
    } catch (error) {
      console.log('error '+error);
    }
  },
};

export default postLeagueRankings;
