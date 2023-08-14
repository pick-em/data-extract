import winston from 'winston';
import functions, { CloudEvent } from '@google-cloud/functions-framework';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData.js';

import { fetchTeamList, fetchTeam } from '../api/client.js';
import { getUploadRoot, uploadJSON } from '../lib/cloud-storage.js';
import { delayedIterator } from '../utils/index.js';
import { JOB_TYPES } from '../constants/index.js';

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

functions.cloudEvent(
  'fetchTeams',
  async (cloudEvent: CloudEvent<MessagePublishedData>) => {
    log.info('CloudEvent recieved', {
      cloudEvent,
    });

    if (process.env.JOB_TYPE !== JOB_TYPES.FetchSeason) {
      log.crit('Invalid JOB_TYPE for fetchTeams GCF', {
        envJobType: process.env.JOB_TYPE,
      });
      return;
    }

    const fileUploadRoot = getUploadRoot(cloudEvent);

    log.info('Fetching teamsList');
    const teamsList = await fetchTeamList();
    if (!teamsList) {
      log.crit('Failed to fetch teamsList');
      return;
    }

    try {
      log.info('Uploading teams-list.json');
      await uploadJSON(`${fileUploadRoot}/teams-list.json`, teamsList);
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
        await uploadJSON(`${fileUploadRoot}/${uploadFilename}`, team);
        log.info('Successfully uploaded teams data', { team: uploadFilename });
      } catch (error) {
        log.error('Failed to upload teams data', {
          team: uploadFilename,
          error,
        });
      }
    }

    log.info('Job finished successfully');
  },
);
