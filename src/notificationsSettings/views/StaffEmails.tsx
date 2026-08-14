import { scrollToDetailSection } from "@dashboard/components/Layouts/Detail/scrollElementIntoDetailContent";
import { IS_CLOUD_INSTANCE, PAIRED_ERROR_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { usePluginQuery, usePluginUpdateMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import { DisableStaffEmailsDialog } from "@dashboard/notificationsSettings/components/DisableStaffEmailsDialog/DisableStaffEmailsDialog";
import { EmailNotificationsPage } from "@dashboard/notificationsSettings/components/EmailNotificationsPage/EmailNotificationsPage";
import { type StaffEmailDeliveryMode } from "@dashboard/notificationsSettings/components/StaffEmailsSettingsCard/StaffEmailsSettingsCard";
import { SwitchToDefaultDeliveryDialog } from "@dashboard/notificationsSettings/components/SwitchToDefaultDeliveryDialog/SwitchToDefaultDeliveryDialog";
import {
  ADMIN_EMAIL_NOTIFICATIONS,
  ADMIN_EMAIL_PLUGIN_ID,
} from "@dashboard/notificationsSettings/constants";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import {
  buildConfigurationInputFromFormState,
  buildFormStateFromConfiguration,
  clearSmtpFields,
  type CustomSmtpClientErrorCode,
  type EmailNotificationsFormState,
  forceDefaultNotificationCopy,
  getCustomSmtpClientErrors,
  hasBlockingEmptyCustomEmailBody,
  hasCustomSmtpClientErrors,
  hasStaffEmailCustomizationsToLose,
  hasStaffSmtpOverrides,
  type NotificationFormValues,
} from "@dashboard/notificationsSettings/utils/emailNotificationConfig";
import {
  getNonSmtpPluginErrorMessage,
  mapPluginErrorsToSmtpState,
} from "@dashboard/notificationsSettings/utils/smtpPluginErrors";
import {
  buildStaffEmailTemplatesExport,
  downloadStaffEmailTemplatesJson,
} from "@dashboard/notificationsSettings/utils/staffEmailTemplatesExport";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const scrollToStaffDelivery = (): void => {
  scrollToDetailSection(settingsHashes.notificationsDelivery);
};

export const StaffEmailsView = (): JSX.Element => {
  const intl = useIntl();
  const notify = useNotifier();
  const { data, loading } = usePluginQuery({
    displayLoader: true,
    variables: { id: ADMIN_EMAIL_PLUGIN_ID },
  });

  const plugin = data?.plugin;
  const selectedConfig = plugin?.globalConfiguration;

  const initialFormState = useMemo(() => {
    if (!selectedConfig) {
      return null;
    }

    return buildFormStateFromConfiguration({
      active: selectedConfig.active,
      configuration: selectedConfig.configuration,
      definitions: ADMIN_EMAIL_NOTIFICATIONS,
    });
  }, [selectedConfig]);

  const [formState, setFormState] = useState<EmailNotificationsFormState | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<StaffEmailDeliveryMode>("default");
  const [confirmDefaultSaveOpen, setConfirmDefaultSaveOpen] = useState(false);
  const [confirmDisableEmailsOpen, setConfirmDisableEmailsOpen] = useState(false);
  const [smtpFieldErrors, setSmtpFieldErrors] = useState<Record<string, string>>({});
  const [smtpConnectionError, setSmtpConnectionError] = useState<string | null>(null);

  useEffect(
    function syncStaffEmailFormFromPlugin() {
      setFormState(initialFormState);
      setDeliveryMode(
        initialFormState && hasStaffSmtpOverrides(initialFormState.otherFields)
          ? "custom"
          : "default",
      );
      setConfirmDefaultSaveOpen(false);
      setConfirmDisableEmailsOpen(false);
      setSmtpFieldErrors({});
      setSmtpConnectionError(null);
    },
    [initialFormState],
  );

  const [pluginUpdate, pluginUpdateOpts] = usePluginUpdateMutation({
    onCompleted: result => {
      if (result.pluginUpdate?.errors.length === 0) {
        setConfirmDefaultSaveOpen(false);
        setConfirmDisableEmailsOpen(false);
        setSmtpFieldErrors({});
        setSmtpConnectionError(null);
        notify({
          status: "success",
          title: intl.formatMessage(notificationsMessages.saved),
        });
      }
    },
  });

  const formatClientSmtpError = useCallback(
    (code: CustomSmtpClientErrorCode): string => {
      switch (code) {
        case "invalidEmail":
          return intl.formatMessage(notificationsMessages.smtpSenderAddressInvalid);
        case "tlsSslExclusive":
          return intl.formatMessage(notificationsMessages.smtpTlsSslExclusive);
        case "required":
        default:
          return intl.formatMessage(notificationsMessages.smtpFieldRequired);
      }
    },
    [intl],
  );

  const notifySmtpSaveFailed = useCallback(
    (hasInlineErrors: boolean, detail?: string | null) => {
      notify({
        status: "error",
        title: intl.formatMessage(notificationsMessages.couldNotSaveNotificationSettings),
        text:
          detail?.trim() ||
          intl.formatMessage(
            hasInlineErrors
              ? notificationsMessages.checkSmtpFields
              : notificationsMessages.tryAgainShort,
          ),
        autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
      });
    },
    [intl, notify],
  );

  const handleActiveChange = useCallback((active: boolean) => {
    setFormState(current => (current ? { ...current, active } : current));
  }, []);

  const handleDeliveryModeChange = useCallback((mode: StaffEmailDeliveryMode) => {
    // Mode switch is local only — nothing is persisted until Save.
    setDeliveryMode(mode);
    setSmtpFieldErrors({});
    setSmtpConnectionError(null);
  }, []);

  const handleDownloadTemplatesBackup = useCallback(() => {
    if (!formState) {
      return;
    }

    downloadStaffEmailTemplatesJson(
      buildStaffEmailTemplatesExport({
        formState,
        definitions: ADMIN_EMAIL_NOTIFICATIONS,
      }),
    );
  }, [formState]);

  const handleNotificationChange = useCallback((id: string, values: NotificationFormValues) => {
    setFormState(current =>
      current
        ? {
            ...current,
            notifications: {
              ...current.notifications,
              [id]: values,
            },
          }
        : current,
    );
  }, []);

  const handleSmtpFieldChange = useCallback((name: string, value: string) => {
    setFormState(current =>
      current
        ? {
            ...current,
            otherFields: {
              ...current.otherFields,
              [name]: value,
            },
          }
        : current,
    );
    setSmtpFieldErrors(current => {
      const fieldsToClear =
        name === "use_tls" || name === "use_ssl" ? ["use_tls", "use_ssl"] : [name];

      if (!fieldsToClear.some(field => current[field])) {
        return current;
      }

      const next = { ...current };

      for (const field of fieldsToClear) {
        delete next[field];
      }

      return next;
    });
    setSmtpConnectionError(null);
  }, []);

  const persistStaffEmails = useCallback(async () => {
    if (!formState) {
      return;
    }

    let stateForSave = formState;
    const clearingSmtp = deliveryMode === "default";

    if (!clearingSmtp && formState.active) {
      const clientErrors = getCustomSmtpClientErrors(formState.otherFields);

      if (hasCustomSmtpClientErrors(clientErrors)) {
        const fieldErrors: Record<string, string> = {};

        for (const [field, code] of Object.entries(clientErrors)) {
          if (code) {
            fieldErrors[field] = formatClientSmtpError(code);
          }
        }

        setSmtpFieldErrors(fieldErrors);
        setSmtpConnectionError(null);
        scrollToStaffDelivery();
        notifySmtpSaveFailed(true);

        return;
      }
    }

    if (clearingSmtp) {
      stateForSave = {
        ...formState,
        otherFields: clearSmtpFields(formState.otherFields),
      };

      // Cloud rejects custom subjects/bodies when SMTP is the platform default.
      if (IS_CLOUD_INSTANCE) {
        stateForSave = forceDefaultNotificationCopy({
          formState: stateForSave,
          definitions: ADMIN_EMAIL_NOTIFICATIONS,
        });
      }
    }

    const errors = await extractMutationErrors(
      pluginUpdate({
        variables: {
          id: ADMIN_EMAIL_PLUGIN_ID,
          input: {
            active: stateForSave.active,
            configuration: buildConfigurationInputFromFormState({
              formState: stateForSave,
              definitions: ADMIN_EMAIL_NOTIFICATIONS,
              includeSmtp: true,
              // Empty password must be sent when clearing Default SMTP so the stored secret is wiped.
              omitEmptyPassword: !clearingSmtp,
            }),
          },
        },
      }),
    );

    if (errors.length > 0) {
      const smtpState = mapPluginErrorsToSmtpState(errors);
      const hasInline =
        Object.keys(smtpState.fieldErrors).length > 0 || !!smtpState.connectionError;

      setSmtpFieldErrors(smtpState.fieldErrors);
      setSmtpConnectionError(smtpState.connectionError);

      if (hasInline) {
        scrollToStaffDelivery();
      }

      notifySmtpSaveFailed(hasInline, hasInline ? null : getNonSmtpPluginErrorMessage(errors));
    }
  }, [deliveryMode, formState, formatClientSmtpError, notifySmtpSaveFailed, pluginUpdate]);

  const needsDefaultSaveConfirm =
    !!formState &&
    deliveryMode === "default" &&
    hasStaffEmailCustomizationsToLose(formState, ADMIN_EMAIL_NOTIFICATIONS, {
      resetNotificationCopy: IS_CLOUD_INSTANCE,
    });

  const copyEditable = !(IS_CLOUD_INSTANCE && deliveryMode === "default");
  const blocksSaveDueToEmptyBody =
    !!formState &&
    hasBlockingEmptyCustomEmailBody({
      formState,
      copyEditable,
    });

  const handleSubmit = useCallback(async () => {
    if (!formState) {
      return;
    }

    // Empty custom body would serialize as “Don’t send” — only when copy is editable.
    if (
      hasBlockingEmptyCustomEmailBody({
        formState,
        copyEditable,
      })
    ) {
      return;
    }

    const isDisabling = !!initialFormState?.active && !formState.active;

    if (isDisabling) {
      setConfirmDisableEmailsOpen(true);

      return;
    }

    if (needsDefaultSaveConfirm) {
      setConfirmDefaultSaveOpen(true);

      return;
    }

    await persistStaffEmails();
  }, [
    copyEditable,
    formState,
    initialFormState?.active,
    needsDefaultSaveConfirm,
    persistStaffEmails,
  ]);

  const handleConfirmDisableEmails = useCallback(async () => {
    setConfirmDisableEmailsOpen(false);

    if (needsDefaultSaveConfirm) {
      setConfirmDefaultSaveOpen(true);

      return;
    }

    await persistStaffEmails();
  }, [needsDefaultSaveConfirm, persistStaffEmails]);

  const handleConfirmDefaultSave = useCallback(async () => {
    await persistStaffEmails();
  }, [persistStaffEmails]);

  const isDirty =
    !!formState &&
    !!initialFormState &&
    (JSON.stringify(formState) !== JSON.stringify(initialFormState) ||
      deliveryMode !==
        (hasStaffSmtpOverrides(initialFormState.otherFields) ? "custom" : "default"));

  const isSaveDisabled = !isDirty || blocksSaveDueToEmptyBody;

  return (
    <>
      <EmailNotificationsPage
        formState={formState}
        definitions={ADMIN_EMAIL_NOTIFICATIONS}
        deliveryMode={deliveryMode}
        disabled={loading || pluginUpdateOpts.loading}
        isSaveDisabled={isSaveDisabled}
        saveButtonBarState={pluginUpdateOpts.status}
        smtpFieldErrors={smtpFieldErrors}
        smtpConnectionError={smtpConnectionError}
        onActiveChange={handleActiveChange}
        onDeliveryModeChange={handleDeliveryModeChange}
        onNotificationChange={handleNotificationChange}
        onSmtpFieldChange={handleSmtpFieldChange}
        onSubmit={handleSubmit}
      />
      <SwitchToDefaultDeliveryDialog
        open={confirmDefaultSaveOpen}
        confirmButtonState={pluginUpdateOpts.status}
        resetNotificationCopy={IS_CLOUD_INSTANCE}
        onClose={() => setConfirmDefaultSaveOpen(false)}
        onConfirm={handleConfirmDefaultSave}
        onDownloadBackup={handleDownloadTemplatesBackup}
      />
      <DisableStaffEmailsDialog
        open={confirmDisableEmailsOpen}
        confirmButtonState={pluginUpdateOpts.status}
        onClose={() => setConfirmDisableEmailsOpen(false)}
        onConfirm={handleConfirmDisableEmails}
      />
    </>
  );
};
