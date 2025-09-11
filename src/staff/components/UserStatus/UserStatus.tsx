import { DashboardCard } from "@dashboard/components/Card";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";
import * as React from "react";
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

const AppStatus = ({ data, disabled, label, onChange }: AppStatusProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.userStatus)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text fontSize={3} display="block">
          {intl.formatMessage(messages.userDisableInstruction)}
        </Text>
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
