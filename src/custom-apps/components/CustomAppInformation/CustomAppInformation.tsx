// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { AppErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    cardTitle: {
      paddingRight: 16,
    },
  },
  { name: "AccountPermissions" },
);

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
  const classes = useStyles();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title className={classes.cardTitle}>
          {intl.formatMessage({
            id: "imYxM9",
            defaultMessage: "App Information",
            description: "header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomAppInformation.displayName = "CustomAppInformation";
export default CustomAppInformation;
