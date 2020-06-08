import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface AppStatusProps {
  data: {
    isActive: boolean;
  };
  disabled: boolean;
  label: React.ReactNode;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AppStatus: React.FC<AppStatusProps> = ({
  data,
  disabled,
  label,
  onChange
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "App Status",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography variant="body2">
          <FormattedMessage defaultMessage="If you want to disable this App please uncheck the box below." />
        </Typography>
        <ControlledCheckbox
          checked={data.isActive}
          disabled={disabled}
          label={label}
          name="isActive"
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
AppStatus.displayName = "AppStatus";
export default AppStatus;
