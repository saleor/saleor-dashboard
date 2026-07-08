// @ts-strict-ignore
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { useGiftCardCreateMutation } from "@dashboard/graphql";
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardCreateDialogCodeContent } from "./GiftCardCreateDialogCodeContent";
import {
  GiftCardCreateDialogFields,
  type GiftCardCreateFormData,
  useGiftCardCreateDialogForm,
} from "./GiftCardCreateDialogForm";
import { giftCardCreateMessages as messages } from "./messages";
import { type GiftCardCreateFormCustomer } from "./types";
import { getCreateGiftCardInputData, getGiftCardCreateOnCompletedMessage } from "./utils";

interface GiftCardCreateDialogContentProps {
  initialCustomer?: GiftCardCreateFormCustomer | null;
  onClose: () => void;
  open: boolean;
  refetchQueries?: string[];
}

export const GiftCardCreateDialogContent = ({
  initialCustomer,
  onClose,
  open,
  refetchQueries,
}: GiftCardCreateDialogContentProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { channel } = useAppChannel(false);
  const currentDate = useCurrentDate();
  const [cardCode, setCardCode] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const [createGiftCard, createGiftCardOpts] = useGiftCardCreateMutation({
    refetchQueries,
  });
  const apiErrors = createGiftCardOpts.data?.giftCardCreate?.errors ?? [];
  const formErrors = getFormErrors(
    ["tags", "expiryDate", "customer", "currency", "amount", "balance"],
    apiErrors,
  );
  const confirmButtonState: ConfirmButtonTransitionState = createGiftCardOpts.status;
  const isSubmitting = confirmButtonState === "loading";
  const isActionsDisabled = isSubmitting;

  isSubmittingRef.current = isSubmitting;

  const handleClose = () => {
    if (isSubmittingRef.current) {
      return;
    }

    setCardCode(null);
    onClose();
  };

  const handleSubmit = async (
    data: GiftCardCreateFormData,
    selectedCustomer: GiftCardCreateFormCustomer,
  ) => {
    const result = await createGiftCard({
      variables: {
        input: getCreateGiftCardInputData(
          data,
          selectedCustomer,
          currentDate,
          data.channelSlug || channel?.slug,
        ),
      },
    });
    const errors = result.data?.giftCardCreate?.errors ?? [];

    if (errors.length) {
      notify(getGiftCardCreateOnCompletedMessage(errors, intl));
    }

    if (!errors.length) {
      setCardCode(result.data?.giftCardCreate?.giftCard?.code ?? null);
    }
  };

  const {
    change,
    data,
    loadingSettings,
    selectedCustomer,
    set,
    setSelectedCustomer,
    shouldEnableSubmitButton,
    submit,
    toggleValue,
  } = useGiftCardCreateDialogForm({
    initialCustomer,
    onSubmit: handleSubmit,
    open,
  });

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <DashboardModal.Content data-test-id="gift-card-dialog" size="sm">
          {cardCode ? (
            <>
              <DashboardModal.ContextHeader
                description={<FormattedMessage {...messages.successDescription} />}
              >
                <FormattedMessage {...messages.successTitle} />
              </DashboardModal.ContextHeader>
              <DashboardModal.Body fill>
                <DashboardModal.Inset>
                  <GiftCardCreateDialogCodeContent cardCode={cardCode} />
                </DashboardModal.Inset>
              </DashboardModal.Body>
              <DashboardModal.Actions>
                <Button
                  data-test-id="gift-card-success-done"
                  onClick={handleClose}
                  variant="primary"
                >
                  <FormattedMessage {...messages.bulkCreateIssuedAccept} />
                </Button>
              </DashboardModal.Actions>
            </>
          ) : (
            <>
              <DashboardModal.ContextHeader
                description={<FormattedMessage {...messages.description} />}
              >
                <FormattedMessage {...messages.title} />
              </DashboardModal.ContextHeader>
              <DashboardModal.Body fill>
                <DashboardModal.Inset>
                  {loadingSettings ? (
                    <Box display="flex" alignItems="center" justifyContent="center" padding={6}>
                      <SaleorThrobber />
                    </Box>
                  ) : (
                    <GiftCardCreateDialogFields
                      change={change}
                      data={data}
                      formErrors={formErrors}
                      initialCustomer={initialCustomer}
                      selectedCustomer={selectedCustomer}
                      set={set}
                      setSelectedCustomer={setSelectedCustomer}
                      toggleValue={toggleValue}
                    />
                  )}
                </DashboardModal.Inset>
              </DashboardModal.Body>
              <DashboardModal.Actions>
                <BackButton disabled={isActionsDisabled || loadingSettings} onClick={handleClose}>
                  <FormattedMessage {...buttonMessages.cancel} />
                </BackButton>
                <ConfirmButton
                  data-test-id="submit"
                  disabled={!shouldEnableSubmitButton || isActionsDisabled || loadingSettings}
                  transitionState={confirmButtonState}
                  onClick={submit}
                >
                  <FormattedMessage {...messages.issueButtonLabel} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </>
          )}
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};
