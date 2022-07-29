import {
  IndicatorOutlined,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
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
    <Tooltip title={title} variant={variant}>
      <TooltipMountWrapper>
        <IndicatorOutlined icon={variant} />
      </TooltipMountWrapper>
    </Tooltip>
  );
};
export default TableLineAlert;
