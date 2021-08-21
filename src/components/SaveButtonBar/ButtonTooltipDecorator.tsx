import { Tooltip } from "@material-ui/core";
import React from "react";

interface ButtonTooltipDecoratorProps {
  tooltip?: string;
}

export const ButtonTooltipDecorator: React.FC<ButtonTooltipDecoratorProps> = ({
  tooltip,
  children
}) => {
  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top">
        <span>{children}</span>
      </Tooltip>
    );
  }

  return <>{children}</>;
};
ButtonTooltipDecorator.displayName = "ButtonTooltipDecorator";
export default ButtonTooltipDecorator;
