/**
 * Whether a positive amount has more decimal places than `places`, or rounds to 0 at that
 * precision. Compares the amount with its own text rounded to `places`, so a large amount such as
 * 1234567.89 isn't thrown off by floating-point noise.
 */
export const hasMoreDecimalPlacesThan = (amount: number, places: number): boolean =>
  Number(amount.toFixed(places)) !== amount;
