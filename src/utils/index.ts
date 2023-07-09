import { fileURLToPath } from 'url';
import path from 'path';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* delayedIterator(array: any[], ms: number) {
  for (const item of array) {
    yield item;
    await delay(ms);
  }
}

export function getOutputDataRootDir() {
  const date = new Date();
  const dateString = `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;

  const __filname = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filname);
  const dataDir = path.resolve(__dirname, '../../data');
  return `${dataDir}/${dateString}/${date.toISOString()}`;
}
