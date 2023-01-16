import CardTitle from "@dashboard/components/CardTitle";
import { WarehouseErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getWarehouseErrorMessage from "@dashboard/utils/errors/warehouse";
import { Card, CardContent, TextField } from "@material-ui/core";
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
    <Card data-test-id="general-information-section">
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
