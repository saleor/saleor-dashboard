import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { FormChange } from "@saleor/hooks/useForm";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";

export interface ServiceInfoProps {
  data: {
    name: string;
  };
  disabled: boolean;
  errors: UserError[];
  onChange: FormChange;
}

const ServiceInfo: React.FC<ServiceInfoProps> = props => {
  const { data, disabled, errors, onChange } = props;
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Service Account Information",
          description: "header"
        })}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          label={intl.formatMessage({
            defaultMessage: "Account Name",
            description: "service account"
          })}
          helperText={getFieldError(errors, "name")?.message}
          fullWidth
          name="name"
          value={data.name}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

ServiceInfo.displayName = "ServiceInfo";
export default ServiceInfo;
