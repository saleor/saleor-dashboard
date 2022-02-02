import { Tooltip } from "@saleor/macaw-ui";
import React from "react";

import TableCellHeader, { TableCellHeaderProps } from "../TableCellHeader";

interface TooltipTableCellHeaderProps extends TableCellHeaderProps {
  tooltip?: string | React.ReactNodeArray;
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
      <TableCellHeader disabled={disabled} {...rest}>
        {children}
      </TableCellHeader>
    </Tooltip>
  );
};

TooltipTableCellHeader.displayName = "TooltipTableCellHeader";
export default TooltipTableCellHeader;
