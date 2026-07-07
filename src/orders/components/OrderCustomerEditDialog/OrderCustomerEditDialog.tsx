import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  type OrderDetailsFragment,
  type OrderErrorFragment,
  type SearchCustomersQuery,
} from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, type Option, Text } from "@saleor/macaw-ui-next";
import { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerEditForm } from "../OrderCustomer/CustomerEditForm";
import { getCustomerEditDataFromOption } from "../OrderCustomer/getCustomerEditDataFromOption";
import { type CustomerEditData } from "../OrderCustomer/OrderCustomer";
import { orderCustomerEditDialogMessages as messages } from "./messages";

interface OrderCustomerEditDialogProps extends Omit<FetchMoreProps, "loading"> {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  order: OrderDetailsFragment;
  users?: RelayToFlat<SearchCustomersQuery["search"]>;
  loading?: boolean;
  fetchUsers?: (query: string) => void;
  onCustomerEdit: (data: CustomerEditData) => void | Promise<void>;
  onClose: () => void;
}

const isSameCustomerSelection = (
  option: Option,
  currentUser: OrderDetailsFragment["user"] | null,
  currentUserEmail: string | null,
): boolean => {
  const value = String(option.value);

  if (value.includes("@")) {
    return value.toLowerCase() === (currentUser?.email ?? currentUserEmail ?? "").toLowerCase();
  }

  return value === currentUser?.id;
};

export const OrderCustomerEditDialog = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  order,
  users,
  loading = false,
  fetchUsers,
  hasMore,
  onFetchMore,
  onCustomerEdit,
  onClose,
}: OrderCustomerEditDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const [formKey, setFormKey] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Option | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const transitionState = hasSubmitted ? confirmButtonState : "default";
  const isSubmitting = transitionState === "loading";

  const resetDialogState = useCallback(() => {
    setFormKey(current => current + 1);
    setSelectedCustomer(null);
    setHasSubmitted(false);
  }, []);

  useModalDialogOpen(open, {
    onOpen: resetDialogState,
  });

  const handleConfirm = () => {
    if (!selectedCustomer || isSubmitting) {
      return;
    }

    setHasSubmitted(true);
    onCustomerEdit(getCustomerEditDataFromOption(selectedCustomer, order.user, order.userEmail));
  };

  const isSubmitDisabled =
    isSubmitting ||
    selectedCustomer === null ||
    isSameCustomerSelection(selectedCustomer, order.user, order.userEmail);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" data-test-id="change-customer-dialog">
        <DashboardModal.Header subtitle={<FormattedMessage {...messages.description} />}>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column" gap={4}>
              <CustomerEditForm
                key={formKey}
                allUsers={users}
                fetchUsers={fetchUsers}
                hasMore={hasMore}
                loading={loading}
                onFetchMore={onFetchMore}
                value={selectedCustomer}
                onChange={setSelectedCustomer}
              />

              {errors.map((err, index) => (
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
            disabled={isSubmitDisabled}
            transitionState={transitionState}
            onClick={handleConfirm}
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCustomerEditDialog.displayName = "OrderCustomerEditDialog";
