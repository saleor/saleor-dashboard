import { Tooltip } from "@saleor/macaw-ui";
import React from "react";

import { TableCellHeaderProps } from "../TableCellHeader";
import { RefTableCellHeader } from "./RefTableCellHeader";

interface TooltipTableCellHeaderProps extends TableCellHeaderProps {
  tooltip?: string;
}

export const TooltipTableCellHeader: React.FC<TooltipTableCellHeaderProps> = props => {
  const { children, tooltip, disabled, ...rest } = props;

  const tooltipDisabled = () => {
    if (!tooltip) {
      return true;
    }
    return !disabled;
  };

  return (
    <Tooltip title={tooltip} placement="top" disabled={tooltipDisabled()}>
      <RefTableCellHeader disabled={disabled} {...rest}>
        {children}
      </RefTableCellHeader>
    </Tooltip>
  );
};

TooltipTableCellHeader.displayName = "TooltipTableCellHeader";
export default TooltipTableCellHeader;
