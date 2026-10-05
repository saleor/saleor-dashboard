import { useState } from "react";

import { type InstallDetailsManifestData } from "../types";

/**
 * Installing a deprecated app requires an explicit acknowledgement. It is tied to the fetched
 * manifest object, so fetching another manifest (or refetching) resets it.
 */
export const useDeprecationAcknowledgement = (manifest: InstallDetailsManifestData | undefined) => {
  const [acknowledgedManifest, setAcknowledgedManifest] = useState<InstallDetailsManifestData>();

  return {
    acknowledged: !manifest?.deprecationReason || acknowledgedManifest === manifest,
    setAcknowledged: (acknowledged: boolean) =>
      setAcknowledgedManifest(acknowledged ? manifest : undefined),
  };
};
