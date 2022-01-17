import DiscordUser, { initializeDiscordUser } from './DiscordUser';
import TrailblazerLeague, {
  initializeTrailblazerLeague,
} from './League/TrailblazerLeague';
import TwistedLeague, { initializeTwistedLeague } from './League/TwistedLeague';

const initializeModels = [
  initializeDiscordUser,
  initializeTrailblazerLeague,
  initializeTwistedLeague,
];

export { DiscordUser, TrailblazerLeague, TwistedLeague };

export default initializeModels;
