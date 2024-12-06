import { appsMessages } from "@dashboard/apps/messages";
import { CopyIcon } from "@saleor/macaw-ui";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useState } from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

interface AppManifestTableDisplayProps {
  manifestUrl: string;
}

const getAppDomainFromManifest = (manifest: string) => new URL(manifest).host;

export const AppManifestTableDisplay = ({ manifestUrl }: AppManifestTableDisplayProps) => {
  const styles = useStyles();
  const intl = useIntl();
  const [copied, setCopied] = useState(false);

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Text
          onMouseOut={() => setCopied(false)}
          className={styles.manifestText}
          onClick={e => {
            try {
              e.stopPropagation();
              e.preventDefault();
              navigator.clipboard.writeText(manifestUrl);
              setCopied(true);
            } catch (e) {
              // Copy not supported, ignore
            }
          }}
        >
          {getAppDomainFromManifest(manifestUrl)}
          {!!navigator.clipboard && (
            <CopyIcon
              className={clsx(styles.copyIcon, {
                [styles.copyIconColorful]: copied,
              })}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          )}
        </Text>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        <Tooltip.ContentHeading>
          {intl.formatMessage(appsMessages.appManifestUrl)}
        </Tooltip.ContentHeading>
        {manifestUrl}
      </Tooltip.Content>
    </Tooltip>
  );
};
AppManifestTableDisplay.displayName = "AppManifestTableDisplay";
export default AppManifestTableDisplay;
