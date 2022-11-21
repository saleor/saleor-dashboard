import { makeStyles } from "@material-ui/core";
import { Tooltip } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

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
  },
  {
    name: "OverflowTooltip",
  },
);

const OverflowTooltip: React.FC<OverflowTooltipProps> = ({
  checkHorizontal = true,
  checkVertical = true,
  title,
  header,
  className,
  children,
}) => {
  const classes = useStyles();

  const { ref, isOverflow } = useOverflow<HTMLDivElement>({
    horizontal: checkHorizontal,
    vertical: checkVertical,
  });

  return (
    <Tooltip title={title ?? children} header={header} disabled={!isOverflow}>
      <div ref={ref} className={classNames(classes.wrapper, className)}>
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
