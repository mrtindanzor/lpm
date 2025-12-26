export const toCapitalized = (text: string) =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function syncTryCatch<T, E = Error>(callback: () => T) {
  try {
    return [callback() as T, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}

export default async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<readonly [T, null] | readonly [null, E]> {
  try {
    return [(await promise) as T, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}

export const printLines = (total = 2) => {
  console.log("");

  for (let i = 0; i < total; i++)
    console.log("-----------------------------------------");

  console.log("");
};
