import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { messages as detailsPageMessages } from "@dashboard/customerTypes/components/CustomerTypeDetailsPage/messages";
import { type CustomerTypeUpdateErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getCustomerTypeErrorMessage from "@dashboard/utils/errors/customerType";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface CustomerTypeDetailsProps {
  data?: {
    name: string;
    slug: string;
  };
  disabled: boolean;
  isDefault?: boolean;
  errors?: CustomerTypeUpdateErrorFragment[];
  onChange: FormChange;
}

export const CustomerTypeDetails = ({
  data,
  disabled,
  isDefault = false,
  errors = [],
  onChange,
}: CustomerTypeDetailsProps): React.ReactNode => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "slug"], errors);

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.generalInformations)}
      data-test-id="customer-type-general-information"
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Input
          disabled={disabled}
          error={!!formErrors.name}
          width="100%"
          helperText={getCustomerTypeErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(commonMessages.name)}
          name="name"
          data-test-id="customer-type-name"
          onChange={onChange}
          value={data?.name ?? ""}
        />
        <Input
          disabled={disabled}
          error={!!formErrors.slug}
          width="100%"
          helperText={getCustomerTypeErrorMessage(formErrors.slug, intl)}
          label={intl.formatMessage(detailsPageMessages.slug)}
          name="slug"
          data-test-id="customer-type-slug"
          onChange={onChange}
          value={data?.slug ?? ""}
        />
        {isDefault ? (
          <Text size={3} color="default2" data-test-id="customer-type-default-hint">
            {intl.formatMessage(detailsPageMessages.defaultHint)}
          </Text>
        ) : null}
      </Box>
    </DetailSettingsCard>
  );
};

CustomerTypeDetails.displayName = "CustomerTypeDetails";
