import { hasCloudExtensions } from "@dashboard/cloud-extensions";

import { useCloud } from "./useCloud";

/** Whether Saleor Cloud extensions can show: they are bundled and the user signed in through Saleor Cloud. */
export const useCloudExtensionsAvailable = (): boolean => {
  const { isCloudInstance, isAuthenticatedViaCloud } = useCloud();

  return hasCloudExtensions && isCloudInstance && isAuthenticatedViaCloud;
};
