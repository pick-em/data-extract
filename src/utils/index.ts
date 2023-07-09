export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* delayedIterator(array: any[], ms: number) {
  for (const item of array) {
    yield item;
    await delay(ms);
  }
}
