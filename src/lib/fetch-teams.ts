import 'dotenv/config';
import { Storage } from '@google-cloud/storage';

import { delayedIterator } from '../utils/index.js';
import { fetchTeamList, fetchTeam } from '../api/client.js';

function saveData(data: any): void {
  // TODO
}

export async function fetchTeams() {
  const jobId = 'fetch-teams';
  const time = new Date();
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
  });
  const bucket = storage.bucket(
    process.env.GCP_DATA_EXTRACT_BUCKET_NAME as string,
  );

  const teamsList = await fetchTeamList();
  if (!teamsList) {
    throw new Error('Failed to fetch teamsList');
  }

  await bucket
    .file(`${jobId}/${time.toISOString()}/teams-list.json`)
    .save(JSON.stringify(teamsList));
  console.log(`SAVED = ${jobId}/${time.toISOString()}/teams-list.json`);

  for await (const { $ref } of delayedIterator(teamsList.items, 300)) {
    const team = await fetchTeam({ $ref });
    if (!team) {
      throw new Error(`Failed to fetch team ${$ref}`);
    }
    await bucket
      .file(`${jobId}/${time.toISOString()}/${team.id}-${team.slug}.json`)
      .save(JSON.stringify(team));
    console.log(
      `SAVED = ${jobId}/${time.toISOString()}/${team.id}-${team.slug}.json`,
    );
  }
}
