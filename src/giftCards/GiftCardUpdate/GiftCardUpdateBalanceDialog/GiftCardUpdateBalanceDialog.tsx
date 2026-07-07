import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type INotification } from "@dashboard/components/notifications";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { useGiftCardUpdateMutation } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type DialogProps } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { Input, Text } from "@saleor/macaw-ui-next";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import { useDialogFormReset } from "../GiftCardResendCodeDialog/utils";
import { getGiftCardErrorMessage } from "../messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardUpdateBalanceDialogMessages as messages } from "./messages";

interface GiftCardBalanceUpdateFormData {
  balanceAmount: number;
}

export const GiftCardUpdateBalanceDialog = ({ open, onClose }: DialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const isSubmittingRef = useRef(false);
  const { canSeeCreatedBy } = useGiftCardPermissions();
  const { giftCard } = useGiftCardDetails();
  const amount = giftCard?.currentBalance?.amount ?? 0;
  const currency = giftCard?.currentBalance?.currency ?? "";
  const giftCardId = giftCard?.id ?? "";
  const initialFormData: GiftCardBalanceUpdateFormData = {
    balanceAmount: amount,
  };
  const [updateGiftCardBalance, updateGiftCardBalanceOpts] = useGiftCardUpdateMutation({
    onCompleted: mutationData => {
      const errors = mutationData?.giftCardUpdate?.errors;
      const notifierData: INotification = errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.updatedSuccessAlertTitle),
          };

      notify(notifierData);

      if (!errors?.length) {
        onClose();
      }
    },
  });

  const handleSubmit = async ({ balanceAmount }: GiftCardBalanceUpdateFormData) => {
    const result = await updateGiftCardBalance({
      variables: {
        id: giftCardId,
        input: {
          balanceAmount,
        },
        showCreatedBy: canSeeCreatedBy,
      },
    });

    return result?.data?.giftCardUpdate?.errors ?? [];
  };

  const { data, change, submit, reset } = useForm(initialFormData, handleSubmit);
  const { status, data: submitData } = updateGiftCardBalanceOpts;
  const isSubmitting = status === "loading";

  isSubmittingRef.current = isSubmitting;

  const { formErrors } = useDialogFormReset({
    apiErrors: submitData?.giftCardUpdate?.errors ?? [],
    keys: ["initialBalanceAmount"],
    open,
    reset,
  });

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
          <DashboardModal.ContextHeader description={<FormattedMessage {...messages.subtitle} />}>
            <FormattedMessage {...messages.title} />
          </DashboardModal.ContextHeader>

          <DashboardModal.Body fill>
            <DashboardModal.Inset>
              <Input
                disabled={isSubmitting}
                endAdornment={
                  <Text fontWeight="light" size={2}>
                    {currency}
                  </Text>
                }
                error={!!formErrors?.initialBalanceAmount}
                helperText={getGiftCardErrorMessage(formErrors?.initialBalanceAmount, intl)}
                label={intl.formatMessage(tableMessages.giftCardsTableColumnBalanceTitle)}
                min={0}
                name="balanceAmount"
                onChange={change}
                value={data.balanceAmount}
                width="100%"
              />
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton disabled={isSubmitting} onClick={handleClose} />
            <ConfirmButton
              data-test-id="submit"
              disabled={isSubmitting}
              onClick={submit}
              transitionState={status}
            >
              <FormattedMessage {...messages.changeButtonLabel} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};

GiftCardUpdateBalanceDialog.displayName = "GiftCardUpdateBalanceDialog";
