import DiscordUser, { initializeDiscordUser } from './DiscordUser';
import TwistedLeague, { initializeTwistedLeague } from './TwistedLeague';

const initializeModels = [initializeDiscordUser, initializeTwistedLeague];

export { DiscordUser, TwistedLeague };

export default initializeModels;
