import config from '../../config';
import { updateDiscordRoles } from '../../tasks';
import { Job } from '../types';

const updateRolesJob: Job = {
  enabled: config.current_league_active,
  interval: {
    test: undefined,
    development: undefined, //'* * * * *',
    stage: undefined, // '* * *',
    production: '2 */1 * * *',
  },
  runOnStart: false,
  execute: async () => {
    try {
      await updateDiscordRoles.execute();
    } catch (error) {
      console.error('Error executing updateRolesJob.', error);
    }
  },
};

export default updateRolesJob;
