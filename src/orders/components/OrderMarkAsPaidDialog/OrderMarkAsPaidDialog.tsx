import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { transactionActionMessages } from "../OrderTransaction/messages";
import { orderMarkAsPaidDialogMessages as messages } from "./messages";

interface OrderMarkAsPaidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  transactionReference: string;
  onClose: () => void;
  onConfirm: () => void;
  handleTransactionReference: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formFields = ["transactionReference"] as const;

const isTransactionReferenceField = (field: string | null): field is (typeof formFields)[number] =>
  field !== null && formFields.includes(field as (typeof formFields)[number]);

export const OrderMarkAsPaidDialog = ({
  confirmButtonState,
  errors: apiErrors,
  handleTransactionReference,
  onClose,
  onConfirm,
  open,
  transactionReference,
}: OrderMarkAsPaidDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const formErrors = getFormErrors([...formFields], errors);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <>
              <FormattedMessage {...messages.intro} />{" "}
              <FormattedMessage {...messages.transactionReferenceHint} />
            </>
          }
        >
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column" gap={4}>
              <TextField
                error={!!formErrors.transactionReference}
                helperText={getOrderErrorMessage(formErrors.transactionReference, intl)}
                fullWidth
                name="transactionReference"
                label={intl.formatMessage(messages.transactionReference)}
                value={transactionReference}
                onChange={handleTransactionReference}
                data-test-id="transaction-reference-input"
              />

              {errors
                .filter(err => !isTransactionReferenceField(err.field))
                .map((err, index) => (
                  <Text display="block" color="critical1" key={index} data-test-id="dialog-error">
                    {getOrderErrorMessage(err, intl)}
                  </Text>
                ))}
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            onClick={onConfirm}
            transitionState={confirmButtonState}
          >
            <FormattedMessage {...transactionActionMessages.markAsPaid} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderMarkAsPaidDialog.displayName = "OrderMarkAsPaidDialog";
