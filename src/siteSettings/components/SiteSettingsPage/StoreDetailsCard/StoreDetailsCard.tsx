import { DashboardCard } from "@dashboard/components/Card";
import { type ShopErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getShopErrorMessage from "@dashboard/utils/errors/shop";
import { Box, Input, Textarea } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type SiteSettingsPageFormData } from "../SiteSettingsPage";
import { messages } from "./messages";

interface StoreDetailsFieldsProps {
  data: Pick<SiteSettingsPageFormData, "name" | "description">;
  errors: ShopErrorFragment[];
  disabled: boolean;
  onChange: FormChange;
}

/** Form fields for store name/description — used inside SettingsSection. */
export const StoreDetailsFields = ({
  data,
  disabled,
  errors,
  onChange,
}: StoreDetailsFieldsProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "description"], errors);

  return (
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
  );
};

interface StoreDetailsCardProps extends StoreDetailsFieldsProps {}

/** @deprecated Prefer StoreDetailsFields inside SettingsSection; kept for Storybook. */
export const StoreDetailsCard = ({
  data,
  disabled,
  errors,
  onChange,
}: StoreDetailsCardProps): JSX.Element => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.cardTitle)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <StoreDetailsFields data={data} errors={errors} disabled={disabled} onChange={onChange} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

StoreDetailsCard.displayName = "StoreDetailsCard";
