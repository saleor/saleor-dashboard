import {
  getAppEndpoints,
  isOfficialManifest,
} from "@dashboard/extensions/components/AppDefinition/appEndpoints";
import { ExtensionManifestValidator } from "@dashboard/extensions/domain/extension-manifest-validator";
import { useMemo } from "react";

import { type Manifest } from "../types";
import { useManifestAcknowledgement } from "./useManifestAcknowledgement";

const manifestValidator = new ExtensionManifestValidator();

/**
 * Everything that gates the Install button: client-side manifest issues, and the
 * acknowledgements a deprecated or an external (non-Saleor) app requires.
 */
export const useInstallChecks = ({
  manifest,
  manifestUrl,
}: {
  manifest: Manifest | undefined;
  manifestUrl: string | undefined;
}) => {
  const issues = useMemo(() => {
    const manifestValidation = manifestValidator.validateAppManifest(manifest);

    return "issues" in manifestValidation ? manifestValidation.issues : undefined;
  }, [manifest]);

  const isOfficial = useMemo(
    () => !!manifest && !!manifestUrl && isOfficialManifest(getAppEndpoints(manifestUrl, manifest)),
    [manifest, manifestUrl],
  );

  const deprecation = useManifestAcknowledgement(manifest, !!manifest?.deprecationReason);
  const trust = useManifestAcknowledgement(manifest, !isOfficial);

  return {
    issues,
    isOfficial,
    deprecation,
    trust,
    // Validation issues block installation until Dashboard can mark broken widgets.
    canInstall: !!manifest && !issues && deprecation.acknowledged && trust.acknowledged,
  };
};
