// @ts-strict-ignore
import OverflowTooltip from "@dashboard/components/OverflowTooltip";
import useClipboard from "@dashboard/hooks/useClipboard";
import { commonMessages } from "@dashboard/intl";
import { CheckIcon, CopyIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import { PspReferenceLink } from "./PspReferenceLink";

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      display: "flex",
      gap: theme.spacing(1),
    },
    pill: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontWeight: 600,
      fontSize: "12px",
      borderRadius: "4px",
      background:
        theme.palette.type === "light" ? theme.palette.grey[100] : theme.palette.background.paper,
      padding: "4px",
      cursor: "default",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    copyButton: {
      height: "26px",
      width: "26px",
      "&&": {
        transition: theme.transitions.create(["color", "background"], {
          duration: theme.transitions.duration.short,
        }),
      },

      "&&.copied": {
        background: theme.palette.saleor.success.mid,
        color: theme.palette.saleor.main[1],
      },
    },
  }),
  {
    name: "PspReference",
  },
);

export interface PspReferenceProps {
  reference: string;
  url?: string;
}

export const PspReference: React.FC<PspReferenceProps> = ({ reference, url }) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <OverflowTooltip
        className={classes.pill}
        header={intl.formatMessage(commonMessages.pspReference)}
      >
        <PspReferenceLink href={url}>{reference}</PspReferenceLink>
      </OverflowTooltip>
      {!!navigator.clipboard && (
        <IconButton
          variant="secondary"
          className={clsx(classes.copyButton, copied && "copied")}
          onClick={event => {
            event.preventDefault();
            copy(reference);
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
      )}
    </div>
  );
};
