// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  FulfillmentStatus,
  type OrderErrorFragment,
  type WarehouseFragment,
} from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, DynamicCombobox, type Option, Text } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderFulfillmentCancelDialogMessages as messages } from "./messages";

interface OrderFulfillmentCancelDialogFormData {
  warehouseId: string | null;
}

interface OrderFulfillmentCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  warehouses: WarehouseFragment[];
  fulfillmentStatus: string;
  defaultWarehouseId?: string | null;
  onClose: () => any;
  onConfirm: (data: OrderFulfillmentCancelDialogFormData) => any;
}

const OrderFulfillmentCancelDialog = (props: OrderFulfillmentCancelDialogProps) => {
  const {
    confirmButtonState,
    errors: apiErrors,
    open,
    warehouses,
    fulfillmentStatus,
    defaultWarehouseId = null,
    onConfirm,
    onClose,
  } = props;
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const [formKey, setFormKey] = useState(0);
  const waitingForApproval = fulfillmentStatus === FulfillmentStatus.WAITING_FOR_APPROVAL;

  const warehouseOptions: Option[] = useMemo(
    () =>
      warehouses?.map(warehouse => ({
        label: warehouse.name,
        value: warehouse.id,
      })) ?? [],
    [warehouses],
  );

  useModalDialogOpen(open, {
    onOpen: () => setFormKey(current => current + 1),
  });

  const subtitle = waitingForApproval ? (
    <>
      <FormattedMessage {...messages.description} />{" "}
      <FormattedMessage {...messages.waitingForApprovalHint} />
    </>
  ) : (
    <>
      <FormattedMessage {...messages.description} /> <FormattedMessage {...messages.restockHint} />
    </>
  );

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form key={formKey} initial={{ warehouseId: defaultWarehouseId }} onSubmit={onConfirm}>
        {({ change, data: formData, submit }) => {
          const selectedWarehouse =
            warehouseOptions.find(option => option.value === formData.warehouseId) ?? null;

          const handleWarehouseChange = (option: Option | null) => {
            change({
              target: {
                name: "warehouseId",
                value: option?.value ?? null,
              },
            });
          };

          const showBody = !waitingForApproval || errors.length > 0;

          return (
            <DashboardModal.Content size={waitingForApproval ? "xs" : "sm"}>
              <DashboardModal.Header subtitle={subtitle}>
                <FormattedMessage {...messages.title} />
              </DashboardModal.Header>

              {showBody && (
                <DashboardModal.Body>
                  <DashboardModal.Inset>
                    <Box display="flex" flexDirection="column" gap={4}>
                      {!waitingForApproval && (
                        <Box data-test-id="cancel-fulfillment-select-field">
                          <DynamicCombobox
                            label={intl.formatMessage(messages.warehouseLabel)}
                            options={warehouseOptions}
                            name="warehouseId"
                            size="small"
                            value={selectedWarehouse}
                            onChange={handleWarehouseChange}
                          />
                        </Box>
                      )}

                      {errors.map((err, index) => (
                        <Text
                          display="block"
                          color="critical1"
                          key={index}
                          data-test-id="dialog-error"
                        >
                          {getOrderErrorMessage(err, intl)}
                        </Text>
                      ))}
                    </Box>
                  </DashboardModal.Inset>
                </DashboardModal.Body>
              )}

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  data-test-id="submit"
                  disabled={!waitingForApproval && formData.warehouseId === null}
                  transitionState={confirmButtonState}
                  onClick={submit}
                  variant="error"
                >
                  <FormattedMessage {...messages.confirmButton} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          );
        }}
      </Form>
    </DashboardModal>
  );
};

OrderFulfillmentCancelDialog.displayName = "OrderFulfillmentCancelDialog";
export default OrderFulfillmentCancelDialog;
