import { useState } from "react";

/**
 * An explicit acknowledgement required before installing, e.g. for a deprecated or an
 * external app. It is tied to the fetched manifest object, so fetching another manifest
 * (or refetching) resets it.
 */
export const useManifestAcknowledgement = (manifest: object | undefined, isRequired: boolean) => {
  const [acknowledgedManifest, setAcknowledgedManifest] = useState<object>();

  return {
    acknowledged: !isRequired || (!!manifest && acknowledgedManifest === manifest),
    setAcknowledged: (acknowledged: boolean) =>
      setAcknowledgedManifest(acknowledged ? manifest : undefined),
  };
};

export type ManifestAcknowledgement = ReturnType<typeof useManifestAcknowledgement>;
