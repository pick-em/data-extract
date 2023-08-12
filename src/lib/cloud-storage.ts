import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Storage } from '@google-cloud/storage';

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

const RUN_TIME = new Date();

export async function uploadJSON(filename: string, data: object) {
  let uploadPath = `${process.env.JOB_ID_FETCH_TEAMS}`;
  uploadPath += `/${RUN_TIME.toISOString()}`;
  uploadPath += `/${filename}`;
  if (!filename.endsWith('.json')) {
    uploadPath += '.json';
  }

  try {
    log.info(`Saving data to uploadPath=${uploadPath}`);
    await bucket.file(uploadPath).save(JSON.stringify(data));
    log.info(`Successfully saved data to uploadPath=${uploadPath}`);
  } catch (error) {
    log.error(`Failed to upload to GCS bucket uploadPath=${uploadPath}`, {
      error,
    });
  }
}
