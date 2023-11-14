import { DashboardCard } from "@dashboard/components/Card";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { Inputs } from "../../types";

export const DiscountName = () => {
  const intl = useIntl();
  const { field } = useController<Inputs, "name">({ name: "name" });

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
