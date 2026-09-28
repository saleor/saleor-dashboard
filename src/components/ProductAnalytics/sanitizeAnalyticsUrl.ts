const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const integerPattern = /^\d+$/;
const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
const saleorGlobalIdPattern = /^[A-Za-z][A-Za-z0-9_]*:.+$/;

const decodePathSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const isSaleorGlobalId = (segment: string): boolean => {
  const decodedSegment = decodePathSegment(segment);

  if (decodedSegment.length < 8 || !base64Pattern.test(decodedSegment)) {
    return false;
  }

  try {
    return saleorGlobalIdPattern.test(atob(decodedSegment));
  } catch {
    return false;
  }
};

const isEntityId = (segment: string): boolean => {
  const decodedSegment = decodePathSegment(segment);

  return (
    integerPattern.test(decodedSegment) ||
    uuidPattern.test(decodedSegment) ||
    isSaleorGlobalId(decodedSegment)
  );
};

export const sanitizeAnalyticsPath = (pathname: string): string =>
  pathname
    .split("/")
    .map(segment => (isEntityId(segment) ? ":id" : segment))
    .join("/");

export const sanitizeAnalyticsUrl = (value: string): string => {
  try {
    const url = new URL(value, window.location.origin);

    url.pathname = sanitizeAnalyticsPath(url.pathname);
    url.search = "";
    url.hash = "";

    return value.startsWith("http://") || value.startsWith("https://")
      ? url.toString()
      : url.pathname;
  } catch {
    const fragmentIndex = value.indexOf("#");
    const valueWithoutFragment = fragmentIndex === -1 ? value : value.slice(0, fragmentIndex);
    const queryIndex = valueWithoutFragment.indexOf("?");

    const pathname =
      queryIndex === -1 ? valueWithoutFragment : valueWithoutFragment.slice(0, queryIndex);

    return sanitizeAnalyticsPath(pathname);
  }
};
