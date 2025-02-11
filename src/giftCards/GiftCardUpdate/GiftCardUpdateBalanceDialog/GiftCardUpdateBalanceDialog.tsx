// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import CardSpacer from "@dashboard/components/CardSpacer";
import { IMessage } from "@dashboard/components/messages";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { useGiftCardUpdateMutation } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useNotifier from "@dashboard/hooks/useNotifier";
import { DialogProps } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { Input, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import { useDialogFormReset } from "../GiftCardResendCodeDialog/utils";
import { getGiftCardErrorMessage } from "../messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardUpdateBalanceDialogMessages as messages } from "./messages";

export interface GiftCardBalanceUpdateFormData {
  balanceAmount: number;
}

const GiftCardUpdateBalanceDialog = ({ open, onClose }: DialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { canSeeCreatedBy } = useGiftCardPermissions();
  const {
    giftCard: {
      id,
      currentBalance: { amount, currency },
    },
  } = useGiftCardDetails();
  const initialFormData: GiftCardBalanceUpdateFormData = {
    balanceAmount: amount,
  };
  const [updateGiftCardBalance, updateGiftCardBalanceOpts] = useGiftCardUpdateMutation({
    onCompleted: data => {
      const errors = data?.giftCardUpdate?.errors;
      const notifierData: IMessage = errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.updatedSuccessAlertTitle),
          };

      notify(notifierData);

      if (!errors.length) {
        onClose();
      }
    },
  });
  const handleSubmit = async ({ balanceAmount }: GiftCardBalanceUpdateFormData) => {
    const result = await updateGiftCardBalance({
      variables: {
        id,
        input: {
          balanceAmount,
        },
        showCreatedBy: canSeeCreatedBy,
      },
    });

    return result?.data?.giftCardUpdate?.errors;
  };
  const { data, change, submit, reset } = useForm(initialFormData, handleSubmit);
  const { loading, status, data: submitData } = updateGiftCardBalanceOpts;
  const { formErrors } = useDialogFormReset({
    open,
    reset,
    keys: ["initialBalanceAmount"],
    apiErrors: submitData?.giftCardUpdate?.errors,
  });

  return (
    <ActionDialog
      open={open}
      onConfirm={submit}
      confirmButtonLabel={intl.formatMessage(messages.changeButtonLabel)}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
      confirmButtonState={status}
      disabled={loading}
    >
      <Text>{intl.formatMessage(messages.subtitle)}</Text>
      <CardSpacer />
      <Input
        error={!!formErrors?.initialBalanceAmount}
        helperText={getGiftCardErrorMessage(formErrors?.initialBalanceAmount, intl)}
        name="balanceAmount"
        value={data.balanceAmount}
        onChange={change}
        label={intl.formatMessage(tableMessages.giftCardsTableColumnBalanceTitle)}
        min={0}
        endAdornment={
          <Text size={2} fontWeight="light">
            {currency}
          </Text>
        }
        width="100%"
      />
    </ActionDialog>
  );
};

export default GiftCardUpdateBalanceDialog;
