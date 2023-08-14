import winston from 'winston';
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData.js';
import { CloudEvent } from '@google-cloud/functions-framework';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Storage } from '@google-cloud/storage';

import { JobTypes } from '../types.js';

const log = winston.createLogger({
  level: 'info',
  defaultMeta: {
    service: `cloud-storage`,
  },
  transports: [
    // new winston.transports.Console(),
    new LoggingWinston({
      projectId: process.env.GCP_PROJECT_ID,
      redirectToStdout: true,
    }),
  ],
});

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
});

const bucket = storage.bucket(
  process.env.GCP_DATA_EXTRACT_BUCKET_NAME as string,
);

export function getUploadRoot(
  cloudEvent: CloudEvent<MessagePublishedData>,
): string {
  let uploadRoot = `${process.env.JOB_TYPE}`;
  if (process.env.JOB_TYPE === JobTypes.fetchSeason) {
    uploadRoot += `/${cloudEvent.data?.message?.attributes?.seasonType}`;
  }
  uploadRoot += `/${cloudEvent.time}`;
  return uploadRoot;
}

export async function uploadJSON(location: string, data: object) {
  if (!location.endsWith('.json')) {
    location += '.json';
  }

  try {
    log.info(`Saving data to uploadPath=${location}`);
    await bucket.file(location).save(JSON.stringify(data));
    log.info(`Successfully saved data to location=${location}`);
  } catch (error) {
    log.error(`Failed to upload to GCS bucket location=${location}`, {
      error,
    });
  }
}
