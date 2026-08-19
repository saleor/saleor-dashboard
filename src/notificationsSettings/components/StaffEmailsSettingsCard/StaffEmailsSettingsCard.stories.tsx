import { ADMIN_EMAIL_NOTIFICATIONS } from "@dashboard/notificationsSettings/constants";
import {
  type EmailNotificationsFormState,
  type NotificationFormValues,
} from "@dashboard/notificationsSettings/utils/emailNotificationConfig";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";

import {
  type StaffEmailDeliveryMode,
  StaffEmailsSettingsCard,
  StaffMessagesSettingsCard,
} from "./StaffEmailsSettingsCard";

const meta = {
  title: "Notifications / StaffEmailsSettingsCard",
  component: StaffEmailsSettingsCard,
};

export default meta;

const initialFormState: EmailNotificationsFormState = {
  active: true,
  notifications: Object.fromEntries(
    ADMIN_EMAIL_NOTIFICATIONS.map(definition => [
      definition.id,
      {
        subject: "Example subject",
        templateMode: "default",
        customTemplate: "",
      } satisfies NotificationFormValues,
    ]),
  ),
  otherFields: {},
};

export const CloudDefaultDelivery = (): JSX.Element => {
  const [deliveryMode, setDeliveryMode] = useState<StaffEmailDeliveryMode>("default");
  const [formState, setFormState] = useState<EmailNotificationsFormState>(initialFormState);

  return (
    <Box padding={6} __maxWidth="48rem" display="flex" flexDirection="column" gap={5}>
      <StaffEmailsSettingsCard
        formState={formState}
        deliveryMode={deliveryMode}
        disabled={false}
        smtpFieldErrors={{}}
        smtpConnectionError={null}
        onActiveChange={active => setFormState(current => ({ ...current, active }))}
        onDeliveryModeChange={setDeliveryMode}
        onSmtpFieldChange={(name, value) =>
          setFormState(current => ({
            ...current,
            otherFields: { ...current.otherFields, [name]: value },
          }))
        }
      />
      <StaffMessagesSettingsCard
        formState={formState}
        definitions={ADMIN_EMAIL_NOTIFICATIONS}
        deliveryMode={deliveryMode}
        disabled={false}
        onNotificationChange={(id, values) =>
          setFormState(current => ({
            ...current,
            notifications: { ...current.notifications, [id]: values },
          }))
        }
      />
    </Box>
  );
};
