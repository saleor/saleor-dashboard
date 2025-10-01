import { Toggle } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { WebhookFormData } from "../../WebhookDetailsPage";
import { messages } from "./messages";

interface WebhookStatusProps {
  data: boolean;
  disabled: boolean;
  setValue: (data: Partial<WebhookFormData>) => void;
}

export const WebhookStatus = ({ data, disabled, setValue }: WebhookStatusProps) => {
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
