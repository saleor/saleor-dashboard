import { Card, CardContent, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordProps {
  onChangePassword: () => void;
}

const StaffPassword: React.FC<StaffPasswordProps> = ({ onChangePassword }) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "ZhDQel",
          defaultMessage: "Password",
          description: "header",
        })}
        toolbar={
          <Button onClick={onChangePassword}>
            <FormattedMessage
              id="N3Zot1"
              defaultMessage="Change your password"
              description="button"
            />
          </Button>
        }
      />
      <CardContent>
        <Typography>
          <FormattedMessage
            id="mm0CXe"
            defaultMessage="You should change your password every month to avoid security issues."
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

StaffPassword.displayName = "StaffPassword";
export default StaffPassword;
