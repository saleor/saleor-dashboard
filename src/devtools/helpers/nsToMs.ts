/**
 * Converts nanoseconds to milliseconds.
 *
 * Significant to the hundredth place.
 *
 * This function does NOT account for Roundoff Errors.
 *
 * ```
 * nsToMs(123456789)
 * // 123.46
 * ```
 */
export const nsToMs = (ns: number) => Math.round(ns / 10000) / 100
