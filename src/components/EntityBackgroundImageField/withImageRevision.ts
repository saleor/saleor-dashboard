/** Bust browser cache when the backend reuses the same media URL after replace. */
export const withImageRevision = (url: string, revision: number): string => {
  if (revision === 0) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}v=${revision}`;
};
