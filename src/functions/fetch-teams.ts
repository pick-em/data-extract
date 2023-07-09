import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';

import { delayedIterator, getOutputDataRootDir } from '../utils/index.js';

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

const TEAMS_OUTPUT_DIR = path.join(getOutputDataRootDir(), '/teams');
await fs.mkdir(TEAMS_OUTPUT_DIR, { recursive: true });

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

  await fs.writeFile(
    `${TEAMS_OUTPUT_DIR}/${data.id}-${data.slug}.json`,
    JSON.stringify(data),
  );
}
