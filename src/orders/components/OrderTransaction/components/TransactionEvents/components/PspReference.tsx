import OverflowTooltip from "@saleor/components/OverflowTooltip";
import useClipboard from "@saleor/hooks/useClipboard";
import { CheckIcon, CopyIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { PspReferenceLink } from "./PspReferenceLink";

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      display: "flex",
      gap: theme.spacing(1),
    },
    pill: {
      // TODO: change to new dashboard monospace font
      fontFamily: "monospace",
      fontWeight: 600,
      fontSize: "12px",
      borderRadius: "4px",
      background: "#F5F5F5",
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

export const PspReference: React.FC<PspReferenceProps> = ({
  reference,
  url,
}) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <OverflowTooltip
        className={classes.pill}
        header={intl.formatMessage(messages.pspReference)}
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
