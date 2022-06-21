import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { ChangeEvent } from "@saleor/hooks/useForm";
import React from "react";
import { useIntl } from "react-intl";

import { FormData } from "../WebhookDetailsPage";
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
          name={"isActive" as keyof FormData}
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
