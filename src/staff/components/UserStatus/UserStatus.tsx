import { DashboardCard } from "@dashboard/components/Card";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Typography } from "@material-ui/core";
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
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.userStatus)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AppStatus.displayName = "AppStatus";
export default AppStatus;
