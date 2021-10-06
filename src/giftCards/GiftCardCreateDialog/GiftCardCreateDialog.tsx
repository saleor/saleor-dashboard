import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { DialogProps } from "@saleor/types";
import { GiftCardCreateInput } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "./ContentWithProgress";
import GiftCardCreateDialogCodeContent from "./GiftCardCreateDialogCodeContent";
import GiftCardCreateDialogForm, {
  GiftCardCreateFormData
} from "./GiftCardCreateDialogForm";
import { giftCardCreateMessages as messages } from "./messages";
import { useGiftCardCreateMutation } from "./mutations";
import { useChannelCurrencies } from "./queries";
import { GiftCardCreate } from "./types/GiftCardCreate";
import { getGiftCardExpiryInputData } from "./utils";

interface GiftCardCreateDialogProps extends DialogProps {
  refetchQueries: string[];
}

const GiftCardCreateDialog: React.FC<GiftCardCreateDialogProps> = ({
  onClose,
  open,
  refetchQueries
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
    refetchQueries
  });

  const handleSubmit = (data: GiftCardCreateFormData) => {
    createGiftCard({
      variables: {
        input: getParsedSubmitInputData(data)
      }
    });
  };

  const handleClose = () => {
    onClose();
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
