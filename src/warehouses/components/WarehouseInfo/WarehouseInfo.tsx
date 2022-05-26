import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { WarehouseErrorFragment } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getWarehouseErrorMessage from "@saleor/utils/errors/warehouse";
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
