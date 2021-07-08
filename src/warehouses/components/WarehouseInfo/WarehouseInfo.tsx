import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { WarehouseErrorFragment } from "@saleor/fragments/types/WarehouseErrorFragment";
import { FormChange } from "@saleor/hooks/useForm";
import useRandomString from "@saleor/hooks/useRandomString";
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
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  const randomAutoCompleteName = useRandomString();

  return (
    <Card data-test="generalInformationSection">
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
            defaultMessage: "Warehouse Name"
          })}
          name={"name" as keyof typeof data}
          value={data.name}
          onChange={onChange}
          InputProps={{
            inputProps: {
              /* 
                autocomplete="off" doesn't always work in chrome, 
                workaround to mislead chrome autofill 
                https://stackoverflow.com/a/34998771/3993664
              */
              autoComplete: `off-${randomAutoCompleteName}`
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
