export default async function tryCatch<T, E = Error>(promise: Promise<T>) {
  try {
    return [await promise, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
