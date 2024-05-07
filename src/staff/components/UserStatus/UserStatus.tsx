import CardTitle from "@dashboard/components/CardTitle";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { userStatusMessages as messages } from "./messages";

interface AppStatusProps {
  data: {
    isActive: boolean;
  };
  disabled: boolean;
  label: React.ReactNode;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AppStatus: React.FC<AppStatusProps> = ({ data, disabled, label, onChange }) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.userStatus)} />
      <CardContent>
        <Typography variant="body2">
          {intl.formatMessage(messages.userDisableInstruction)}
        </Typography>
        <ControlledCheckbox
          data-test-id="is-active-checkbox"
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
