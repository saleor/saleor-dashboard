import { CopyIcon, Tooltip } from "@saleor/macaw-ui";
import { Box, sprinkles, Text } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React, { useState } from "react";

interface AppManifestUrlProps {
  manifestUrl: string;
}

export const AppManifestUrl: React.FC<AppManifestUrlProps> = ({
  manifestUrl,
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <Box
      display="flex"
      gap={4}
      onClick={e => {
        try {
          e.preventDefault();
          e.stopPropagation();
          navigator.clipboard.writeText(manifestUrl);
          setCopied(true);
        } catch (e) {
          // Copy not supported, ignore
        }
      }}
    >
      <Tooltip title={manifestUrl} header="App Manifest URL">
        <Text variant="caption" color="textNeutralSubdued">
          {new URL(manifestUrl).host}
        </Text>
      </Tooltip>
      <CopyIcon
        className={clsx(
          sprinkles({ color: "iconNeutralSubdued" }),
          copied && "animate-copy",
        )}
      />
    </Box>
  );
};
