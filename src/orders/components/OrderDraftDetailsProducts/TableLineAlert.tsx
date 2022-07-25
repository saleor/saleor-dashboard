import {
  IndicatorOutlined,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
import React from "react";

interface TableLineAlertProps {
  alerts?: string[];
  variant: "warning" | "error";
}

const TableLineAlert: React.FC<TableLineAlertProps> = ({ alerts, variant }) => {
  if (!alerts.length) {
    return null;
  }

  const title =
    alerts.length === 1 ? (
      <>{alerts[0]}</>
    ) : (
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    );

  return (
    <Tooltip title={title} variant={variant}>
      <TooltipMountWrapper>
        <IndicatorOutlined icon={variant} />
      </TooltipMountWrapper>
    </Tooltip>
  );
};
export default TableLineAlert;
