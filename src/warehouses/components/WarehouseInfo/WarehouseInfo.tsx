import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type WarehouseErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getWarehouseErrorMessage from "@dashboard/utils/errors/warehouse";
import { messages } from "@dashboard/warehouses/messages";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface WarehouseInfoProps {
  data: {
    name: string;
    email: string;
  };
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  onChange: FormChange;
}

export const WarehouseInfo = ({ data, disabled, errors, onChange }: WarehouseInfoProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "email"], errors);

  return (
    <DetailSettingsCard
      title={intl.formatMessage(messages.general)}
      data-test-id="general-information-section"
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Input
          data-test-id="warehouse-name-input"
          disabled={disabled}
          error={!!formErrors.name}
          aria-invalid={!!formErrors.name}
          helperText={getWarehouseErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.name)}
          name="name"
          value={data.name}
          onChange={onChange}
          autoComplete="none"
        />
        <Input
          disabled={disabled}
          error={!!formErrors.email}
          aria-invalid={!!formErrors.email}
          data-test-id="company-email-input"
          helperText={getWarehouseErrorMessage(formErrors.email, intl)}
          label={intl.formatMessage(messages.email)}
          name="email"
          value={data.email}
          onChange={onChange}
          autoComplete="email"
          spellCheck={false}
        />
      </Box>
    </DetailSettingsCard>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
