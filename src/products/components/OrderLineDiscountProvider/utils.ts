import { IMessage } from "@saleor/components/messages";
import { IMoney } from "@saleor/components/Money";
import { commonMessages } from "@saleor/intl";
import commonErrorMessages from "@saleor/utils/errors/common";
import { useState } from "react";
import { IntlShape } from "react-intl";

export const useDiscountDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);

  return { isDialogOpen, openDialog, closeDialog };
};

export const getDiscountNotifierData = (
  errors: any[],
  intl: IntlShape
): IMessage =>
  !errors.length
    ? {
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      }
    : {
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError)
      };

export const getParsedMoneyData = ({ amount, currency }: IMoney) => ({
  discountCurrency: currency,
  discountMaxAmount: amount
});
