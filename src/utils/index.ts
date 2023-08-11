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
  const __filname = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filname);
  return path.resolve(__dirname, '../../data');
}

export function getOutputDataDirForType(type: string) {
  const date = new Date();
  const root = getOutputDataRootDir();
  return `${root}/${type}/${date.toISOString()}`;
}
