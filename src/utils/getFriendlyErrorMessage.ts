export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (error instanceof Error) {
    if (error.message === 'NOT_FOUND')
      return 'No detail found at this address.';
    return error.message;
  }
  return String(error);
}
