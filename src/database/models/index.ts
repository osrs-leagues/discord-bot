import DiscordUser from './DiscordUser';
import DMTicket from './DMTicket';
import Turtle from './Turtle';
import TurtleCollection from './TurtleCollection';
import ShatteredRelicsLeague from './League/ShatteredRelicsLeague';
import TrailblazerLeague from './League/TrailblazerLeague';
import TrailblazerReloadedLeague from './League/TrailblazerReloadedLeague';
import TwistedLeague from './League/TwistedLeague';
import Challenge from './Challenge/Challenge';
import ChallengeCard from './Challenge/ChallengeCard';
import Region from './Region';
import RagingEchoesLeague from './League/RagingEchoesLeague';
import DemonicPactsLeague from './League/DemonicPactsLeague';
import RaffleTicket from './RaffleTicket';

const models = [
  Challenge,
  ChallengeCard,
  DemonicPactsLeague,
  DiscordUser,
  DMTicket,
  RagingEchoesLeague,
  ShatteredRelicsLeague,
  TrailblazerLeague,
  TrailblazerReloadedLeague,
  Turtle,
  TurtleCollection,
  TwistedLeague,
  Region,
  RaffleTicket,
];

export {
  Challenge,
  ChallengeCard,
  DemonicPactsLeague,
  DiscordUser,
  DMTicket,
  RagingEchoesLeague,
  ShatteredRelicsLeague,
  TrailblazerLeague,
  TrailblazerReloadedLeague,
  Turtle,
  TurtleCollection,
  TwistedLeague,
  Region,
  RaffleTicket,
};

export * from './Challenge';
export * from './Turtle';
export * from './types';

export default models;
