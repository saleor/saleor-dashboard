import { TopNavDestinationIcon } from "@dashboard/components/AppLayout/TopNav/destinationIcons";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Savebar } from "@dashboard/components/Savebar";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import useNavigator from "@dashboard/hooks/useNavigator";
import { type EmailNotificationDefinition } from "@dashboard/notificationsSettings/constants";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import { notificationsSettingsPath } from "@dashboard/notificationsSettings/urls";
import {
  type EmailNotificationsFormState,
  type NotificationFormValues,
} from "@dashboard/notificationsSettings/utils/emailNotificationConfig";
import { useIntl } from "react-intl";

import {
  type StaffEmailDeliveryMode,
  StaffEmailsSettingsCard,
  StaffMessagesSettingsCard,
} from "../StaffEmailsSettingsCard/StaffEmailsSettingsCard";

interface EmailNotificationsPageProps {
  formState: EmailNotificationsFormState | null;
  definitions: EmailNotificationDefinition[];
  deliveryMode: StaffEmailDeliveryMode;
  disabled: boolean;
  isSaveDisabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  smtpFieldErrors: Record<string, string>;
  smtpConnectionError: string | null;
  onActiveChange: (active: boolean) => void;
  onDeliveryModeChange: (mode: StaffEmailDeliveryMode) => void;
  onNotificationChange: (id: string, values: NotificationFormValues) => void;
  onSmtpFieldChange: (name: string, value: string) => void;
  onSubmit: () => void;
}

export const EmailNotificationsPage = ({
  formState,
  definitions,
  deliveryMode,
  disabled,
  isSaveDisabled,
  saveButtonBarState,
  smtpFieldErrors,
  smtpConnectionError,
  onActiveChange,
  onDeliveryModeChange,
  onNotificationChange,
  onSmtpFieldChange,
  onSubmit,
}: EmailNotificationsPageProps): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const formId = "staff-emails-form";

  return (
    <SettingsHubLayout
      title={intl.formatMessage(notificationsMessages.staffEmailsTitle)}
      backHref={notificationsSettingsPath}
      backHrefIcon={<TopNavDestinationIcon.configuration />}
      backHrefTitle={intl.formatMessage(notificationsMessages.hubTitle)}
    >
      <form
        id={formId}
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
        style={{ width: "100%", display: "block" }}
      >
        <SettingsPageContent
          description={intl.formatMessage(notificationsMessages.staffEmailsPageDescription)}
        >
          {formState ? (
            <>
              <StaffEmailsSettingsCard
                formState={formState}
                deliveryMode={deliveryMode}
                disabled={disabled}
                smtpFieldErrors={smtpFieldErrors}
                smtpConnectionError={smtpConnectionError}
                onActiveChange={onActiveChange}
                onDeliveryModeChange={onDeliveryModeChange}
                onSmtpFieldChange={onSmtpFieldChange}
              />
              {formState.active ? (
                <StaffMessagesSettingsCard
                  formState={formState}
                  definitions={definitions}
                  deliveryMode={deliveryMode}
                  disabled={disabled}
                  onNotificationChange={onNotificationChange}
                />
              ) : null}
            </>
          ) : null}
        </SettingsPageContent>
        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={() => navigate(notificationsSettingsPath)} />
          <Savebar.ConfirmButton
            form={formId}
            transitionState={saveButtonBarState}
            disabled={disabled || isSaveDisabled || !formState}
            type="submit"
          />
        </Savebar>
      </form>
    </SettingsHubLayout>
  );
};
