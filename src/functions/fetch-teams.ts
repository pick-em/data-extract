import { fetchTeamList, fetchTeam } from '../api/client.js';
import { uploadJSON } from '../lib/cloud-storage.js';
import { delayedIterator } from '../utils/index.js';

export async function fetchTeams() {
  const teamsList = await fetchTeamList();
  if (!teamsList) {
    throw new Error('Failed to fetch teamsList');
  }

  await uploadJSON('teams-list.json', teamsList);

  for await (const { $ref } of delayedIterator(teamsList.items, 300)) {
    const team = await fetchTeam({ $ref });
    if (!team) {
      throw new Error(`Failed to fetch team ${$ref}`);
    }

    await uploadJSON(`${team.id}-${team.slug}.json`, team);
  }
}
