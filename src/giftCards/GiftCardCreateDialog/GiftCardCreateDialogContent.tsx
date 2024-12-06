// @ts-strict-ignore
import { DashboardModal } from "@dashboard/components/Modal";
import { GiftCardCreateInput, useGiftCardCreateMutation } from "@dashboard/graphql";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useNotifier from "@dashboard/hooks/useNotifier";
import { DialogProps } from "@dashboard/types";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import GiftCardCreateDialogCodeContent from "./GiftCardCreateDialogCodeContent";
import GiftCardCreateDialogForm, { GiftCardCreateFormData } from "./GiftCardCreateDialogForm";
import { giftCardCreateMessages as messages } from "./messages";
import { GiftCardCreateFormCustomer } from "./types";
import { getGiftCardCreateOnCompletedMessage, getGiftCardExpiryInputData } from "./utils";

interface GiftCardCreateDialogContentProps extends Pick<DialogProps, "onClose"> {
  refetchQueries: string[];
  initialCustomer?: GiftCardCreateFormCustomer | null;
}

const GiftCardCreateDialogContent = ({
  onClose,
  refetchQueries,
  initialCustomer,
}: GiftCardCreateDialogContentProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [cardCode, setCardCode] = useState(null);
  const currentDate = useCurrentDate();
  const getParsedSubmitInputData = (formData: GiftCardCreateFormData): GiftCardCreateInput => {
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
      addTags: tags?.map(tag => tag.value) || null,
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
    setCardCode(null);
  };

  return (
    <DashboardModal.Content size="sm" data-test-id="gift-card-dialog">
      <DashboardModal.Header>{intl.formatMessage(messages.title)}</DashboardModal.Header>
      {cardCode ? (
        <GiftCardCreateDialogCodeContent cardCode={cardCode} onClose={handleClose} />
      ) : (
        <GiftCardCreateDialogForm
          opts={createGiftCardOpts}
          onClose={handleClose}
          apiErrors={createGiftCardOpts?.data?.giftCardCreate?.errors}
          onSubmit={handleSubmit}
          initialCustomer={initialCustomer}
        />
      )}
    </DashboardModal.Content>
  );
};

export default GiftCardCreateDialogContent;
