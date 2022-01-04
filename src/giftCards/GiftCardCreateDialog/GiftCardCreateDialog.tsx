import { DialogTitle } from "@material-ui/core";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { DialogProps } from "@saleor/types";
import { GiftCardCreateInput } from "@saleor/types/globalTypes";
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
import { GiftCardCreateFormCustomer } from "./types";
import { GiftCardCreate } from "./types/GiftCardCreate";
import {
  getGiftCardCreateOnCompletedMessage,
  getGiftCardExpiryInputData
} from "./utils";

interface GiftCardCreateDialogProps extends Pick<DialogProps, "onClose"> {
  refetchQueries: string[];
  initialCustomer?: GiftCardCreateFormCustomer | null;
}

const GiftCardCreateDialog: React.FC<GiftCardCreateDialogProps> = ({
  onClose,
  refetchQueries,
  initialCustomer
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const { loading: loadingChannelCurrencies } = useChannelCurrencies({});

  const [cardCode, setCardCode] = useState(null);

  const onCompleted = (data: GiftCardCreate) => {
    const errors = data?.giftCardCreate?.errors;

    notify(getGiftCardCreateOnCompletedMessage(errors, intl));

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
      tags,
      sendToCustomerSelected,
      selectedCustomer,
      requiresActivation,
      channelSlug
    } = formData;

    return {
      note: note || null,
      addTags: tags || null,
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
  };

  return (
    <>
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
              initialCustomer={initialCustomer}
            />
          ))}
      </ContentWithProgress>
    </>
  );
};

export default GiftCardCreateDialog;
