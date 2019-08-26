import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";

interface StaffStatusProps {
  data: {
    isActive: boolean;
  };
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const StaffStatus: React.StatelessComponent<StaffStatusProps> = ({
  data,
  disabled,
  onChange
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Account Status",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography>
          <FormattedMessage defaultMessage="If you want to disable this account uncheck the box below" />
        </Typography>
        <ControlledCheckbox
          checked={data.isActive}
          disabled={disabled}
          label={intl.formatMessage({
            defaultMessage: "User is active",
            description: "checkbox label"
          })}
          name="isActive"
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
StaffStatus.displayName = "StaffStatus";
export default StaffStatus;
