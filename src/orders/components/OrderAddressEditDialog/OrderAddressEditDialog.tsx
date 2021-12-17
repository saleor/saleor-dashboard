import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@material-ui/core";
import AddressEdit from "@saleor/components/AddressEdit";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { AddressTypeInput } from "@saleor/customers/types";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AddressInputOptionEnum } from "../OrderCustomerAddressesEditDialog/form";
import OrderCustomerAddressEdit from "../OrderCustomerAddressesEditDialog/OrderCustomerAddressEdit";
import { orderAddressEditDialogMessages as messages } from "./messages";

const useStyles = makeStyles(
  {
    overflow: {
      overflowY: "visible"
    }
  },
  { name: "OrderAddressEditDialog" }
);

interface OrderAddressEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  address: AddressTypeInput;
  open: boolean;
  errors: OrderErrorFragment[];
  variant: "billing" | "shipping" | string;
  countries?: ShopInfo_shop_countries[];
  onClose();
  onConfirm(data: AddressInput);
}

const OrderAddressEditDialog: React.FC<OrderAddressEditDialogProps> = props => {
  const {
    address,
    confirmButtonState,
    open,
    errors = [],
    variant,
    countries = [],
    onClose,
    onConfirm
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
    countries.find(country => address?.country === country.code)?.country
  );
  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onConfirm);
  const dialogErrors = useModalDialogErrors(
    [...errors, ...validationErrors],
    open
  );

  const countryChoices = mapCountriesToChoices(countries);
  const [addressInputOption, setAddressInputOption] = React.useState(
    AddressInputOptionEnum.CUSTOMER_ADDRESS
  );

  return (
    <Dialog onClose={onClose} open={open} classes={{ paper: classes.overflow }}>
      <Form initial={address} onSubmit={handleSubmit}>
        {({ change, data }) => {
          const handleCountrySelect = createSingleAutocompleteSelectHandler(
            change,
            setCountryDisplayName,
            countryChoices
          );

          return (
            <>
              <DialogTitle>
                {variant === "billing"
                  ? intl.formatMessage(messages.billingTitle)
                  : intl.formatMessage(messages.shippingTitle)}
              </DialogTitle>
              <DialogContent className={classes.overflow}>
                <FormattedMessage {...messages.infoLabel} />
                <RadioGroup
                  value={null}
                  onChange={evt => null /* onChangeAddressInputOption(event) */}
                >
                  <FormControlLabel
                    value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
                    label={intl.formatMessage(messages.customerAddressLabel)}
                    control={<Radio color="primary" />}
                  />
                  <FormControlLabel
                    value={AddressInputOptionEnum.NEW_ADDRESS}
                    label={intl.formatMessage(messages.newAddressLabel)}
                    control={<Radio color="primary" />}
                  />
                </RadioGroup>
                {/* <OrderCustomerAddressEdit
                  loading={false}
                  customerAddresses={[]}
                  countryChoices={countryChoices}
                  addressInputOption={addressInputOption}
                  addressInputName="have a nice day"
                  onChangeAddressInputOption={() => null}


                /> */}
                <AddressEdit
                  countries={countryChoices}
                  countryDisplayValue={countryDisplayName}
                  data={data}
                  errors={dialogErrors}
                  onChange={change}
                  onCountryChange={handleCountrySelect}
                />
              </DialogContent>
              <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  data-test-id="order-address-edit-dialog-confirm-button"
                  transitionState={confirmButtonState}
                  type="submit"
                >
                  <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};

OrderAddressEditDialog.displayName = "OrderAddressEditDialog";
export default OrderAddressEditDialog;
