import { Toggle } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { WebhookFormData } from "../../WebhookDetailsPage";
import { messages } from "./messages";

interface WebhookStatusProps {
  data: boolean;
  disabled: boolean;
  setValue: (data: Partial<WebhookFormData>) => void;
}

const WebhookStatus: React.FC<WebhookStatusProps> = ({ data, disabled, setValue }) => {
  const intl = useIntl();

  return (
    <Toggle
      name={"isActive" satisfies keyof WebhookFormData}
      pressed={data}
      onPressedChange={value => {
        setValue({ isActive: value });
      }}
      disabled={disabled}
    >
      {data
        ? intl.formatMessage(messages.webhookActive)
        : intl.formatMessage(messages.webhookInactive)}
    </Toggle>
  );
};

WebhookStatus.displayName = "WebhookStatus";
export default WebhookStatus;
