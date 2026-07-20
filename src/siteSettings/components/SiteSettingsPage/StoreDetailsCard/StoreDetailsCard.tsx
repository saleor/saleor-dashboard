import { DashboardCard } from "@dashboard/components/Card";
import { type ShopErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getShopErrorMessage from "@dashboard/utils/errors/shop";
import { Box, Input, Textarea } from "@saleor/macaw-ui-next";
import { type ChangeEvent } from "react";
import { useIntl } from "react-intl";

import { type SiteSettingsPageFormData } from "../SiteSettingsPage";
import { messages } from "./messages";

interface StoreDetailsCardProps {
  data: Pick<SiteSettingsPageFormData, "name" | "description">;
  errors: ShopErrorFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const StoreDetailsCard = ({ data, disabled, errors, onChange }: StoreDetailsCardProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "description"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.cardTitle)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={5}>
          <Input
            data-test-id="store-name-input"
            name="name"
            label={intl.formatMessage(messages.nameLabel)}
            value={data.name}
            disabled={disabled}
            error={!!formErrors.name}
            helperText={getShopErrorMessage(formErrors.name, intl)}
            onChange={onChange}
          />
          <Textarea
            data-test-id="store-description-input"
            name="description"
            label={intl.formatMessage(messages.descriptionLabel)}
            value={data.description}
            disabled={disabled}
            error={!!formErrors.description}
            helperText={getShopErrorMessage(formErrors.description, intl)}
            onChange={onChange}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

StoreDetailsCard.displayName = "StoreDetailsCard";
