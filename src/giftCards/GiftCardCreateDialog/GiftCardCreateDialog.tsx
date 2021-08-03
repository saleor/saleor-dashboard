import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import useNotifier from "@saleor/hooks/useNotifier";
import { GiftCardCreateInput } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { GiftCardListActionParamsEnum } from "../GiftCardsList/types";
import { getGiftCardExpirySettingsInputData } from "../GiftCardUpdatePage/utils";
import GiftCardCreateDialogCodeContent from "./GiftCardCreateDialogCodeContent";
import GiftCardCreateDialogForm, {
  GiftCardCreateFormData
} from "./GiftCardCreateDialogForm";
import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateMutation } from "./mutations";
import { GiftCardCreate } from "./types/GiftCardCreate";

interface GiftCardCreateDialogProps {
  onClose: () => void;
  action: string;
}

const GiftCardCreateDialog: React.FC<GiftCardCreateDialogProps> = ({
  onClose,
  action
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const isOpen = action === GiftCardListActionParamsEnum.CREATE;

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

  const getParsedSubmitInputData = (
    formData: GiftCardCreateFormData
  ): GiftCardCreateInput => {
    const {
      balanceAmount,
      balanceCurrency,
      note,
      tag,
      selectedCustomer
    } = formData;

    return {
      note: note || null,
      tag: tag || null,
      userEmail: selectedCustomer.email || null,
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency
      },
      expirySettings: getGiftCardExpirySettingsInputData(formData)
    };
  };

  const [createGiftCard, createGiftCardOpts] = useGiftCardCreateMutation({
    onCompleted
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
    setCardCode(null);
  };

  return (
    <Dialog open={isOpen} maxWidth="sm">
      <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
      {!!cardCode ? (
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
      )}
    </Dialog>
  );
};

export default GiftCardCreateDialog;
