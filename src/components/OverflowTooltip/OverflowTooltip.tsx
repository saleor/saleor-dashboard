import { makeStyles } from "@material-ui/core";
import { Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";

import { useOverflow } from "./useOverflow";

interface OverflowTooltipProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  header?: string;
  checkHorizontal?: boolean;
  checkVertical?: boolean;
  className?: string;
}

const useStyles = makeStyles(
  {
    wrapper: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    children: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "80vw",
      wordBreak: "break-word",
    },
  },
  {
    name: "OverflowTooltip",
  },
);
const OverflowTooltip = ({
  checkHorizontal = true,
  checkVertical = true,
  title,
  header,
  className,
  children,
}: OverflowTooltipProps) => {
  const classes = useStyles();
  const { ref, isOverflow } = useOverflow<HTMLDivElement>({
    horizontal: checkHorizontal,
    vertical: checkVertical,
  });

  if (!isOverflow) {
    return (
      <div ref={ref} className={clsx(classes.wrapper, className)}>
        {children}
      </div>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <div ref={ref} className={clsx(classes.wrapper, className)}>
          {children}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        <Tooltip.ContentHeading>{header}</Tooltip.ContentHeading>
        <div className={classes.children}>{title ?? children}</div>
      </Tooltip.Content>
    </Tooltip>
  );
};

export default OverflowTooltip;
