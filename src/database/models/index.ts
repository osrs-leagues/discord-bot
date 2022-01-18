import DiscordUser, { initializeDiscordUser } from './DiscordUser';
import ShatteredRelicsLeague, {
  initializeShatteredRelicsLeague,
} from './League/ShatteredRelicsLeague';
import TrailblazerLeague, {
  initializeTrailblazerLeague,
} from './League/TrailblazerLeague';
import TwistedLeague, { initializeTwistedLeague } from './League/TwistedLeague';

const initializeModels = [
  initializeDiscordUser,
  initializeShatteredRelicsLeague,
  initializeTrailblazerLeague,
  initializeTwistedLeague,
];

export { DiscordUser, ShatteredRelicsLeague, TrailblazerLeague, TwistedLeague };

export default initializeModels;
