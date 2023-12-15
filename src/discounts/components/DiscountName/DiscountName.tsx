import { DashboardCard } from "@dashboard/components/Card";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

interface DiscountNameProps {
  disabled?: boolean;
  error: string | undefined;
}

export const DiscountName = ({ disabled, error }: DiscountNameProps) => {
  const intl = useIntl();
  const { formState } = useFormContext<DiscoutFormData>();
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
          error={!!error || !!formState.errors?.name}
          helperText={error || formState.errors?.name?.message}
          label={intl.formatMessage({
            defaultMessage: "Discount name",
            id: "lJXkFS",
            description: "discount name",
          })}
          disabled={disabled || field.disabled}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
