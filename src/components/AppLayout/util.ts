export const extractQueryParams = (queryString: string): Record<string, string | string[]> => {
  const urlSearchParams = new URLSearchParams(queryString);
  const queryParams: Record<string, string | string[]> = {};

  urlSearchParams.forEach((value, key) => {
    const arrayKeyRegex = /^(.+)\[\d*\]$/;
    const match = key.match(arrayKeyRegex);

    if (match) {
      const arrayKey = match[1];

      if (!Object.prototype.hasOwnProperty.call(queryParams, arrayKey)) {
        queryParams[arrayKey] = [];
      }

      (queryParams[arrayKey] as string[]).push(value);
    } else {
      queryParams[key] = value;
    }
  });

  return queryParams;
};
