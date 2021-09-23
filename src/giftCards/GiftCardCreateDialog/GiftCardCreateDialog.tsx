import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { GiftCardCreateInput } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { GIFT_CARD_LIST_QUERY } from "../GiftCardsList/types";
import ContentWithProgress from "./ContentWithProgress";
import GiftCardCreateDialogCodeContent from "./GiftCardCreateDialogCodeContent";
import GiftCardCreateDialogForm, {
  GiftCardCreateFormData
} from "./GiftCardCreateDialogForm";
import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateMutation } from "./mutations";
import { useChannelCurrencies } from "./queries";
import { GiftCardCreate } from "./types/GiftCardCreate";
import { getGiftCardExpiryInputData } from "./utils";

const GiftCardCreateDialog: React.FC<DialogActionHandlersProps> = ({
  closeDialog,
  open
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const { loading: loadingChannelCurrencies } = useChannelCurrencies({});

  const [cardCode, setCardCode] = useState(null);

  const onCompleted = (data: GiftCardCreate) => {
    const errors = data?.giftCardCreate?.errors;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(commonErrorMessages.unknownError)
        }
      : {
          status: "success",
          text: intl.formatMessage(messages.createdSuccessAlertTitle)
        };

    notify(notifierData);

    if (!errors?.length) {
      setCardCode(data?.giftCardCreate?.giftCard?.code);
    }
  };

  const currentDate = useCurrentDate();

  const getParsedSubmitInputData = (
    formData: GiftCardCreateFormData
  ): GiftCardCreateInput => {
    const {
      balanceAmount,
      balanceCurrency,
      note,
      tag,
      sendToCustomerSelected,
      selectedCustomer,
      requiresActivation,
      channelSlug
    } = formData;

    return {
      note: note || null,
      tag: tag || null,
      userEmail: (sendToCustomerSelected && selectedCustomer.email) || null,
      channel: (sendToCustomerSelected && channelSlug) || null,
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency
      },
      expiryDate: getGiftCardExpiryInputData(formData, currentDate),
      isActive: !requiresActivation
    };
  };

  const [createGiftCard, createGiftCardOpts] = useGiftCardCreateMutation({
    onCompleted,
    refetchQueries: [GIFT_CARD_LIST_QUERY]
  });

  const handleSubmit = (data: GiftCardCreateFormData) => {
    createGiftCard({
      variables: {
        input: getParsedSubmitInputData(data)
      }
    });
  };

  const handleClose = () => {
    closeDialog();
    // dialog closing animation runs slower than prop change
    // and we don't want to show the form for a split second
    setTimeout(() => setCardCode(null), 0);
  };

  return (
    <Dialog open={open} maxWidth="sm">
      <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
      <ContentWithProgress>
        {!loadingChannelCurrencies &&
          (cardCode ? (
            <GiftCardCreateDialogCodeContent
              cardCode={cardCode}
              onClose={handleClose}
            />
          ) : (
            <GiftCardCreateDialogForm
              opts={createGiftCardOpts}
              onClose={handleClose}
              apiErrors={createGiftCardOpts?.data?.giftCardCreate?.errors}
              onSubmit={handleSubmit}
            />
          ))}
      </ContentWithProgress>
    </Dialog>
  );
};

export default GiftCardCreateDialog;
