import { DashboardCard } from "@dashboard/components/Card";
import { WarehouseErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getWarehouseErrorMessage from "@dashboard/utils/errors/warehouse";
import { TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

export interface WarehouseInfoProps {
  data: Record<"name", string>;
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  onChange: FormChange;
}

const WarehouseInfo: React.FC<WarehouseInfoProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard data-test-id="general-information-section" paddingTop={9}>
      <DashboardCard.Title>
        {intl.formatMessage(commonMessages.generalInformations)}
      </DashboardCard.Title>
      <DashboardCard.Content>
        <TextField
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
