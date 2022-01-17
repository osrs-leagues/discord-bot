import axios from 'axios';

import { Task } from './types';

type FetchLeagueUserParams = {
  username: string;
};

type FetchLeagueUserResults = {
  league_rank: number;
  league_points: number;
};

const HISCORE_PLAYER_URL =
  'https://services.runescape.com/m=hiscore_oldschool_seasonal/index_lite.ws?player=';

const LEAGUE_POINTS_INDEX = 23;

const fetchHiscoreUser: Task<
  FetchLeagueUserParams,
  FetchLeagueUserResults | undefined
> = {
  execute: async ({ username }) => {
    if (!username) {
      console.error('Invalid username provided to fetchHiscoreUser task.');
      return undefined;
    }
    const response = await axios({ url: HISCORE_PLAYER_URL + username });
    if (response && response.status == 200 && response.data.length > 0) {
      const stats = response.data.split('\n');
      if (stats.length > 0) {
        const league_stats = stats[LEAGUE_POINTS_INDEX].split(',');
        const league_rank = league_stats[0];
        const league_points = league_stats[1];
        return {
          league_rank,
          league_points,
        };
      }
    } else {
      return undefined;
    }
  },
};

export default fetchHiscoreUser;
