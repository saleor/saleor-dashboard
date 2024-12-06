import ControlledSwitch from "@dashboard/components/ControlledSwitch";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { useIntl } from "react-intl";

import { WebhookFormData } from "../WebhookDetailsPage";
import { messages } from "./messages";

interface WebhookStatusProps {
  data: boolean;
  disabled: boolean;
  onChange: (event: ChangeEvent, cb?: () => void) => void;
}

const WebhookStatus = ({ data, disabled, onChange }: WebhookStatusProps) => {
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
