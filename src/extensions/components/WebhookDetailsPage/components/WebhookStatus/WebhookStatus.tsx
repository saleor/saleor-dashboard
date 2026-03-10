import { Toggle } from "@macaw-ui";
import { useIntl } from "react-intl";

import { type WebhookFormData } from "../../WebhookDetailsPage";
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
