import BackButton from "@dashboard/components/BackButton";
import { useChannelsSearch } from "@dashboard/components/ChannelsAvailabilityDialog/utils";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import { type INotification } from "@dashboard/components/notifications";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { useChannelsQuery, useGiftCardResendMutation } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getBySlug } from "@dashboard/misc";
import { type DialogProps } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { mapSlugNodeToChoice } from "@dashboard/utils/maps";
import { Box, DynamicCombobox, Input, type Option, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getGiftCardErrorMessage } from "../messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { getGiftCardResendDefaultRecipient } from "./getGiftCardResendDefaultRecipient";
import { giftCardResendCodeDialogMessages as messages } from "./messages";
import { useDialogFormReset } from "./utils";

interface GiftCardResendCodeFormData {
  channelSlug: string;
  email: string;
}

const RecipientMode = {
  Custom: "custom",
  Default: "default",
} as const;

type RecipientMode = (typeof RecipientMode)[keyof typeof RecipientMode];

export const GiftCardResendCodeDialog = ({ open, onClose }: DialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const isSubmittingRef = useRef(false);
  const { giftCard } = useGiftCardDetails();
  const initialChannelSlug = giftCard?.boughtInChannel ?? "";
  const giftCardId = giftCard?.id ?? "";
  const { canManageChannels } = useGiftCardPermissions();
  const [recipientMode, setRecipientMode] = useState<RecipientMode>(RecipientMode.Default);
  const { data: channelsData, loading: loadingChannels } = useChannelsQuery({
    skip: !canManageChannels,
  });
  const channels = channelsData?.channels;
  const activeChannels = channels?.filter(({ isActive }) => isActive) ?? [];
  const { onQueryChange, filteredChannels } = useChannelsSearch(activeChannels);
  const initialFormData: GiftCardResendCodeFormData = {
    channelSlug: initialChannelSlug || "",
    email: "",
  };

  const defaultRecipient = useMemo(() => getGiftCardResendDefaultRecipient(giftCard), [giftCard]);

  const defaultRecipientLabel = useMemo(() => {
    if (defaultRecipient.email) {
      return defaultRecipient.email;
    }

    if (defaultRecipient.name) {
      return defaultRecipient.name;
    }

    return intl.formatMessage(messages.defaultRecipientFallback);
  }, [defaultRecipient, intl]);

  const handleSubmit = async ({ channelSlug, email }: GiftCardResendCodeFormData) => {
    const result = await resendGiftCardCode({
      variables: {
        input: {
          channel: channelSlug,
          email: recipientMode === RecipientMode.Custom ? email || null : null,
          id: giftCardId,
        },
      },
    });

    return result?.data?.giftCardResend?.errors ?? [];
  };

  const { data, change, submit, reset } = useForm(initialFormData, handleSubmit);
  const [resendGiftCardCode, resendGiftCardCodeOpts] = useGiftCardResendMutation({
    onCompleted: mutationData => {
      const errors = mutationData?.giftCardResend?.errors;
      const notifierData: INotification = errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.successResendAlertText),
          };

      notify(notifierData);

      if (!errors?.length) {
        onClose();
        reset();
      }
    },
  });
  const { status, data: submitData } = resendGiftCardCodeOpts;
  const isSubmitting = status === "loading";

  isSubmittingRef.current = isSubmitting;

  const { formErrors } = useDialogFormReset({
    apiErrors: submitData?.giftCardResend?.errors ?? [],
    keys: ["email"],
    open,
    reset,
  });

  useModalDialogOpen(open, {
    onClose: () => {
      setRecipientMode(RecipientMode.Default);
    },
  });

  const handleRecipientModeChange = (value: string): void => {
    const nextMode = value as RecipientMode;

    setRecipientMode(nextMode);

    if (nextMode === RecipientMode.Default) {
      change({
        target: {
          name: "email",
          value: "",
        },
      });
    }
  };

  const isCustomRecipient = recipientMode === RecipientMode.Custom;
  const isSubmitDisabled =
    isSubmitting ||
    loadingChannels ||
    !data.channelSlug ||
    (isCustomRecipient && !data.email.trim());

  const handleClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <DashboardModal.Content size="sm">
          <DashboardModal.ContextHeader>
            <FormattedMessage {...messages.title} />
          </DashboardModal.ContextHeader>

          <DashboardModal.Body fill>
            <DashboardModal.Inset>
              {loadingChannels ? (
                <Box display="flex" width="100%" justifyContent="center" padding={6}>
                  <SaleorThrobber />
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={6}>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <ModalSectionHeader>
                      <FormattedMessage {...messages.recipientSectionTitle} />
                    </ModalSectionHeader>

                    <RadioGroup value={recipientMode} onValueChange={handleRecipientModeChange}>
                      <Box display="flex" flexDirection="column" gap={3}>
                        <RadioGroup.Item
                          data-test-id="recipient-default"
                          id="recipient-default"
                          value={RecipientMode.Default}
                        >
                          <Text>
                            <FormattedMessage
                              {...messages.defaultRecipientLabel}
                              values={{ recipient: defaultRecipientLabel }}
                            />
                          </Text>
                        </RadioGroup.Item>
                        <RadioGroup.Item
                          data-test-id="recipient-custom"
                          id="recipient-custom"
                          value={RecipientMode.Custom}
                        >
                          <Text>
                            <FormattedMessage {...messages.customRecipientLabel} />
                          </Text>
                        </RadioGroup.Item>
                      </Box>
                    </RadioGroup>

                    {isCustomRecipient ? (
                      <Input
                        disabled={isSubmitting}
                        error={!!formErrors?.email}
                        helperText={getGiftCardErrorMessage(formErrors?.email, intl)}
                        label={intl.formatMessage(messages.emailFieldLabel)}
                        name="email"
                        onChange={change}
                        value={data.email}
                        width="100%"
                      />
                    ) : null}
                  </Box>

                  <Box display="flex" flexDirection="column" gap={3}>
                    <ModalSectionHeader>
                      <FormattedMessage {...messages.notificationSectionTitle} />
                    </ModalSectionHeader>

                    <DynamicCombobox
                      disabled={isSubmitting}
                      label={intl.formatMessage(messages.sendFromChannelLabel)}
                      name="channelSlug"
                      onChange={(option: Option | null) => {
                        change({
                          target: {
                            name: "channelSlug",
                            value: option?.value ?? "",
                          },
                        });
                      }}
                      onInputValueChange={onQueryChange}
                      options={mapSlugNodeToChoice(filteredChannels)}
                      size="small"
                      value={
                        data?.channelSlug
                          ? {
                              label: channels?.find(getBySlug(data?.channelSlug))?.name ?? "",
                              value: data?.channelSlug,
                            }
                          : null
                      }
                    />

                    <Text color="default2" size={2}>
                      <FormattedMessage {...messages.sendFromChannelHelper} />
                    </Text>
                  </Box>
                </Box>
              )}
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton disabled={isSubmitting || loadingChannels} onClick={handleClose} />
            <ConfirmButton
              data-test-id="submit"
              disabled={isSubmitDisabled}
              onClick={submit}
              transitionState={status}
            >
              <FormattedMessage {...messages.submitButtonLabel} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};

GiftCardResendCodeDialog.displayName = "GiftCardResendCodeDialog";
