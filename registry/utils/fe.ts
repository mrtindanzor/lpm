export function fe(error: unknown) {
  if (typeof error === "string") return error;

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    error instanceof Error
  )
    return error.message;

  return "Something went wrong";
}
