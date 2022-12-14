import { makeStyles } from "@material-ui/core";
import useClipboard from "@saleor/hooks/useClipboard";
import { CopyIcon, IconButton, Pill } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    copiedButton: {
      color: theme.palette.primary.main,
      animation: "$pulse 0.2s",
    },
  }),
  {
    name: "PspReference",
  },
);

const PspReference: React.FC<{ reference: string }> = ({ reference }) => {
  const [copied, copy] = useClipboard();
  const classes = useStyles();

  return (
    <>
      <Pill
        outlined
        color="generic"
        label={reference}
        onClick={event => {
          event.preventDefault();
          copy(reference);
        }}
      />
      {!!navigator.clipboard && (
        <IconButton
          className={copied && classes.copiedButton}
          onClick={event => {
            event.preventDefault();
            copy(reference);
          }}
        >
          <CopyIcon />
        </IconButton>
      )}
    </>
  );
};

export default PspReference;
