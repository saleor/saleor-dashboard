import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordProps {
  onChangePassword: () => void;
}

const StaffPassword: React.FC<StaffPasswordProps> = ({ onChangePassword }) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "ZhDQel",
          defaultMessage: "Password",
          description: "header",
        })}
      />
      <DashboardCard.Toolbar>
        <Button onClick={onChangePassword} data-test-id="changePasswordBtn">
          <FormattedMessage
            id="N3Zot1"
            defaultMessage="Change your password"
            description="button"
          />
        </Button>
      </DashboardCard.Toolbar>
      <DashboardCard.Content>
        <Text>
          <FormattedMessage
            id="mm0CXe"
            defaultMessage="You should change your password every month to avoid security issues."
          />
        </Text>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

StaffPassword.displayName = "StaffPassword";
export default StaffPassword;
