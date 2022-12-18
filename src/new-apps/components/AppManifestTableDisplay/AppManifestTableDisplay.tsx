import { Typography } from "@material-ui/core";
import { CopyIcon, Tooltip } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { useState } from "react";

import { useStyles } from "./styles";

interface AppManifestTableDisplayProps {
  manifestUrl: string;
}

const getAppDomainFromManifest = (manifest: string) => new URL(manifest).host;

export const AppManifestTableDisplay = ({
  manifestUrl,
}: AppManifestTableDisplayProps) => {
  const styles = useStyles();
  const [copied, setCopied] = useState(false);

  return (
    <Tooltip placement="top" title={manifestUrl} header="App Manifest URL">
      <Typography
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
          />
        )}
      </Typography>
    </Tooltip>
  );
};
AppManifestTableDisplay.displayName = "AppManifestTableDisplay";
export default AppManifestTableDisplay;
