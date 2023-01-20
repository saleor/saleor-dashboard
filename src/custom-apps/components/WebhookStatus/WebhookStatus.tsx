import CardTitle from "@dashboard/components/CardTitle";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { WebhookFormData } from "../WebhookDetailsPage";
import { messages } from "./messages";

interface WebhookStatusProps {
  data: boolean;
  disabled: boolean;
  onChange: (event: ChangeEvent, cb?: () => void) => void;
}

const WebhookStatus: React.FC<WebhookStatusProps> = ({
  data,
  disabled,
  onChange,
}) => {
  const intl = useIntl();
  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.webhookStatus)} />
      <CardContent>
        <Typography variant="body1">
          {intl.formatMessage(messages.webhookActiveDescription)}
        </Typography>
        <ControlledCheckbox
          name={"isActive" as keyof WebhookFormData}
          label={intl.formatMessage(messages.webhookActive)}
          checked={data}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
WebhookStatus.displayName = "WebhookStatus";
export default WebhookStatus;
