import { DashboardCard } from "@dashboard/components/Card";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";
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
      <DashboardCard.Title title={intl.formatMessage(messages.userStatus)} />
      <DashboardCard.Content>
        <Text size={3} fontWeight="regular">
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
