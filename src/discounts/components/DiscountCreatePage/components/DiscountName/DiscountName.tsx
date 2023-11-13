import { DashboardCard } from "@dashboard/components/Card";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const DiscountName = () => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <FormattedMessage defaultMessage="General Information" id="pkUbrL" />
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Input
          name="name"
          label={intl.formatMessage({
            defaultMessage: "Discount name",
            id: "lJXkFS",
            description: "discount name",
          })}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
