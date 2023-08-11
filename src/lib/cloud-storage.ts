import { Storage } from '@google-cloud/storage';

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
    console.info(`Saving data to uploadPath=${uploadPath}`);
    await bucket.file(uploadPath).save(JSON.stringify(data));
    console.info(`Successfully saved data to uploadPath=${uploadPath}`);
  } catch (error) {
    console.error(`Failed to upload to GCS bucket uploadPath=${uploadPath}`);
    console.error(error);
  }

  return;
}
