const UTM_PARAMS = "?utm_source=dashboard&utm_content=sidebar_button";
const stagingLink = (hostname: string) =>
  `https://staging-cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;
const prodLink = (hostname: string) => `https://cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;

export const useEnvLink = () => {
  const { hostname } = window.location;

  if (hostname.includes(".staging.")) {
    return stagingLink(hostname);
  }

  return prodLink(hostname);
};
