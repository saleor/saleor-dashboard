import { IndicatorOutlined, TooltipMountWrapper } from "@saleor/macaw-ui";
import { Tooltip } from "@saleor/macaw-ui/next";
import React from "react";

import OrderAlerts from "../OrderAlerts";

interface TableLineAlertProps {
  alerts?: string[];
  variant: "warning" | "error";
}

const TableLineAlert: React.FC<TableLineAlertProps> = ({ alerts, variant }) => {
  if (!alerts.length) {
    return null;
  }

  const title = <OrderAlerts alerts={alerts} />;

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <TooltipMountWrapper>
          <IndicatorOutlined icon={variant} />
        </TooltipMountWrapper>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        {title}
      </Tooltip.Content>
    </Tooltip>
  );
};
export default TableLineAlert;
