import { BooleanOptional, IParseOptions, parse, ParsedQs } from "qs";

/**
 * Use default pre-configured parser with pre-set details
 */
export const parseQs = (
  str: string,
  options?: IParseOptions<BooleanOptional> & { decoder?: never | undefined },
): ParsedQs => parse(str, { arrayLimit: 100, throwOnLimitExceeded: true, ...options });
