import { Box, CopyIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { appsMessages } from "../../messages";

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
      gap={1.5}
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
      <Tooltip>
        <Tooltip.Trigger>
          <Box __maxWidth="300px" className="ellipsis">
            <Text typeSize={2} color="default2">
              {new URL(manifestUrl).host}
            </Text>
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">
          <Tooltip.Arrow />
          <Tooltip.ContentHeading>
            <FormattedMessage {...appsMessages.appManifestUrl} />
          </Tooltip.ContentHeading>
          {manifestUrl}
        </Tooltip.Content>
      </Tooltip>
      <CopyIcon color="default2" className={clsx(copied && "animate-copy")} />
    </Box>
  );
};
