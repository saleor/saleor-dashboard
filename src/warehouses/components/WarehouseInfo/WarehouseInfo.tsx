import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { FormChange } from "@saleor/hooks/useForm";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";

export interface WarehouseInfoProps {
  data: Record<"name", string>;
  disabled: boolean;
  errors: UserError[];
  onChange: FormChange;
}

const WarehouseInfo: React.FC<WarehouseInfoProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          fullWidth
          helperText={getFieldError(errors, "name")?.message}
          label={intl.formatMessage({
            defaultMessage: "Warehouse Name"
          })}
          name={"name" as keyof typeof data}
          value={data.name}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
