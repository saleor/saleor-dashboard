import {
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import { ConfirmButton } from "@saleor/components/ConfirmButton";
import CustomerAddressChoiceCard from "@saleor/customers/components/CustomerAddressChoiceCard";
import { AddressFragment, AddressTypeEnum } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { buttonMessages } from "@saleor/intl";
import {
  Button,
  ConfirmButtonTransitionState,
  SearchIcon,
} from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import { dialogMessages as messages } from "./messages";
import { useStyles } from "./styles";
import { parseQuery, stringifyAddress } from "./utils";

export interface OrderCustomerAddressesSearchProps {
  type: AddressTypeEnum;
  cloneAddress: boolean;
  formChange: FormChange;
  openFromCustomerChange: boolean;
  transitionState: ConfirmButtonTransitionState;
  selectedCustomerAddressId: string;
  customerAddresses: AddressFragment[];
  onChangeCustomerShippingAddress: (customerAddress: AddressFragment) => void;
  onChangeCustomerBillingAddress: (customerAddress: AddressFragment) => void;
  exitSearch();
}

const OrderCustomerAddressesSearch: React.FC<OrderCustomerAddressesSearchProps> = props => {
  const {
    type,
    cloneAddress,
    formChange,
    transitionState,
    openFromCustomerChange,
    selectedCustomerAddressId,
    customerAddresses,
    onChangeCustomerShippingAddress,
    onChangeCustomerBillingAddress,
    exitSearch,
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const initialAddress = customerAddresses.find(
    getById(selectedCustomerAddressId),
  );

  const [query, setQuery] = React.useState("");
  const [
    temporarySelectedAddress,
    setTemporarySelectedAddress,
  ] = React.useState(initialAddress);

  const handleSelect = () => {
    if (type === AddressTypeEnum.SHIPPING) {
      onChangeCustomerShippingAddress(temporarySelectedAddress);
    } else {
      onChangeCustomerBillingAddress(temporarySelectedAddress);
    }
    if (openFromCustomerChange) {
      exitSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredCustomerAddresses = customerAddresses.filter(address => {
    const parsedAddress = stringifyAddress(address);

    return parsedAddress.search(new RegExp(parseQuery(query), "i")) >= 0;
  });

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        {intl.formatMessage(messages.searchInfo)}
        <VerticalSpacer spacing={2} />
        <TextField
          value={query}
          variant="outlined"
          onChange={handleChange}
          placeholder={"Search addresses"}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{ className: classes.searchInput }}
        />
        <VerticalSpacer spacing={2} />
        <div className={classes.scrollableWrapper}>
          {filteredCustomerAddresses.length === 0
            ? intl.formatMessage(messages.noResultsFound)
            : filteredCustomerAddresses?.map(address => (
                <React.Fragment key={address.id}>
                  <CustomerAddressChoiceCard
                    selected={address.id === temporarySelectedAddress.id}
                    onSelect={() => setTemporarySelectedAddress(address)}
                    address={address}
                  />
                  <VerticalSpacer spacing={2} />
                </React.Fragment>
              ))}
        </div>
        {!openFromCustomerChange && filteredCustomerAddresses.length !== 0 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={cloneAddress}
                name="cloneAddress"
                onChange={() =>
                  formChange({
                    target: {
                      name: "cloneAddress",
                      value: !cloneAddress,
                    },
                  })
                }
              />
            }
            label={intl.formatMessage(
              type === AddressTypeEnum.SHIPPING
                ? messages.billingSameAsShipping
                : messages.shippingSameAsBilling,
            )}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={exitSearch} variant="secondary">
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
          variant="primary"
          transitionState={transitionState}
          type={openFromCustomerChange ? undefined : "submit"}
          onClick={handleSelect}
        >
          <FormattedMessage {...buttonMessages.select} />
        </ConfirmButton>
      </DialogActions>
    </>
  );
};

OrderCustomerAddressesSearch.displayName = "OrderCustomerAddressesSearch";
export default OrderCustomerAddressesSearch;
