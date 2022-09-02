import { makeStyles } from "@material-ui/core";
import useClipboard from "@saleor/hooks/useClipboard";
import { Pill } from "@saleor/macaw-ui";
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
      setWidth(el.offsetWidth);
    }
    ref.current = el;
  };

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
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
      outlined
      // preserve width when text changes to "Copied"
      style={{ width: `${width}px` }}
      color="generic"
      label={copied ? intl.formatMessage(messages.copied) : reference}
      onClick={() => copy(reference)}
      className={classes.pill}
      ref={ref}
    />
  );
};

export default PspReference;
