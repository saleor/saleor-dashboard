import { Typography } from "@material-ui/core";
import { CopyIcon, makeStyles, Tooltip } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { useState } from "react";

const useStyles = makeStyles(
  theme => ({
    "@keyframes pulse": {
      from: { transform: "scale(1)" },
      to: { transform: "scale(1.2)" },
    },
    manifestText: {
      color: theme.palette.text.secondary,
      "&:hover svg": {
        visibility: "visible",
      },
    },
    copyIcon: {
      marginRight: theme.spacing(1),
      visibility: "hidden",
      verticalAlign: "middle",
      transition: "0.2s",
    },
    copyIconColorful: {
      color: theme.palette.primary.main,
      animation: "$pulse 0.2s",
    },
  }),
  { name: "AppManifestTableDisplay" },
);

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
        {!!navigator.clipboard && (
          <CopyIcon
            className={clsx(styles.copyIcon, {
              [styles.copyIconColorful]: copied,
            })}
          />
        )}
        {getAppDomainFromManifest(manifestUrl)}
      </Typography>
    </Tooltip>
  );
};
