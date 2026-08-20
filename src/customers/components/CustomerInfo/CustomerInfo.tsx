// @ts-strict-ignore
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type AccountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { Box, Input, Textarea } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useIntl } from "react-intl";

interface CustomerInfoProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerInfo = (props: CustomerInfoProps) => {
  const { data, disabled, errors, onChange } = props;
  const intl = useIntl();
  const formErrors = getFormErrors(["firstName", "lastName", "email", "note"], errors);

  return (
    <DetailSettingsCard
      data-test-id="customer-details"
      title={intl.formatMessage(commonMessages.generalInformations)}
    >
      <Box display="flex" flexDirection="column" gap={5}>
        <Box display="grid" __gridTemplateColumns="1fr 1fr" gap={5}>
          <Input
            data-test-id="customer-first-name"
            disabled={disabled}
            error={!!formErrors.firstName}
            helperText={getAccountErrorMessage(formErrors.firstName, intl)}
            name="firstName"
            label={intl.formatMessage(commonMessages.firstName)}
            value={data.firstName}
            onChange={onChange}
          />
          <Input
            data-test-id="customer-last-name"
            disabled={disabled}
            error={!!formErrors.lastName}
            helperText={getAccountErrorMessage(formErrors.lastName, intl)}
            name="lastName"
            label={intl.formatMessage(commonMessages.lastName)}
            value={data.lastName}
            onChange={onChange}
          />
        </Box>
        <Input
          data-test-id="customer-email"
          disabled={disabled}
          error={!!formErrors.email}
          helperText={getAccountErrorMessage(formErrors.email, intl)}
          name="email"
          type="email"
          label={intl.formatMessage(commonMessages.email)}
          value={data.email}
          onChange={onChange}
        />
        <Textarea
          data-test-id="customer-note"
          disabled={disabled}
          error={!!formErrors.note}
          helperText={formErrors.note ? getAccountErrorMessage(formErrors.note, intl) : undefined}
          name="note"
          rows={2}
          label={intl.formatMessage({
            id: "uUQ+Al",
            defaultMessage: "Note",
            description: "note about customer",
          })}
          value={data.note}
          onChange={onChange}
        />
      </Box>
    </DetailSettingsCard>
  );
};

CustomerInfo.displayName = "CustomerInfo";
export default CustomerInfo;
