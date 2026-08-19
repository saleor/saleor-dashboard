/**
 * Check if a date string represents a future time.
 */
export const isFutureDate = (date: string | null | undefined): boolean => {
  if (!date) {
    return false;
  }

  return Date.parse(date) > Date.now();
};
