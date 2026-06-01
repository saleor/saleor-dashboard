interface ParsedVersion {
  major: number;
  minor: number;
}

/**
 * Parse a strict "major.minor" version string (e.g. "3.20").
 * Used for the env-provided deprecated version, which must match exactly.
 */
const parseStrictVersion = (value: string): ParsedVersion | null => {
  const match = /^(\d+)\.(\d+)$/.exec(value.trim());

  if (!match) {
    return null;
  }

  return { major: Number(match[1]), minor: Number(match[2]) };
};

/**
 * Parse the leading "major.minor" from a version string defensively.
 * The connected Saleor version may carry a patch and/or pre-release suffix
 * (e.g. "3.20.0", "3.21.0a0"); we only care about major.minor.
 */
const parseLeadingVersion = (value: string): ParsedVersion | null => {
  const match = /^(\d+)\.(\d+)/.exec(value.trim());

  if (!match) {
    return null;
  }

  return { major: Number(match[1]), minor: Number(match[2]) };
};

/**
 * Returns true when `connected` is the same or older than `deprecated`,
 * comparing on (major, minor) only.
 */
const isSameOrOlder = (connected: ParsedVersion, deprecated: ParsedVersion): boolean => {
  if (connected.major !== deprecated.major) {
    return connected.major < deprecated.major;
  }

  return connected.minor <= deprecated.minor;
};

export interface DeprecationBannerState {
  upgradeDate: Date;
}

interface GetDeprecationBannerStateArgs {
  deprecatedVersion: string | undefined;
  deprecatedVersionTimestamp: string | undefined;
  connectedVersion: string | undefined;
}

/**
 * Determines whether the deprecation banner should be shown.
 *
 * The banner is shown only when ALL of the following hold:
 * - `deprecatedVersion` is a valid "major.minor" string
 * - `deprecatedVersionTimestamp` is a valid date/ISO timestamp
 * - `connectedVersion` is present and parseable
 * - the connected version is the same or older than the deprecated version
 *
 * Fails closed: any missing/invalid input results in `null` (no banner).
 */
export const getDeprecationBannerState = ({
  deprecatedVersion,
  deprecatedVersionTimestamp,
  connectedVersion,
}: GetDeprecationBannerStateArgs): DeprecationBannerState | null => {
  if (!deprecatedVersion || !deprecatedVersionTimestamp || !connectedVersion) {
    return null;
  }

  const deprecated = parseStrictVersion(deprecatedVersion);

  if (!deprecated) {
    return null;
  }

  const upgradeDate = new Date(deprecatedVersionTimestamp);

  if (Number.isNaN(upgradeDate.getTime())) {
    return null;
  }

  const connected = parseLeadingVersion(connectedVersion);

  if (!connected) {
    return null;
  }

  if (!isSameOrOlder(connected, deprecated)) {
    return null;
  }

  return { upgradeDate };
};
