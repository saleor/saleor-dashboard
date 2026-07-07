import BackButton from "@dashboard/components/BackButton";
import { useChannelsSearch } from "@dashboard/components/ChannelsAvailabilityDialog/utils";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type INotification } from "@dashboard/components/notifications";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { useChannelsQuery, useGiftCardResendMutation } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getBySlug } from "@dashboard/misc";
import { type DialogProps } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { mapSlugNodeToChoice } from "@dashboard/utils/maps";
import { Box, Checkbox, DynamicCombobox, Input, type Option, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getGiftCardErrorMessage } from "../messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardResendCodeDialogMessages as messages } from "./messages";
import { useDialogFormReset } from "./utils";

interface GiftCardResendCodeFormData {
  channelSlug: string;
  email: string;
}

export const GiftCardResendCodeDialog = ({ open, onClose }: DialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const isSubmittingRef = useRef(false);
  const { giftCard } = useGiftCardDetails();
  const initialChannelSlug = giftCard?.boughtInChannel ?? "";
  const giftCardId = giftCard?.id ?? "";
  const { canManageChannels } = useGiftCardPermissions();
  const [consentSelected, setConsentSelected] = useState(false);
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

  const handleSubmit = async ({ channelSlug, email }: GiftCardResendCodeFormData) => {
    const result = await resendGiftCardCode({
      variables: {
        input: {
          channel: channelSlug,
          email: email || null,
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

  useEffect(reset, [consentSelected]);

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
          <DashboardModal.ContextHeader
            description={<FormattedMessage {...messages.description} />}
          >
            <FormattedMessage {...messages.title} />
          </DashboardModal.ContextHeader>

          <DashboardModal.Body fill>
            <DashboardModal.Inset>
              {loadingChannels ? (
                <Box display="flex" width="100%" justifyContent="center" padding={6}>
                  <SaleorThrobber />
                </Box>
              ) : (
                <Box display="grid" gap={4}>
                  <DynamicCombobox
                    disabled={isSubmitting}
                    label={intl.formatMessage(messages.sendToChannelSelectLabel)}
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
                  <Checkbox
                    checked={consentSelected}
                    disabled={isSubmitting}
                    name="differentMailConsent"
                    onCheckedChange={value => setConsentSelected(value as boolean)}
                  >
                    <Text fontSize={3}>
                      <FormattedMessage {...messages.consentCheckboxLabel} />
                    </Text>
                  </Checkbox>
                  <Input
                    disabled={!consentSelected || isSubmitting}
                    error={!!formErrors?.email}
                    helperText={getGiftCardErrorMessage(formErrors?.email, intl)}
                    label={intl.formatMessage(messages.emailInputPlaceholder)}
                    name="email"
                    onChange={change}
                    value={data.email}
                    width="100%"
                  />
                </Box>
              )}
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton disabled={isSubmitting || loadingChannels} onClick={handleClose} />
            <ConfirmButton
              data-test-id="submit"
              disabled={isSubmitting || loadingChannels}
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
