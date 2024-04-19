import ControlledSwitch from "@dashboard/components/ControlledSwitch";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import React from "react";
import { useIntl } from "react-intl";

import { WebhookFormData } from "../WebhookDetailsPage";
import { messages } from "./messages";

interface WebhookStatusProps {
  data: boolean;
  disabled: boolean;
  onChange: (event: ChangeEvent, cb?: () => void) => void;
}

const WebhookStatus: React.FC<WebhookStatusProps> = ({ data, disabled, onChange }) => {
  const intl = useIntl();

  return (
    <ControlledSwitch
      name={"isActive" as keyof WebhookFormData}
      label={
        data
          ? intl.formatMessage(messages.webhookActive)
          : intl.formatMessage(messages.webhookInactive)
      }
      checked={data}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

WebhookStatus.displayName = "WebhookStatus";
export default WebhookStatus;
