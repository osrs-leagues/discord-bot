import puppeteer from 'puppeteer';

import { PointRankings, setLeagueStandings } from '../leagues';
import { Task } from './types';

/**
 * OSRS Leagues Hiscores page
 */
const HISCORES_URL =
  'https://secure.runescape.com/m=hiscore_oldschool_seasonal/overall?category_type=1&table=0&page=';

const PAGE_START = 15000;

const fetchLeaguePointRankings: Task = {
  execute: async () => {
    console.log('Starting league standings fetch...');
    console.time('league_standings');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let completed = false;
    let currentPage = PAGE_START;
    let maxBoundary = 0;
    let minBoundary = 0;
    while (!completed) {
      await page.goto(`${HISCORES_URL}${currentPage}`);
      const rank = await getFirstRowRank(page);
      if (rank == 1) {
        maxBoundary = currentPage;
        currentPage =
          minBoundary == 0
            ? currentPage / 2
            : minBoundary + Math.floor((maxBoundary - minBoundary) / 2);
      } else {
        minBoundary = currentPage;
        currentPage = minBoundary + Math.ceil((maxBoundary - minBoundary) / 2);
      }
      currentPage = Math.floor(currentPage);

      if (maxBoundary - minBoundary <= 1) {
        console.log(`Completed: ${minBoundary}, ${maxBoundary}`);
        completed = true;
      }
    }
    await page.goto(`${HISCORES_URL}${minBoundary}`);
    const finalRank = await getLastRowRank(page);
    console.log(`Final Rank: ${finalRank}`);
    const pointRankings: PointRankings = {
      bronze: 100,
      iron: 0,
      steel: 0,
      mithril: 0,
      adamant: 0,
      rune: 0,
      dragon: 0,
    };
    pointRankings.iron = await getPointsAtRank(page, finalRank * 0.8);
    pointRankings.steel = await getPointsAtRank(page, finalRank * 0.6);
    pointRankings.mithril = await getPointsAtRank(page, finalRank * 0.4);
    pointRankings.adamant = await getPointsAtRank(page, finalRank * 0.2);
    pointRankings.rune = await getPointsAtRank(page, finalRank * 0.05);
    pointRankings.dragon = await getPointsAtRank(page, finalRank * 0.01);
    console.log(`Final Point Rankings: ${JSON.stringify(pointRankings)}`);

    setLeagueStandings(pointRankings);
    console.timeEnd('league_standings');
  },
};

const getPointsAtRank = async (page: puppeteer.Page, rank: number) => {
  rank = Math.floor(rank);
  const pageNumber = Math.ceil(rank / 25);
  await page.goto(`${HISCORES_URL}${pageNumber}`);
  const points = await page.evaluate((rank) => {
    // @ts-ignore
    const rows = $('#contentHiscores .personal-hiscores__row');
    let points = 0;
    // @ts-ignore
    rows.each(function () {
      // @ts-ignore
      const columns = $(this).find('td');
      const rowRank = parseInt(columns[0].innerText.trim().replaceAll(',', ''));
      if (rowRank == rank) {
        points = parseInt(columns[2].innerText.trim().replaceAll(',', ''));
      }
    });
    return points;
  }, rank);
  return points;
};

const getFirstRowRank = async (page: puppeteer.Page): Promise<number> => {
  const rank: number = await page.evaluate(() => {
    // @ts-ignore
    const result = $('#contentHiscores .personal-hiscores__row td')
      .first()
      .text()
      .trim();
    return result;
  });
  return rank;
};

const getLastRowRank = async (page: puppeteer.Page): Promise<number> => {
  const rank: number = await page.evaluate(() => {
    // @ts-ignore
    const result = $('#contentHiscores .personal-hiscores__row:last-child td')
      .first()
      .text()
      .trim();
    return result;
  });
  return rank;
};

export default fetchLeaguePointRankings;
