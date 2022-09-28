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

enum RenderStep {
  initial,
  checkedMinimal,
  final,
}

/** Calculate static width:
  - must fit at least "Copied"
  - cannot shrink when text changes from pspReference to "Copied"

1. `RenderStep.initial` = Render with text "Copied", save width
2. `RenderStep.checkMinimal` = Render with actual pspReference, save width if larger than "Copied"

If pspReference changes to back to step 1.
*/
const useStaticWidth = (watch: string[] = []) => {
  const ref = useRef<HTMLElement | undefined>();
  const [renderStep, setRenderStep] = useState<RenderStep>(RenderStep.initial);
  const [width, setWidth] = useState<number>(null);

  const onMount = (el: HTMLElement | undefined) => {
    // Initial render, text = "Copied"
    if (el && renderStep === RenderStep.initial) {
      const { width } = el.getBoundingClientRect();
      setWidth(width);
      setRenderStep(RenderStep.checkedMinimal);
    }
    ref.current = el;
  };

  useEffect(() => {
    if (renderStep === RenderStep.checkedMinimal && ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      // Update width if psp reference is logner than "Copied"
      setWidth(prevWidth => (prevWidth > width ? prevWidth : width));
      setRenderStep(RenderStep.final);
    }
  }, [renderStep]);

  useEffect(() => {
    if (ref.current && renderStep === RenderStep.final) {
      // Forces re-calculation of width when text changes
      setWidth(null);
      setRenderStep(RenderStep.initial);
    }
  }, watch);

  return { ref: onMount, width, renderStep };
};

const PspReference: React.FC<{ reference: string }> = ({ reference }) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const classes = useStyles();
  const { ref, width, renderStep } = useStaticWidth([reference]);

  return (
    <Pill
      icon={<CopyIcon />}
      outlined
      // preserve width, see useStaticWidth hook
      style={{
        width:
          width && renderStep === RenderStep.final ? `${width}px` : undefined,
      }}
      color="generic"
      label={
        copied || renderStep === RenderStep.initial
          ? intl.formatMessage(messages.copied)
          : reference
      }
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
