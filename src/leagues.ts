export enum Rank {
  BRONZE = 'bronze',
  IRON = 'iron',
  STEEL = 'steel',
  MITHRIL = 'mithril',
  ADAMANT = 'adamant',
  RUNE = 'rune',
  DRAGON = 'dragon',
}

export type League = 'twisted' | 'trailblazer' | 'shattered_relics';

export type PointRankings = { [key in Rank]: number };

export type Leagues = { [key in League]: PointRankings };

const LeagueRankings: Leagues = {
  twisted: {
    bronze: 10,
    iron: 80,
    steel: 510,
    mithril: 1770,
    adamant: 5270,
    rune: 10820,
    dragon: 20830,
  },
  trailblazer: {
    bronze: 100,
    iron: 510,
    steel: 2000,
    mithril: 6480,
    adamant: 18720,
    rune: 35680,
    dragon: 56310,
  },
  shattered_relics: {
    bronze: 0,
    iron: 0,
    steel: 0,
    mithril: 0,
    adamant: 0,
    rune: 0,
    dragon: 0,
  },
};

const LeagueNames: { [key in League]: string } = {
  twisted: 'Twisted League',
  trailblazer: 'Trailblazer League',
  shattered_relics: 'Shattered Relics League',
};

const RankNames: { [key in Rank]: string } = {
  bronze: 'Bronze',
  iron: 'Iron',
  steel: 'Steel',
  mithril: 'Mithril',
  adamant: 'Adamant',
  rune: 'Rune',
  dragon: 'Dragon',
};

export const getRank = (points: number, league: League): Rank => {
  const rankings: PointRankings = LeagueRankings[league];
  if (points >= rankings.dragon) return Rank.DRAGON;
  else if (points >= rankings.rune) return Rank.RUNE;
  else if (points >= rankings.adamant) return Rank.ADAMANT;
  else if (points >= rankings.mithril) return Rank.MITHRIL;
  else if (points >= rankings.steel) return Rank.STEEL;
  else if (points >= rankings.iron) return Rank.IRON;
  else if (points >= rankings.bronze) return Rank.BRONZE;
};

export const getRankName = (rank: Rank) => {
  return RankNames[rank];
};

export const getLeagueName = (league: League) => {
  return LeagueNames[league];
};

export default LeagueRankings;
