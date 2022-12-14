import { makeStyles } from "@material-ui/core";
import useClipboard from "@saleor/hooks/useClipboard";
import { CopyIcon, IconButton } from "@saleor/macaw-ui";
import clsx from "classnames";
import React from "react";

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
    },
    copyButton: {
      height: "26px",
      width: "26px",
    },
    copiedButton: {
      "& span": {
        color: theme.palette.success.dark,
        animation: "$pulse 0.2s",
      },
    },
  }),
  {
    name: "PspReference",
  },
);

export const PspReference: React.FC<{ reference: string; url?: string }> = ({
  reference,
  url,
}) => {
  const [copied, copy] = useClipboard();
  const classes = useStyles();

  const Element = url ? "a" : "span";

  return (
    <div className={classes.wrapper}>
      <Element className={classes.pill} href={url}>
        {reference}
      </Element>
      {!!navigator.clipboard && (
        <IconButton
          color="primary"
          className={clsx(classes.copyButton, copied && classes.copiedButton)}
          onClick={event => {
            event.preventDefault();
            copy(reference);
          }}
        >
          <CopyIcon />
        </IconButton>
      )}
    </div>
  );
};
