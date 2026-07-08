import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type INotification } from "@dashboard/components/notifications";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type GiftCardBulkCreateInput, useGiftCardBulkCreateMutation } from "@dashboard/graphql";
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { type DialogProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardBulkCreateSuccessDialog } from "../GiftCardCreateDialog/GiftCardBulkCreateSuccessDialog";
import { giftCardCreateMessages as createMessages } from "../GiftCardCreateDialog/messages";
import {
  getGiftCardCreateOnCompletedMessage,
  getGiftCardExpiryInputData,
} from "../GiftCardCreateDialog/utils";
import { GIFT_CARD_LIST_QUERY } from "../GiftCardsList/queries";
import {
  GiftCardBulkCreateDialogFields,
  useGiftCardBulkCreateDialogForm,
} from "./GiftCardBulkCreateDialogForm";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";
import {
  giftCardBulkCreateErrorKeys,
  type GiftCardBulkCreateFormData,
  type GiftCardBulkCreateFormErrors,
} from "./types";
import { validateForm } from "./utils";

export const GiftCardBulkCreateDialog = ({ onClose, open }: DialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [formErrors, setFormErrors] = useState<GiftCardBulkCreateFormErrors | null>(null);
  const [issuedIds, setIssuedIds] = useState<string[] | null>(null);
  const [openIssueSuccessDialog, setOpenIssueSuccessDialog] = useState(false);
  const isSubmittingRef = useRef(false);

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
      const giftCardsBulkIssueSuccessMessage: INotification = {
        status: "success",
        title: intl.formatMessage(messages.createdSuccessAlertTitle),
        text: intl.formatMessage(messages.createdSuccessAlertDescription, {
          cardsAmount,
        }),
      };

      notify(getGiftCardCreateOnCompletedMessage(errors, intl, giftCardsBulkIssueSuccessMessage));
      setFormErrors(getFormErrors(giftCardBulkCreateErrorKeys, errors));

      if (!errors?.length) {
        setIssuedIds(data?.giftCardBulkCreate?.giftCards?.map(giftCard => giftCard.id) ?? []);
        setOpenIssueSuccessDialog(true);
        onClose();
      }
    },
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });

  const handleSubmit = (data: GiftCardBulkCreateFormData) => {
    const validationErrors = validateForm(data);

    if (Object.keys(validationErrors).length) {
      setFormErrors(validationErrors);
    } else {
      bulkCreateGiftCard({
        variables: {
          input: getParsedSubmitInputData(data),
        },
      });
    }
  };

  const { change, data, loadingSettings, set, submit, toggleValue } =
    useGiftCardBulkCreateDialogForm({
      onSubmit: handleSubmit,
      open,
    });

  const apiErrors = bulkCreateGiftCardOpts?.data?.giftCardBulkCreate?.errors;
  const confirmButtonState: ConfirmButtonTransitionState = bulkCreateGiftCardOpts.status;
  const isSubmitting = confirmButtonState === "loading";
  const isLoading = loadingSettings;

  isSubmittingRef.current = isSubmitting;

  const handleModalClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  useEffect(() => {
    if (apiErrors?.length) {
      const formErrorsFromApi = getFormErrors(giftCardBulkCreateErrorKeys, apiErrors);

      setFormErrors(formErrorsFromApi);
    }
  }, [apiErrors]);

  const isActionsDisabled = isSubmitting || isLoading;

  return (
    <>
      <DashboardModal onChange={handleModalClose} open={open}>
        {open ? (
          <DashboardModal.Content size="sm">
            <DashboardModal.ContextHeader
              description={<FormattedMessage {...messages.description} />}
            >
              <FormattedMessage {...messages.title} />
            </DashboardModal.ContextHeader>

            <DashboardModal.Body fill>
              <DashboardModal.Inset>
                {isLoading ? (
                  <Box display="flex" alignItems="center" justifyContent="center" padding={6}>
                    <SaleorThrobber />
                  </Box>
                ) : (
                  <GiftCardBulkCreateDialogFields
                    change={change}
                    data={data}
                    formErrors={formErrors}
                    set={set}
                    toggleValue={toggleValue}
                  />
                )}
              </DashboardModal.Inset>
            </DashboardModal.Body>

            <DashboardModal.Actions>
              <BackButton disabled={isActionsDisabled} onClick={handleModalClose}>
                <FormattedMessage {...buttonMessages.cancel} />
              </BackButton>
              <ConfirmButton
                data-test-id="submit"
                disabled={isActionsDisabled}
                onClick={submit}
                transitionState={confirmButtonState}
                type="submit"
                variant="primary"
              >
                {intl.formatMessage(createMessages.issueButtonLabel)}
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        ) : null}
      </DashboardModal>
      <GiftCardBulkCreateSuccessDialog
        idsToExport={issuedIds}
        onClose={() => setOpenIssueSuccessDialog(false)}
        open={openIssueSuccessDialog}
      />
    </>
  );
};

GiftCardBulkCreateDialog.displayName = "GiftCardBulkCreateDialog";
