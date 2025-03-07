import { Tooltip } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import TableCellHeader, { TableCellHeaderProps } from "../TableCellHeader";

interface TooltipTableCellHeaderProps extends TableCellHeaderProps {
  tooltip?: string | ReactNode[];
}

export const TooltipTableCellHeader = (props: TooltipTableCellHeaderProps) => {
  const { children, tooltip, disabled, ...rest } = props;
  const tooltipDisabled = () => {
    if (!tooltip) {
      return true;
    }

    return !disabled;
  };

  if (tooltipDisabled()) {
    return (
      <TableCellHeader disabled={disabled} {...rest}>
        {children}
      </TableCellHeader>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <TableCellHeader disabled={disabled} {...rest}>
          {children}
        </TableCellHeader>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  );
};

TooltipTableCellHeader.displayName = "TooltipTableCellHeader";
export default TooltipTableCellHeader;
