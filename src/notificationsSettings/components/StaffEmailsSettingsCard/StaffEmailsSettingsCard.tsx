import { Callout } from "@dashboard/components/Callout/Callout";
import { DetailSettingToggleRow } from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { InsetSegmentedControl } from "@dashboard/components/InsetSegmentedControl/InsetSegmentedControl";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { VoucherDiscountSubsectionHeader } from "@dashboard/discounts/components/VoucherDiscountSection/VoucherDiscountSubsectionHeader";
import { VoucherScopeTile } from "@dashboard/discounts/components/VoucherDiscountSection/VoucherScopeTile";
import {
  type EmailNotificationDefinition,
  type TemplateMode,
} from "@dashboard/notificationsSettings/constants";
import {
  notificationsMessages,
  staffNotificationCopy,
} from "@dashboard/notificationsSettings/messages";
import { notificationsCustomerEmailsPath } from "@dashboard/notificationsSettings/urls";
import {
  type EmailNotificationsFormState,
  ensureSmtpFieldDefaults,
  getNotificationCopyStatus,
  isEmptyCustomEmailBody,
  type NotificationCopyStatus,
  type NotificationFormValues,
} from "@dashboard/notificationsSettings/utils/emailNotificationConfig";
import { Box, Input, Text, Textarea } from "@saleor/macaw-ui-next";
import {
  ChevronDown,
  ChevronRight,
  Cloud,
  Download,
  FileWarning,
  KeyRound,
  Server,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import { StaffEmailPreview } from "../StaffEmailPreview/StaffEmailPreview";
import styles from "./StaffEmailsSettingsCard.module.css";

export type StaffEmailDeliveryMode = "default" | "custom";

interface StaffEmailsSettingsCardProps {
  formState: EmailNotificationsFormState;
  deliveryMode: StaffEmailDeliveryMode;
  disabled: boolean;
  smtpFieldErrors: Record<string, string>;
  smtpConnectionError: string | null;
  onActiveChange: (active: boolean) => void;
  onDeliveryModeChange: (mode: StaffEmailDeliveryMode) => void;
  onSmtpFieldChange: (name: string, value: string) => void;
}

interface StaffMessagesSettingsCardProps {
  formState: EmailNotificationsFormState;
  definitions: EmailNotificationDefinition[];
  deliveryMode: StaffEmailDeliveryMode;
  disabled: boolean;
  onNotificationChange: (id: string, values: NotificationFormValues) => void;
}

const STRING_FIELDS = [
  "host",
  "port",
  "username",
  "password",
  "sender_name",
  "sender_address",
] as const;

const BOOLEAN_FIELDS = ["use_tls", "use_ssl"] as const;

const fieldLabelMessage = {
  host: notificationsMessages.smtpHost,
  port: notificationsMessages.smtpPort,
  username: notificationsMessages.smtpUsername,
  password: notificationsMessages.smtpPassword,
  sender_name: notificationsMessages.smtpSenderName,
  sender_address: notificationsMessages.smtpSenderAddress,
  use_tls: notificationsMessages.smtpUseTls,
  use_ssl: notificationsMessages.smtpUseSsl,
} as const;

const TEMPLATE_MODES: TemplateMode[] = ["default", "custom", "off"];

const getStaffCopy = (id: string, suffix: "" | "Desc"): MessageDescriptor => {
  const key = `${id}${suffix}` as keyof typeof staffNotificationCopy;

  return staffNotificationCopy[key];
};

export const StaffEmailsSettingsCard = ({
  formState,
  deliveryMode,
  disabled,
  smtpFieldErrors,
  smtpConnectionError,
  onActiveChange,
  onDeliveryModeChange,
  onSmtpFieldChange,
}: StaffEmailsSettingsCardProps): JSX.Element => {
  const intl = useIntl();
  const smtpValues = ensureSmtpFieldDefaults(formState.otherFields);
  const tlsSslError = smtpFieldErrors.use_tls || smtpFieldErrors.use_ssl || undefined;

  return (
    <SettingsSection
      id={settingsHashes.notificationsStaff}
      title={intl.formatMessage(notificationsMessages.staffEmailsTitle)}
      ownership="shop"
      data-test-id="staff-emails-settings-card"
    >
      <Box className={styles.section}>
        <DetailSettingToggleRow
          title={intl.formatMessage(notificationsMessages.emailsEnabledTitle)}
          description={intl.formatMessage(notificationsMessages.emailsEnabledDescription)}
          pressed={formState.active}
          disabled={disabled}
          onPressedChange={onActiveChange}
          testId="notifications-active-toggle"
        />

        {formState.active ? (
          <Box
            id={settingsHashes.notificationsDelivery}
            className={styles.subsectionBlock}
            data-test-id="staff-email-delivery"
          >
            <VoucherDiscountSubsectionHeader
              title={intl.formatMessage(notificationsMessages.staffDeliveryTitle)}
              hint={
                <FormattedMessage
                  {...notificationsMessages.staffDeliveryDescription}
                  values={{
                    customerEmailsLink: (
                      <MicrocopyLink to={notificationsCustomerEmailsPath}>
                        <FormattedMessage
                          {...notificationsMessages.staffDeliveryCustomerEmailsLink}
                        />
                      </MicrocopyLink>
                    ),
                  }}
                />
              }
            />
            <Box
              role="radiogroup"
              aria-label={intl.formatMessage(notificationsMessages.staffDeliveryTitle)}
              className={styles.deliveryGrid}
            >
              <VoucherScopeTile
                value="default"
                checked={deliveryMode === "default"}
                title={intl.formatMessage(notificationsMessages.staffDeliveryModeDefault)}
                description={
                  IS_CLOUD_INSTANCE
                    ? intl.formatMessage(notificationsMessages.staffDeliveryModeDefaultHintCloud)
                    : intl.formatMessage(
                        notificationsMessages.staffDeliveryModeDefaultHintSelfHosted,
                      )
                }
                icon={Cloud}
                disabled={disabled}
                onSelect={value => {
                  if (value === "default" || value === "custom") {
                    onDeliveryModeChange(value);
                  }
                }}
                data-test-id="staff-delivery-default"
              />
              <VoucherScopeTile
                value="custom"
                checked={deliveryMode === "custom"}
                title={intl.formatMessage(notificationsMessages.staffDeliveryModeCustom)}
                description={intl.formatMessage(notificationsMessages.staffDeliveryModeCustomHint)}
                icon={Server}
                disabled={disabled}
                onSelect={value => {
                  if (value === "default" || value === "custom") {
                    onDeliveryModeChange(value);
                  }
                }}
                data-test-id="staff-delivery-custom"
              />
            </Box>

            {deliveryMode === "default" ? (
              <Text size={2} color="default2">
                {IS_CLOUD_INSTANCE
                  ? intl.formatMessage(notificationsMessages.staffDeliveryDefaultBodyCloud)
                  : intl.formatMessage(notificationsMessages.staffDeliveryDefaultBodySelfHosted)}
              </Text>
            ) : (
              <Box display="flex" flexDirection="column" gap={4}>
                <Callout
                  type="info"
                  title={intl.formatMessage(notificationsMessages.deliveryWhyTitle)}
                  data-test-id="staff-delivery-why-callout"
                >
                  <Box as="ul" className={styles.whyList}>
                    <Box as="li">{intl.formatMessage(notificationsMessages.deliveryWhyBrand)}</Box>
                    <Box as="li">
                      {intl.formatMessage(notificationsMessages.deliveryWhyCompliance)}
                    </Box>
                    <Box as="li">
                      {intl.formatMessage(notificationsMessages.deliveryWhyMarketing)}
                    </Box>
                  </Box>
                </Callout>

                {smtpConnectionError ? (
                  <Callout
                    type="error"
                    title={intl.formatMessage(notificationsMessages.smtpConnectionFailedTitle)}
                    data-test-id="staff-smtp-connection-error"
                  >
                    {smtpConnectionError}
                  </Callout>
                ) : null}

                <Box className={styles.smtpFields}>
                  {STRING_FIELDS.map(name => {
                    const fieldError = smtpFieldErrors[name];
                    const defaultHelper =
                      name === "password"
                        ? intl.formatMessage(notificationsMessages.smtpPasswordHelper)
                        : name === "host"
                          ? intl.formatMessage(notificationsMessages.smtpHostHelper)
                          : undefined;

                    return (
                      <Input
                        key={name}
                        name={name}
                        type={name === "password" ? "password" : "text"}
                        autoComplete={name === "password" ? "new-password" : "off"}
                        label={intl.formatMessage(fieldLabelMessage[name])}
                        value={smtpValues[name] ?? ""}
                        disabled={disabled}
                        error={!!fieldError}
                        placeholder={
                          name === "host"
                            ? intl.formatMessage(notificationsMessages.smtpHostPlaceholder)
                            : undefined
                        }
                        helperText={fieldError ?? defaultHelper}
                        onChange={event => onSmtpFieldChange(name, event.target.value)}
                      />
                    );
                  })}
                </Box>
                <Box className={styles.smtpToggles}>
                  {BOOLEAN_FIELDS.map(name => (
                    <DetailSettingToggleRow
                      key={name}
                      title={intl.formatMessage(fieldLabelMessage[name])}
                      description=""
                      pressed={(smtpValues[name] ?? "false") === "true"}
                      disabled={disabled}
                      onPressedChange={checked =>
                        onSmtpFieldChange(name, checked ? "true" : "false")
                      }
                      testId={`smtp-toggle-${name}`}
                    />
                  ))}
                </Box>
                {tlsSslError ? (
                  <Text size={2} color="critical1" data-test-id="staff-smtp-tls-ssl-error">
                    {tlsSslError}
                  </Text>
                ) : null}
              </Box>
            )}
          </Box>
        ) : null}
      </Box>
    </SettingsSection>
  );
};

export const StaffMessagesSettingsCard = ({
  formState,
  definitions,
  deliveryMode,
  disabled,
  onNotificationChange,
}: StaffMessagesSettingsCardProps): JSX.Element => {
  const intl = useIntl();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const lockCustomCopy = IS_CLOUD_INSTANCE && deliveryMode === "default";
  const contentDisabled = disabled || !formState.active;

  return (
    <SettingsSection
      id={settingsHashes.notificationsMessages}
      title={intl.formatMessage(notificationsMessages.messagesSubsectionTitle)}
      description={
        lockCustomCopy
          ? intl.formatMessage(notificationsMessages.templateLockedToDefaultHint)
          : intl.formatMessage(notificationsMessages.messagesSubsectionHint)
      }
      ownership="shop"
      data-test-id="staff-messages-settings-card"
    >
      <Box as="ul" className={styles.messageList}>
        {definitions.map(definition => {
          const values = formState.notifications[definition.id];

          if (!values) {
            return null;
          }

          const isExpanded = expandedId === definition.id;

          return (
            <NotificationEmailEditor
              key={definition.id}
              id={definition.id}
              title={intl.formatMessage(getStaffCopy(definition.id, ""))}
              description={intl.formatMessage(getStaffCopy(definition.id, "Desc"))}
              icon={getNotificationIcon(definition.id)}
              values={values}
              defaultSubject={definition.defaultSubject}
              variables={definition.variables}
              disabled={contentDisabled}
              lockCustomCopy={lockCustomCopy}
              expanded={isExpanded}
              onToggle={() => setExpandedId(isExpanded ? null : definition.id)}
              onChange={next => onNotificationChange(definition.id, next)}
            />
          );
        })}
      </Box>
    </SettingsSection>
  );
};

const getNotificationIcon = (id: string): ReactNode => {
  switch (id) {
    case "staff-invite":
      return <UserPlus size={16} strokeWidth={1.75} />;
    case "staff-password-reset":
      return <KeyRound size={16} strokeWidth={1.75} />;
    case "staff-order-confirmation":
      return <ShoppingBag size={16} strokeWidth={1.75} />;
    case "csv-export-success":
      return <Download size={16} strokeWidth={1.75} />;
    case "csv-export-failed":
      return <FileWarning size={16} strokeWidth={1.75} />;
    default:
      return <Cloud size={16} strokeWidth={1.75} />;
  }
};

interface NotificationEmailEditorProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  values: NotificationFormValues;
  defaultSubject: string;
  variables: string[];
  disabled: boolean;
  lockCustomCopy: boolean;
  expanded: boolean;
  onToggle: () => void;
  onChange: (next: NotificationFormValues) => void;
}

const getCopyStatusLabel = (
  status: NotificationCopyStatus,
  intl: ReturnType<typeof useIntl>,
): string => {
  switch (status) {
    case "off":
      return intl.formatMessage(notificationsMessages.templateOff);
    case "custom-subject":
      return intl.formatMessage(notificationsMessages.statusCustomSubject);
    case "custom-body":
      return intl.formatMessage(notificationsMessages.statusCustomBody);
    case "custom-subject-and-body":
      return intl.formatMessage(notificationsMessages.statusCustomSubjectAndBody);
    case "default":
    default:
      return intl.formatMessage(notificationsMessages.templateDefault);
  }
};

const NotificationEmailEditor = ({
  id,
  title,
  description,
  icon,
  values,
  defaultSubject,
  variables,
  disabled,
  lockCustomCopy,
  expanded,
  onToggle,
  onChange,
}: NotificationEmailEditorProps): JSX.Element => {
  const intl = useIntl();
  const templateRef = useRef<HTMLTextAreaElement | null>(null);
  const effectiveTemplateMode = lockCustomCopy ? "default" : values.templateMode;
  const statusLabel = getCopyStatusLabel(
    getNotificationCopyStatus({
      values,
      defaultSubject,
      lockToDefault: lockCustomCopy,
    }),
    intl,
  );

  const insertVariable = (variable: string): void => {
    const token = `{{ ${variable} }}`;
    const el = templateRef.current;
    const current = values.customTemplate ?? "";

    if (!el) {
      onChange({
        ...values,
        templateMode: "custom",
        customTemplate: current + token,
      });

      return;
    }

    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);

    onChange({
      ...values,
      templateMode: "custom",
      customTemplate: next,
    });

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <Box
      as="li"
      className={expanded ? `${styles.messageRow} ${styles.messageRowExpanded}` : styles.messageRow}
      data-test-id={`notification-email-card-${id}`}
    >
      <Box
        as="button"
        type="button"
        className={styles.messageRowHeader}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <Box className={styles.messageIcon} aria-hidden>
          {icon}
        </Box>
        <Box className={styles.messageContent}>
          <Text size={3} fontWeight="medium">
            {title}
          </Text>
          <Text size={2} color="default2">
            {description}
          </Text>
        </Box>
        <Box className={styles.messageStatus}>
          <Box className={styles.messageStatusDot} aria-hidden />
          <Text size={2} color="default2">
            {statusLabel}
          </Text>
          <Box className={styles.messageChevron} aria-hidden>
            {expanded ? (
              <ChevronDown size={16} strokeWidth={1.75} />
            ) : (
              <ChevronRight size={16} strokeWidth={1.75} />
            )}
          </Box>
        </Box>
      </Box>

      {expanded ? (
        <Box className={styles.messagePanel}>
          <Box className={styles.messagePanelCard}>
            {lockCustomCopy ? (
              <StaffEmailPreview
                notificationId={id}
                subject={defaultSubject}
                templateMode="default"
                customTemplate=""
              />
            ) : (
              <>
                <InsetSegmentedControl
                  aria-label={title}
                  size="sm"
                  className={styles.templateModeControl}
                  value={effectiveTemplateMode}
                  data-test-id={`notification-template-mode-${id}`}
                  onChange={mode => {
                    if (!disabled) {
                      onChange({
                        ...values,
                        templateMode: mode,
                        customTemplate: mode === "custom" ? values.customTemplate : "",
                      });
                    }
                  }}
                  options={TEMPLATE_MODES.map(mode => ({
                    value: mode,
                    label:
                      mode === "default"
                        ? intl.formatMessage(notificationsMessages.templateDefault)
                        : mode === "custom"
                          ? intl.formatMessage(notificationsMessages.templateCustom)
                          : intl.formatMessage(notificationsMessages.templateOff),
                    testId: `notification-template-mode-${id}-${mode}`,
                  }))}
                />

                {effectiveTemplateMode === "off" ? (
                  <Text size={2} color="default2">
                    {intl.formatMessage(notificationsMessages.templateOffHint)}
                  </Text>
                ) : null}

                {effectiveTemplateMode !== "off" ? (
                  <Input
                    name={`${id}-subject`}
                    label={intl.formatMessage(notificationsMessages.subjectLabel)}
                    value={values.subject}
                    disabled={disabled}
                    onChange={event => onChange({ ...values, subject: event.target.value })}
                  />
                ) : null}

                {effectiveTemplateMode === "custom" ? (
                  <Box display="flex" flexDirection="column" gap={3}>
                    {variables.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Text size={1} color="default2">
                          {intl.formatMessage(notificationsMessages.variablesLabel)}
                        </Text>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {variables.map(variable => (
                            <Box
                              key={variable}
                              as="button"
                              type="button"
                              disabled={disabled}
                              onClick={() => insertVariable(variable)}
                              borderStyle="solid"
                              borderWidth={1}
                              borderColor="default1"
                              borderRadius={2}
                              paddingX={2}
                              paddingY={0.5}
                              backgroundColor="transparent"
                              cursor={disabled ? "not-allowed" : "pointer"}
                              fontSize={1}
                              color="default2"
                            >
                              {variable}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : null}
                    <Textarea
                      ref={templateRef}
                      name={`${id}-template`}
                      label={intl.formatMessage(notificationsMessages.templateCustomPlaceholder)}
                      value={values.customTemplate}
                      disabled={disabled}
                      rows={8}
                      error={isEmptyCustomEmailBody(values)}
                      helperText={
                        isEmptyCustomEmailBody(values)
                          ? intl.formatMessage(notificationsMessages.templateCustomBodyRequired)
                          : undefined
                      }
                      onChange={event =>
                        onChange({
                          ...values,
                          customTemplate: event.target.value,
                        })
                      }
                    />
                  </Box>
                ) : null}

                <StaffEmailPreview
                  notificationId={id}
                  subject={values.subject}
                  templateMode={effectiveTemplateMode}
                  customTemplate={values.customTemplate}
                />
              </>
            )}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
