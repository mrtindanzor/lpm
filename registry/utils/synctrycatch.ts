export function syncTryCatch<T, E = Error>(
  callback: () => T,
): readonly [T, null] | readonly [null, E] {
  try {
    return [callback() as T, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
