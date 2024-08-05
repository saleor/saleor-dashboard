// @ts-strict-ignore
import { IMessage } from "@dashboard/components/messages";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import {
  GiftCardBulkCreateInput,
  useChannelCurrenciesQuery,
  useGiftCardBulkCreateMutation,
} from "@dashboard/graphql";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useNotifier from "@dashboard/hooks/useNotifier";
import { DialogProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import GiftCardBulkCreateSuccessDialog from "../GiftCardCreateDialog/GiftCardBulkCreateSuccessDialog";
import {
  getGiftCardCreateOnCompletedMessage,
  getGiftCardExpiryInputData,
} from "../GiftCardCreateDialog/utils";
import { GIFT_CARD_LIST_QUERY } from "../GiftCardsList/queries";
import GiftCardBulkCreateDialogForm from "./GiftCardBulkCreateDialogForm";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";
import {
  giftCardBulkCreateErrorKeys,
  GiftCardBulkCreateFormData,
  GiftCardBulkCreateFormErrors,
} from "./types";
import { validateForm } from "./utils";

const GiftCardBulkCreateDialog: React.FC<DialogProps> = ({ onClose, open }) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [formErrors, setFormErrors] = useState<GiftCardBulkCreateFormErrors>(null);
  const [issuedIds, setIssuedIds] = useState<string[] | null>(null);
  const [openIssueSuccessDialog, setOpenIssueSuccessDialog] = useState<boolean>(false);
  const onIssueSuccessDialogClose = () => setOpenIssueSuccessDialog(false);
  const { loading: loadingChannelCurrencies } = useChannelCurrenciesQuery({});
  const currentDate = useCurrentDate();

  const getParsedSubmitInputData = (
    formData: GiftCardBulkCreateFormData,
  ): GiftCardBulkCreateInput => {
    const { balanceAmount, balanceCurrency, tags = [], requiresActivation, cardsAmount } = formData;

    return {
      count: cardsAmount,
      tags: tags.map(tag => tag.value),
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency,
      },
      expiryDate: getGiftCardExpiryInputData(formData, currentDate),
      isActive: !requiresActivation,
    };
  };

  const [bulkCreateGiftCard, bulkCreateGiftCardOpts] = useGiftCardBulkCreateMutation({
    onCompleted: data => {
      const errors = data?.giftCardBulkCreate?.errors;
      const cardsAmount = data?.giftCardBulkCreate?.giftCards?.length || 0;
      const giftCardsBulkIssueSuccessMessage: IMessage = {
        status: "success",
        title: intl.formatMessage(messages.createdSuccessAlertTitle),
        text: intl.formatMessage(messages.createdSuccessAlertDescription, {
          cardsAmount,
        }),
      };

      notify(getGiftCardCreateOnCompletedMessage(errors, intl, giftCardsBulkIssueSuccessMessage));
      setFormErrors(getFormErrors(giftCardBulkCreateErrorKeys, errors));

      if (!errors.length) {
        setIssuedIds(data?.giftCardBulkCreate?.giftCards?.map(giftCard => giftCard.id));
        setOpenIssueSuccessDialog(true);
        onClose();
      }
    },
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });

  const handleSubmit = (data: GiftCardBulkCreateFormData) => {
    const formErrors = validateForm(data);

    if (Object.keys(formErrors).length) {
      setFormErrors(formErrors);
    } else {
      bulkCreateGiftCard({
        variables: {
          input: getParsedSubmitInputData(data),
        },
      });
    }
  };

  const apiErrors = bulkCreateGiftCardOpts?.data?.giftCardBulkCreate?.errors;
  const handleSetSchemaErrors = () => {
    if (apiErrors?.length) {
      const formErrorsFromApi = getFormErrors(giftCardBulkCreateErrorKeys, apiErrors);

      setFormErrors(formErrorsFromApi);
    }
  };

  useEffect(handleSetSchemaErrors, [apiErrors]);

  return (
    <>
      <DashboardModal open={open} onChange={onClose}>
        <DashboardModal.Content __maxWidth={DASHBOARD_MODAL_WIDTH} __width="calc(100% - 64px)">
          <DashboardModal.Title>{intl.formatMessage(messages.title)}</DashboardModal.Title>
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
        </DashboardModal.Content>
      </DashboardModal>
      <GiftCardBulkCreateSuccessDialog
        onClose={onIssueSuccessDialogClose}
        open={openIssueSuccessDialog}
        idsToExport={issuedIds}
      />
    </>
  );
};

export default GiftCardBulkCreateDialog;
