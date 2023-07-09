import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';

import { delayedIterator } from '../utils/index.js';

interface TeamsData {
  count: number;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  items: TeamRef[];
}

interface TeamRef {
  $ref: string;
}

const TODAY_DATE = new Date();
const TODAY_DATE_STRING = `${TODAY_DATE.getUTCFullYear()}-${
  TODAY_DATE.getUTCMonth() + 1
}-${TODAY_DATE.getUTCDate()}`;

const __filname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filname);
const DATA_DIR = path.resolve(__dirname, '../../data');
const OUTPUT_DIR = `${DATA_DIR}/${TODAY_DATE_STRING}/teams`;

async function mkdirpIfNoExist(dir: string) {
  const pathParts = dir.split('/');
  let testPath = '';
  pathParts.forEach(async (part) => {
    testPath += `${part}/`;
    await mkdirIfNoExist(testPath);
  });
}

async function mkdirIfNoExist(dir: string) {
  try {
    const noAccess = await fs.access(dir);
  } catch (err) {
    await fs.mkdir(dir);
  }
}

await mkdirpIfNoExist(OUTPUT_DIR);

(async function fetchTeams() {
  const response = await axios.get(
    'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams?limit=50',
  );

  if (response.status != 200) {
    console.log('[fetchTeams] API Request Failed', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    return;
  }

  const data = response.data as TeamsData;
  const teams = data.items;

  for await (const team of delayedIterator(teams, 1000)) {
    await fetchTeam(team);
  }
})();

async function fetchTeam(team: TeamRef) {
  const response = await axios.get(team.$ref);

  if (response.status != 200) {
    console.log('[fetchTeam] API Request Failed', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    return;
  }

  const data = response.data;

  await fs.writeFile(`${OUTPUT_DIR}/${data.slug}.json`, JSON.stringify(data));
}
