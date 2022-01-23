import { Tooltip } from "@saleor/macaw-ui";
import React from "react";
import { MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";

import { TableCellHeaderProps } from "../TableCellHeader";
import { tooltipTableCellHeaderMessages as messages } from "./messages";
import { RefTableCellHeader } from "./RefTableCellHeader";

interface TooltipTableCellHeaderProps extends TableCellHeaderProps {
  filterDependency?: string;
  overrideMessage?: MessageDescriptor;
}

export const TooltipTableCellHeader: React.FC<TooltipTableCellHeaderProps> = props => {
  const {
    children,
    filterDependency,
    overrideMessage,
    disabled,
    ...rest
  } = props;

  const intl = useIntl();

  const tooltipDisabled = () => {
    if (!filterDependency && !overrideMessage) {
      return true;
    }
    return !disabled;
  };

  return (
    <Tooltip
      title={intl.formatMessage(
        !!overrideMessage ? overrideMessage : messages.noFilterSelected,
        {
          filterName: filterDependency
        }
      )}
      placement="top"
      disabled={tooltipDisabled()}
    >
      <RefTableCellHeader disabled={disabled} {...rest}>
        {children}
      </RefTableCellHeader>
    </Tooltip>
  );
};

TooltipTableCellHeader.displayName = "TooltipTableCellHeader";
export default TooltipTableCellHeader;
