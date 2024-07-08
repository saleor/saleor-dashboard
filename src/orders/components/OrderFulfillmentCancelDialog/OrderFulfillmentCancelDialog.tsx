// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { Combobox } from "@dashboard/components/Combobox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import { OrderErrorFragment, WarehouseFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderFulfillmentCancelDialogFormData {
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

export interface OrderFulfillmentCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  warehouses: WarehouseFragment[];
  onClose: () => any;
  onConfirm: (data: OrderFulfillmentCancelDialogFormData) => any;
}

const OrderFulfillmentCancelDialog: React.FC<OrderFulfillmentCancelDialogProps> = props => {
  const { confirmButtonState, errors, open, warehouses, onConfirm, onClose } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [displayValue, setDisplayValue] = React.useState("");
  const choices = warehouses?.map(warehouse => ({
    label: warehouse.name,
    value: warehouse.id,
  }));

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form initial={{ warehouseId: null }} onSubmit={onConfirm}>
        {({ change, data: formData, submit }) => {
          const handleChange = createSingleAutocompleteSelectHandler(
            change,
            setDisplayValue,
            choices,
          );

          return (
            <DashboardModal.Content __maxWidth={DASHBOARD_MODAL_WIDTH} width="100%">
              <DashboardModal.Title>
                <FormattedMessage
                  id="bb4nSp"
                  defaultMessage="Cancel Fulfillment"
                  description="dialog header"
                />
              </DashboardModal.Title>

              <Text>
                <FormattedMessage
                  id="xco5tZ"
                  defaultMessage="Are you sure you want to cancel fulfillment? Canceling a fulfillment will restock products at a selected warehouse."
                />
              </Text>

              <div
                className={classes.selectCcontainer}
                data-test-id="cancel-fulfillment-select-field"
              >
                <Combobox
                  label={intl.formatMessage({
                    id: "aHc89n",
                    defaultMessage: "Select Warehouse",
                    description: "select warehouse to restock items",
                  })}
                  options={choices}
                  fetchOptions={() => undefined}
                  name="warehouseId"
                  value={{
                    label: displayValue,
                    value: formData.warehouseId,
                  }}
                  onChange={handleChange}
                />
              </div>

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
                  disabled={formData.warehouseId === null}
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
