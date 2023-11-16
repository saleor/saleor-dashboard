import { DashboardCard } from "@dashboard/components/Card";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

export const DiscountName = () => {
  const intl = useIntl();
  const { field } = useController<DiscoutFormData, "name">({
    name: "name",
  });

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <FormattedMessage defaultMessage="General Information" id="pkUbrL" />
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Input
          {...field}
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
