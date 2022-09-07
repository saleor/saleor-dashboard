import { makeStyles } from "@material-ui/core";
import useClipboard from "@saleor/hooks/useClipboard";
import { CopyIcon, Pill } from "@saleor/macaw-ui";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

const useStyles = makeStyles(
  {
    pill: {
      willChange: "contents",
    },
  },
  {
    name: "PspReference",
  },
);

const useInitialWidth = (watch: string[] = []) => {
  const ref = useRef<HTMLElement | undefined>();
  const [width, setWidth] = useState<number>(null);

  const onMount = (el: HTMLElement | undefined) => {
    if (el) {
      const { width } = el.getBoundingClientRect();
      setWidth(width);
    } else {
      setWidth(null);
    }
    ref.current = el;
  };

  useEffect(() => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setWidth(width);
    }
  }, watch);

  return { ref: onMount, width };
};

const PspReference: React.FC<{ reference: string }> = ({ reference }) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const classes = useStyles();
  const { ref, width } = useInitialWidth([reference]);

  return (
    <Pill
      icon={<CopyIcon />}
      outlined
      // preserve width when text changes to "Copied"
      style={{ width: width ? `${width}px` : undefined }}
      color="generic"
      label={copied ? intl.formatMessage(messages.copied) : reference}
      onClick={event => {
        event.preventDefault();
        copy(reference);
      }}
      className={classes.pill}
      ref={ref}
    />
  );
};

export default PspReference;
