import CardTitle from "@dashboard/components/CardTitle";
import { AppErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import { Card, CardContent, TextField } from "@material-ui/core";
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
