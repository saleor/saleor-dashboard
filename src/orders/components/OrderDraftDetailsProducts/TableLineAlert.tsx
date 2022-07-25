import {
  IndicatorOutlined,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
import React from "react";

interface TableLineAlertProps {
  alerts?: string[];
}

const TableLineAlert: React.FC<TableLineAlertProps> = ({ alerts }) => {
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
    <Tooltip title={title} variant="warning">
      <TooltipMountWrapper>
        <IndicatorOutlined icon="warning" />
      </TooltipMountWrapper>
    </Tooltip>
  );
};
export default TableLineAlert;
