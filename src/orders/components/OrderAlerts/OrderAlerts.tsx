import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

interface OrderAlertsProps {
  alerts: Array<string | MessageDescriptor>;
  alertsHeader?: string;
  values?: Record<string, any>;
}

export const OrderAlerts: React.FC<OrderAlertsProps> = ({ alertsHeader, alerts, values }) => {
  const intl = useIntl();
  const formattedAlerts = alerts.map((alert, index) => {
    if (typeof alert === "string") {
      return { id: `${index}_${alert}`, text: alert };
    }

    return {
      id: alert.id,
      text: intl.formatMessage(alert, values),
    };
  });

  if (!formattedAlerts.length) {
    return null;
  }

  if (formattedAlerts.length === 1) {
    return (
      <Text size={3} fontWeight="bold">
        {formattedAlerts[0].text}
      </Text>
    );
  }

  return (
    <>
      {!!alertsHeader && (
        <Text size={4} fontWeight="bold">
          {alertsHeader}
        </Text>
      )}
      <ul>
        {formattedAlerts.map(alert => (
          <li key={alert.id}>{alert.text}</li>
        ))}
      </ul>
    </>
  );
};
OrderAlerts.displayName = "OrderAlerts";
export default OrderAlerts;
