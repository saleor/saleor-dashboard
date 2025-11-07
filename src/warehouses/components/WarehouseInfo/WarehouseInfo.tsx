import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { WarehouseErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getWarehouseErrorMessage from "@dashboard/utils/errors/warehouse";
import { TextField } from "@material-ui/core";
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

const WarehouseInfo = ({ data, disabled, errors, onChange }: WarehouseInfoProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "email"], errors);

  return (
    <DashboardCard data-test-id="general-information-section" paddingTop={9}>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TextField
          data-test-id="warehouse-name-input"
          disabled={disabled}
          error={!!formErrors.name}
          fullWidth
          helperText={getWarehouseErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage({
            id: "llBnr+",
            defaultMessage: "Warehouse Name",
          })}
          name={"name" as keyof typeof data}
          value={data.name}
          onChange={onChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
            },
          }}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.email}
          data-test-id="company-email-input"
          fullWidth
          helperText={getWarehouseErrorMessage(formErrors.email, intl)}
          label={intl.formatMessage({
            id: "sy+pv5",
            defaultMessage: "Email",
          })}
          name={"email"}
          value={data.email}
          onChange={onChange}
          InputProps={{
            autoComplete: "email",
            spellCheck: false,
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
