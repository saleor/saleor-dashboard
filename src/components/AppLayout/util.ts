// @ts-strict-ignore
export const extractQueryParams = (queryString: string) => {
  const urlSearchParams = new URLSearchParams(queryString);
  const queryParams = {};

  urlSearchParams.forEach((value, key) => {
    const arrayKeyRegex = /^(.+)\[\d*\]$/;
    const match = key.match(arrayKeyRegex);

    if (match) {
      const arrayKey = match[1];

      if (!queryParams.hasOwnProperty(arrayKey)) {
        queryParams[arrayKey] = [];
      }

      queryParams[arrayKey].push(value);
    } else {
      queryParams[key] = value;
    }
  });

  return queryParams;
};
