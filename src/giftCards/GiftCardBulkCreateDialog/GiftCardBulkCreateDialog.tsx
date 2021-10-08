import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { GiftCardBulkCreateInput } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import { useChannelCurrencies } from "../GiftCardCreateDialog/queries";
import GiftCardBulkCreateDialogForm, {
  GiftCardBulkCreateFormData
} from "./GiftCardBulkCreateDialogForm";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";

const GiftCardBulkCreateDialog: React.FC<DialogActionHandlersProps> = ({
  closeDialog,
  open
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const { loading: loadingChannelCurrencies } = useChannelCurrencies({});

  //   const onCompleted = (data: GiftCardBulkCreate) => {
  //     const errors = data?.giftCardCreate?.errors;

  //     const notifierData: IMessage = !!errors?.length
  //       ? {
  //           status: "error",
  //           text: intl.formatMessage(commonErrorMessages.unknownError)
  //         }
  //       : {
  //           status: "success",
  //           text: intl.formatMessage(messages.createdSuccessAlertTitle)
  //         };

  //     notify(notifierData);

  //     if (!errors?.length) {
  //       //   setCardCode(data?.giftCardCreate?.giftCard?.code);
  //     }
  //   };

  const currentDate = useCurrentDate();

  const getParsedSubmitInputData = (
    formData: GiftCardBulkCreateFormData
  ): GiftCardBulkCreateInput => {
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
      //   expiryDate: getGiftCardExpiryInputData(formData, currentDate),
      isActive: !requiresActivation
    };
  };

  //   const [createGiftCard, createGiftCardOpts] = useGiftCardBulkCreateMutation({
  //     onCompleted,
  //     refetchQueries: [GIFT_CARD_LIST_QUERY]
  //   });

  //   const handleSubmit = (data: GiftCardBulkCreateFormData) => {
  //     createGiftCard({
  //       variables: {
  //         input: getParsedSubmitInputData(data)
  //       }
  //     });
  //   };

  const handleClose = () => {
    closeDialog();
    // dialog closing animation runs slower than prop change
    // and we don't want to show the form for a split second
    // setTimeout(() => setCardCode(null), 0);
  };

  return (
    <Dialog open={true /* REMOVE */} maxWidth="sm">
      <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
      <ContentWithProgress>
        {!loadingChannelCurrencies && (
          <GiftCardBulkCreateDialogForm
            //   opts={createGiftCardOpts}
            onClose={handleClose}
            //   apiErrors={createGiftCardOpts?.data?.giftCardCreate?.errors}
            //   onSubmit={handleSubmit}
          />
        )}
      </ContentWithProgress>
    </Dialog>
  );
};

export default GiftCardBulkCreateDialog;
//     /*
//    (cardCode ? (
//     <GiftCardBulkCreateDialogSuccessContent
//       cardCode={cardCode}
//       onClose={handleClose}
//     />
//   ) : ( */
//   }(
