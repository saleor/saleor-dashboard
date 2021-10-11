import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import {
  GiftCardBulkCreateInput,
  GiftCardErrorCode
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import commonErrorMessages from "@saleor/utils/errors/common";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import reduce from "lodash/reduce";
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
  GiftCardBulkCreateFormData,
  GiftCardBulkCreateFormErrors
} from "./types";
import { GiftCardBulkCreate } from "./types/GiftCardBulkCreate";

const giftCardBulkCreateErrorKeys = [
  "tag",
  "expiryDate",
  "currency",
  "amount",
  "balance",
  "count"
];

const GiftCardBulkCreateDialog: React.FC<DialogActionHandlersProps> = ({
  closeDialog,
  open
}) => {
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
  };

  const getFormError = (
    {
      expiryDate,
      expiryPeriodAmount,
      expiryType,
      expirySelected,
      expiryPeriodType
    }: GiftCardBulkCreateFormData,
    value,
    key: keyof GiftCardBulkCreateFormData
  ): Pick<GiftCardError, "field" | "code"> | null => {
    const error = { code: GiftCardErrorCode.INVALID, field: key };

    switch (key) {
      case "cardsAmount":
      case "tag":
      case "balanceCurrency":
      case "balanceAmount":
        return !value ? error : null;

      case "expiryDate":
        if (expirySelected && expiryType === "EXPIRY_DATE") {
          return !expiryDate ? error : null;
        }
        return null;

      case "expiryPeriodAmount":
        if (expirySelected && expiryType === "EXPIRY_PERIOD") {
          return !expiryPeriodType || !expiryPeriodAmount
            ? { ...error, field: "expiryDate" }
            : null;
        }
        return null;
    }
  };

  const getFormSchemaErrors = (
    formData: GiftCardBulkCreateFormData
  ): GiftCardBulkCreateFormErrors =>
    reduce(
      formData,
      (resultErrors, value, key: keyof GiftCardBulkCreateFormData) => {
        const correspondingKeys = {
          cardsAmount: "count",
          balanceCurrency: "balance",
          balanceAmount: "balance",
          expiryPeriodAmount: "expiryDate"
        };

        const formError = getFormError(formData, value, key);

        if (!formError) {
          return resultErrors;
        }

        return { ...resultErrors, [correspondingKeys[key] || key]: formError };
      },
      {}
    );

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

  useEffect(() => {
    if (apiErrors?.length) {
      const formErrorsFromApi = getFormErrors(
        giftCardBulkCreateErrorKeys,
        apiErrors
      );

      setFormErrors(formErrorsFromApi);
    }
  }, [apiErrors]);

  return (
    <Dialog open={open} maxWidth="sm">
      <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
      <ContentWithProgress>
        {!loadingChannelCurrencies && (
          <GiftCardBulkCreateDialogForm
            opts={bulkCreateGiftCardOpts}
            onClose={closeDialog}
            formErrors={formErrors}
            onSubmit={handleSubmit}
          />
        )}
      </ContentWithProgress>
    </Dialog>
  );
};

export default GiftCardBulkCreateDialog;
