import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { AppErrorFragment } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { getFormErrors } from "@saleor/utils/errors";
import getAppErrorMessage from "@saleor/utils/errors/app";
import React from "react";
import { useIntl } from "react-intl";

export interface CustomAppInfoProps {
  data: {
    name: string;
  };
  disabled: boolean;
  errors: AppErrorFragment[];
  onChange: FormChange;
}

const CustomAppInformation: React.FC<CustomAppInfoProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "imYxM9",
          defaultMessage: "App Information",
          description: "header",
        })}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          label={intl.formatMessage({
            id: "foNlhn",
            defaultMessage: "App Name",
            description: "custom app name",
          })}
          helperText={getAppErrorMessage(formErrors.name, intl)}
          fullWidth
          name="name"
          value={data.name}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

CustomAppInformation.displayName = "CustomAppInformation";
export default CustomAppInformation;
