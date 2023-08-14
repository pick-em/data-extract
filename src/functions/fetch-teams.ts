import winston from 'winston';
import functions from '@google-cloud/functions-framework';
import { LoggingWinston } from '@google-cloud/logging-winston';

import { fetchTeamList, fetchTeam } from '../api/client.js';
import { uploadJSON } from '../lib/cloud-storage.js';
import { delayedIterator } from '../utils/index.js';

const log = winston.createLogger({
  level: 'info',
  defaultMeta: {
    service: `function:fetchTeams`,
  },
  transports: [
    new LoggingWinston({
      projectId: process.env.GCP_PROJECT_ID,
      redirectToStdout: true,
    }),
  ],
});

functions.cloudEvent('fetchTeams', async (cloudEvent) => {
  log.info('CloudEvent recieved', {
    cloudEvent,
  });

  log.info('Fetching teamsList');
  const teamsList = await fetchTeamList();
  if (!teamsList) {
    log.error('Failed to fetch teamsList');
    return;
  }

  try {
    log.info('Uploading teams-list.json');
    await uploadJSON('teams-list.json', teamsList);
    log.info('Successfully uploaded teams-list.json');
  } catch (error) {
    log.error('Failed to upload teams-list.json', { error });
  }

  for await (const { $ref } of delayedIterator(teamsList.items, 300)) {
    log.info('Fetching team', { $ref });
    const team = await fetchTeam({ $ref });
    if (!team) {
      log.warn('Failed to fetch team', { $ref });
      continue;
    }

    const uploadFilename = `${team.id}-${team.slug}.json`;
    try {
      log.info('Uploading team data', { team: uploadFilename });
      await uploadJSON(uploadFilename, team);
      log.info('Successfully uploaded teams data', { team: uploadFilename });
    } catch (error) {
      log.error('Failed to upload teams data', { team: uploadFilename, error });
    }
  }
});
