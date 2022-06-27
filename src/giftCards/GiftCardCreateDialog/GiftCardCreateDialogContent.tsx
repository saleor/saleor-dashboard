import { DialogTitle } from "@material-ui/core";
import {
  GiftCardCreateInput,
  useChannelCurrenciesQuery,
  useGiftCardCreateMutation,
} from "@saleor/graphql";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { DialogProps } from "@saleor/types";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "./ContentWithProgress";
import GiftCardCreateDialogCodeContent from "./GiftCardCreateDialogCodeContent";
import GiftCardCreateDialogForm, {
  GiftCardCreateFormData,
} from "./GiftCardCreateDialogForm";
import { giftCardCreateMessages as messages } from "./messages";
import { GiftCardCreateFormCustomer } from "./types";
import {
  getGiftCardCreateOnCompletedMessage,
  getGiftCardExpiryInputData,
} from "./utils";

interface GiftCardCreateDialogContentProps
  extends Pick<DialogProps, "onClose"> {
  refetchQueries: string[];
  initialCustomer?: GiftCardCreateFormCustomer | null;
}

const GiftCardCreateDialogContent: React.FC<GiftCardCreateDialogContentProps> = ({
  onClose,
  refetchQueries,
  initialCustomer,
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const { loading: loadingChannelCurrencies } = useChannelCurrenciesQuery({});

  const [cardCode, setCardCode] = useState(null);

  const currentDate = useCurrentDate();

  const getParsedSubmitInputData = (
    formData: GiftCardCreateFormData,
  ): GiftCardCreateInput => {
    const {
      balanceAmount,
      balanceCurrency,
      note,
      tags,
      sendToCustomerSelected,
      selectedCustomer,
      requiresActivation,
      channelSlug,
    } = formData;

    return {
      note: note || null,
      addTags: tags || null,
      userEmail: (sendToCustomerSelected && selectedCustomer.email) || null,
      channel: (sendToCustomerSelected && channelSlug) || null,
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency,
      },
      expiryDate: getGiftCardExpiryInputData(formData, currentDate),
      isActive: !requiresActivation,
    };
  };

  const [createGiftCard, createGiftCardOpts] = useGiftCardCreateMutation({
    onCompleted: data => {
      const errors = data?.giftCardCreate?.errors;

      notify(getGiftCardCreateOnCompletedMessage(errors, intl));

      if (!errors?.length) {
        setCardCode(data?.giftCardCreate?.giftCard?.code);
      }
    },
    refetchQueries,
  });

  const handleSubmit = (data: GiftCardCreateFormData) => {
    createGiftCard({
      variables: {
        input: getParsedSubmitInputData(data),
      },
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

export default GiftCardCreateDialogContent;
