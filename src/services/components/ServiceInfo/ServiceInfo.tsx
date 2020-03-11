import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { FormChange } from "@saleor/hooks/useForm";
import { AccountErrorFragment } from "@saleor/customers/types/AccountErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";

export interface ServiceInfoProps {
  data: {
    name: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: FormChange;
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

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
          error={!!formErrors.name}
          label={intl.formatMessage({
            defaultMessage: "Account Name",
            description: "service account"
          })}
          helperText={getAccountErrorMessage(formErrors.name, intl)}
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
