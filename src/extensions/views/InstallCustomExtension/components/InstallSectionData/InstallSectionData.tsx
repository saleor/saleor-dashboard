import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, useWatch } from "react-hook-form";

import { ExtensionInstallFormData, InstallDetailsManifestData } from "../../types";
import { InstallExtensionManifestData } from "../InstallExtensionManifestData";

interface IInstallSectionDataProps {
  isFetchingManifest: boolean;
  manifest: InstallDetailsManifestData | undefined;
  lastFetchedManifestUrl: string | undefined;
  control: Control<ExtensionInstallFormData>;
}

export const InstallSectionData = ({
  isFetchingManifest,
  manifest,
  lastFetchedManifestUrl,
  control,
}: IInstallSectionDataProps) => {
  const manifestUrlInputValue = useWatch({
    control,
    name: "manifestUrl",
  });

  if (isFetchingManifest) {
    return (
      <Box>
        <Box display="flex" flexDirection="column" gap={6}>
          <Skeleton height={5} __width="292px" />
          <Skeleton height={12} __width="292px" />
        </Box>
        <Box marginTop={16}>
          <Skeleton height={5} __width="106px" />
          <Skeleton height={5} marginTop={4} __width="356px" />
          <Skeleton height={5} marginTop={1.5} __width="356px" />
        </Box>
        <Box marginTop={11}>
          <Skeleton height={5} __width="356px" />
          <Skeleton height={5} marginTop={1.5} __width="356px" />
        </Box>
      </Box>
    );
  }

  if (manifest && lastFetchedManifestUrl === manifestUrlInputValue) {
    return <InstallExtensionManifestData manifest={manifest} />;
  }

  return null;
};
