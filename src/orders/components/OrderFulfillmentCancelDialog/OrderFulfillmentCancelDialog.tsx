// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { FulfillmentStatus, OrderErrorFragment, WarehouseFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { makeStyles } from "@saleor/macaw-ui";
import { DynamicCombobox, Option, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderFulfillmentCancelDialogFormData {
  warehouseId: string;
}

const useStyles = makeStyles(
  theme => ({
    enableOverflow: {
      overflow: "visible",
    },
    paragraph: {
      marginBottom: theme.spacing(2),
    },
    selectCcontainer: {
      width: "60%",
    },
  }),
  { name: "OrderFulfillmentCancelDialog" },
);

interface OrderFulfillmentCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  warehouses: WarehouseFragment[];
  fulfillmentStatus: string;
  onClose: () => any;
  onConfirm: (data: OrderFulfillmentCancelDialogFormData) => any;
}

const OrderFulfillmentCancelDialog = (props: OrderFulfillmentCancelDialogProps) => {
  const { confirmButtonState, errors, open, warehouses, fulfillmentStatus, onConfirm, onClose } =
    props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Option | null>(null);
  const choices = warehouses?.map(warehouse => ({
    label: warehouse.name,
    value: warehouse.id,
  }));
  const waitingForApproval = fulfillmentStatus === FulfillmentStatus.WAITING_FOR_APPROVAL;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form initial={{ warehouseId: null }} onSubmit={onConfirm}>
        {({ change, data: formData, submit }) => {
          const handleWarehouseChange = (option: Option | null) => {
            setSelectedWarehouse(option);
            change({
              target: {
                name: "warehouseId",
                value: option?.value ?? null,
              },
            });
          };

          return (
            <DashboardModal.Content size="sm">
              <DashboardModal.Header>
                <FormattedMessage
                  id="bb4nSp"
                  defaultMessage="Cancel Fulfillment"
                  description="dialog header"
                />
              </DashboardModal.Header>

              <Text>
                <FormattedMessage
                  id="+cGU63"
                  defaultMessage="Are you sure you want to cancel fulfillment?"
                />
                {!waitingForApproval && (
                  <FormattedMessage
                    id="QV5QKO"
                    defaultMessage=" Canceling a fulfillment will restock products at a selected warehouse."
                  />
                )}
              </Text>

              {!waitingForApproval && (
                <div
                  className={classes.selectCcontainer}
                  data-test-id="cancel-fulfillment-select-field"
                >
                  <DynamicCombobox
                    label={intl.formatMessage({
                      id: "aHc89n",
                      defaultMessage: "Select Warehouse",
                      description: "select warehouse to restock items",
                    })}
                    options={choices}
                    name="warehouseId"
                    size="small"
                    value={selectedWarehouse}
                    onChange={handleWarehouseChange}
                  />
                </div>
              )}

              {errors.length > 0 &&
                errors.map((err, index) => (
                  <Text color="critical1" key={index}>
                    {getOrderErrorMessage(err, intl)}
                  </Text>
                ))}

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  data-test-id="submit"
                  disabled={!waitingForApproval && formData.warehouseId === null}
                  transitionState={confirmButtonState}
                  onClick={submit}
                >
                  <FormattedMessage {...buttonMessages.accept} />
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
