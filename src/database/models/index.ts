import DiscordUser, { initializeDiscordUser } from './DiscordUser';
import ShatteredRelicsLeague, {
  initializeShatteredRelicsLeague,
} from './League/ShatteredRelicsLeague';
import TrailblazerLeague, {
  initializeTrailblazerLeague,
} from './League/TrailblazerLeague';
import TrailblazerReloadedLeague, {
  initializeTrailblazerReloadedLeague,
} from './League/TrailblazerReloadedLeague';
import TwistedLeague, { initializeTwistedLeague } from './League/TwistedLeague';

const initializeModels = [
  initializeDiscordUser,
  initializeShatteredRelicsLeague,
  initializeTrailblazerLeague,
  initializeTrailblazerReloadedLeague,
  initializeTwistedLeague,
];

export {
  DiscordUser,
  ShatteredRelicsLeague,
  TrailblazerLeague,
  TrailblazerReloadedLeague,
  TwistedLeague,
};

export default initializeModels;
