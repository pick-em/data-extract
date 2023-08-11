import { delayedIterator } from '../utils/index.js';
import { fetchTeamList, fetchTeam } from '../api/client.js';

function saveData(data: any): void {
  // TODO
}

export async function fetchTeams() {
  const teamsList = await fetchTeamList();
  if (!teamsList) {
    throw new Error('Failed to fetch teamsList');
  }

  saveData(teamsList);

  for await (const { $ref } of delayedIterator(teamsList.items, 300)) {
    const teamData = await fetchTeam({ $ref });
    saveData(teamData);
  }
}
