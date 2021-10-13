import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { DialogProps } from "@saleor/types";
import { GiftCardBulkCreateInput } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import commonErrorMessages from "@saleor/utils/errors/common";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import { useChannelCurrencies } from "../GiftCardCreateDialog/queries";
import { getGiftCardExpiryInputData } from "../GiftCardCreateDialog/utils";
import { GIFT_CARD_LIST_QUERY } from "../GiftCardsList/types";
import GiftCardBulkCreateDialogForm from "./GiftCardBulkCreateDialogForm";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";
import { useGiftCardBulkCreateMutation } from "./mutations";
import {
  giftCardBulkCreateErrorKeys,
  GiftCardBulkCreateFormData,
  GiftCardBulkCreateFormErrors
} from "./types";
import { GiftCardBulkCreate } from "./types/GiftCardBulkCreate";
import { getFormSchemaErrors } from "./utils";

const GiftCardBulkCreateDialog: React.FC<DialogProps> = ({ onClose, open }) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [formErrors, setFormErrors] = useState<GiftCardBulkCreateFormErrors>(
    null
  );

  const { loading: loadingChannelCurrencies } = useChannelCurrencies({});

  const onCompleted = (data: GiftCardBulkCreate) => {
    const errors = data?.giftCardBulkCreate?.errors;
    const cardsAmount = data?.giftCardBulkCreate?.giftCards?.length;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(commonErrorMessages.unknownError)
        }
      : {
          status: "success",
          title: intl.formatMessage(messages.createdSuccessAlertTitle),
          text: intl.formatMessage(messages.createdSuccessAlertDescription, {
            cardsAmount
          })
        };

    notify(notifierData);

    setFormErrors(getFormErrors(giftCardBulkCreateErrorKeys, errors));

    if (!errors.length) {
      onClose();
    }
  };

  const currentDate = useCurrentDate();

  const getParsedSubmitInputData = (
    formData: GiftCardBulkCreateFormData
  ): GiftCardBulkCreateInput => {
    const {
      balanceAmount,
      balanceCurrency,
      tag,
      requiresActivation,
      cardsAmount
    } = formData;

    return {
      count: cardsAmount,
      tag: tag || null,
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency
      },
      expiryDate: getGiftCardExpiryInputData(formData, currentDate),
      isActive: !requiresActivation
    };
  };

  const [
    bulkCreateGiftCard,
    bulkCreateGiftCardOpts
  ] = useGiftCardBulkCreateMutation({
    onCompleted,
    refetchQueries: [GIFT_CARD_LIST_QUERY]
  });

  const handleSubmit = (data: GiftCardBulkCreateFormData) => {
    const formErrors = getFormSchemaErrors(data);

    if (!!Object.keys(formErrors).length) {
      setFormErrors(formErrors);
      return;
    }

    bulkCreateGiftCard({
      variables: {
        input: getParsedSubmitInputData(data)
      }
    });
  };

  const apiErrors = bulkCreateGiftCardOpts?.data?.giftCardBulkCreate?.errors;

  const handleSetSchemaErrors = () => {
    if (apiErrors?.length) {
      const formErrorsFromApi = getFormErrors(
        giftCardBulkCreateErrorKeys,
        apiErrors
      );

      setFormErrors(formErrorsFromApi);
    }
  };

  useEffect(handleSetSchemaErrors, [apiErrors]);

  return (
    <Dialog open={open} maxWidth="sm">
      <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
      <ContentWithProgress>
        {!loadingChannelCurrencies && (
          <GiftCardBulkCreateDialogForm
            opts={bulkCreateGiftCardOpts}
            onClose={onClose}
            formErrors={formErrors}
            onSubmit={handleSubmit}
          />
        )}
      </ContentWithProgress>
    </Dialog>
  );
};

export default GiftCardBulkCreateDialog;
