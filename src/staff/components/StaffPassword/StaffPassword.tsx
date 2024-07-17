import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordProps {
  onChangePassword: () => void;
}

const StaffPassword: React.FC<StaffPasswordProps> = ({ onChangePassword }) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header withToolbar>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "ZhDQel",
            defaultMessage: "Password",
            description: "header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button onClick={onChangePassword} data-test-id="changePasswordBtn">
            <FormattedMessage
              id="N3Zot1"
              defaultMessage="Change your password"
              description="button"
            />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Typography>
          <FormattedMessage
            id="mm0CXe"
            defaultMessage="You should change your password every month to avoid security issues."
          />
        </Typography>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

StaffPassword.displayName = "StaffPassword";
export default StaffPassword;
